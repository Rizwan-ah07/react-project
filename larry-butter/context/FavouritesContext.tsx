// context/FavouritesContext.tsx

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Character, Spell, DbFavouriteCharacterRow } from "@/types";
import { supabase } from "@/lib/supabase";
import { getDeviceId } from "@/lib/device";


interface FavouritesContextValue {
  favourites: Character[];
  toggleFavourite: (character: Character) => void;
  isFavourite: (id: string) => boolean;

  favouriteSpells: Spell[];
  toggleFavouriteSpell: (spell: Spell) => void;
  isFavouriteSpell: (id: string) => boolean;

  loading: boolean;
}

const FavouritesContext = createContext<FavouritesContextValue | undefined>(undefined);

const STORAGE_KEY_SPELLS = "favouriteSpells";

const FavouritesProvider = ({ children }: { children: ReactNode }) => {
  const [deviceId, setDeviceId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // characters in Supabase
  const [favourites, setFavourites] = useState<Character[]>([]);

  // spells in AsyncStorage
  const [favouriteSpells, setFavouriteSpells] = useState<Spell[]>([]);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const id = await getDeviceId();
        if (cancelled) return;
        setDeviceId(id);

        // load spells (AsyncStorage)
        const storedSpells = await AsyncStorage.getItem(STORAGE_KEY_SPELLS);
        if (!cancelled && storedSpells) {
          setFavouriteSpells(JSON.parse(storedSpells));
        }

        // load character favourites (Supabase)
        const { data, error } = await supabase
          .from("favourite_characters")
          .select("device_id, character_id, name, house, image")
          .eq("device_id", id);

        if (error) throw error;
        if (cancelled) return;

        const mapped: Character[] = (data as DbFavouriteCharacterRow[]).map((row) => ({
          id: row.character_id,
          name: row.name,
          house: row.house ?? "",
          image: row.image ?? undefined,
        }));

        setFavourites(mapped);
      } catch (e) {
        console.log("Error initializing favourites", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  // save spells favourites to AsyncStorage
  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY_SPELLS, JSON.stringify(favouriteSpells));
      } catch (e) {
        console.log("Error saving favourite spells", e);
      }
    };

    if (!loading) save();
  }, [favouriteSpells, loading]);

  const isFavourite = (id: string) => favourites.some((c) => c.id === id);

const toggleFavourite = (character: Character) => {
  if (!deviceId) return;

  const exists = favourites.some((c) => c.id === character.id);

  // optimistic UI update
  setFavourites((current) => {
    if (exists) {
      return current.filter((c) => c.id !== character.id);
    }
    return [...current, character];
  });

  // write to Supabase in background
  (async () => {
    try {
      if (exists) {
        // remove favourite
        const { error } = await supabase
          .from("favourite_characters")
          .delete()
          .eq("device_id", deviceId)
          .eq("character_id", character.id);

        if (error) throw error;
      } else {
        // add favourite
        const { error } = await supabase
          .from("favourite_characters")
          .insert({
            device_id: deviceId,
            character_id: character.id,
            name: character.name,
            house: character.house ?? null,
            image: character.image ?? null,
          });

        if (error) throw error;
      }
    } catch (e) {
      console.log("Error toggling favourite character", e);

      // rollback UI if DB fails
      setFavourites((current) => {
        const stillExists = current.some((c) => c.id === character.id);

        if (exists && !stillExists) return [...current, character];
        if (!exists && stillExists) return current.filter((c) => c.id !== character.id);

        return current;
      });
    }
  })();
};



  const toggleFavouriteSpell = (spell: Spell) => {
    setFavouriteSpells((current) => {
      const exists = current.some((s) => s.id === spell.id);
      if (exists) return current.filter((s) => s.id !== spell.id);
      return [...current, spell];
    });
  };

  const isFavouriteSpell = (id: string) => favouriteSpells.some((s) => s.id === id);

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        toggleFavourite,
        isFavourite,

        favouriteSpells,
        toggleFavouriteSpell,
        isFavouriteSpell,

        loading,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used within a FavouritesProvider");
  return ctx;
};

export default FavouritesProvider;
