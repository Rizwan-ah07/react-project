import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Character, Spell } from "@/types";

interface FavouritesContextValue {
  // Characters
  favourites: Character[];
  toggleFavourite: (character: Character) => void;
  isFavourite: (id: string) => boolean;

  // Spells
  favouriteSpells: Spell[];
  toggleFavouriteSpell: (spell: Spell) => void;
  isFavouriteSpell: (id: string) => boolean;

  // Shared
  loading: boolean;
}

const FavouritesContext = createContext<FavouritesContextValue | undefined>(undefined);

const STORAGE_KEY_CHARACTERS = "favouriteCharacters";
const STORAGE_KEY_SPELLS = "favouriteSpells";

const FavouritesProvider = ({ children }: { children: ReactNode }) => {
  const [favourites, setFavourites] = useState<Character[]>([]);
  const [favouriteSpells, setFavouriteSpells] = useState<Spell[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // load from AsyncStorage on start
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const storedCharacters = await AsyncStorage.getItem(STORAGE_KEY_CHARACTERS);
        const storedSpells = await AsyncStorage.getItem(STORAGE_KEY_SPELLS);

        if (cancelled) return;

        if (storedCharacters) {
          setFavourites(JSON.parse(storedCharacters));
        }

        if (storedSpells) {
          setFavouriteSpells(JSON.parse(storedSpells));
        }
      } catch (e) {
        console.log("Error loading favourites", e);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // save characters to AsyncStorage when favourites change
  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY_CHARACTERS, JSON.stringify(favourites));
      } catch (e) {
        console.log("Error saving favourite characters", e);
      }
    };

    if (!loading) {
      save();
    }
  }, [favourites, loading]);

  // save spells to AsyncStorage when favouriteSpells change
  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY_SPELLS, JSON.stringify(favouriteSpells));
      } catch (e) {
        console.log("Error saving favourite spells", e);
      }
    };

    if (!loading) {
      save();
    }
  }, [favouriteSpells, loading]);

  // Characters
  const toggleFavourite = (character: Character) => {
    setFavourites((current) => {
      const exists = current.some((c) => c.id === character.id);
      if (exists) {
        return current.filter((c) => c.id !== character.id);
      }
      return [...current, character];
    });
  };

  const isFavourite = (id: string) => favourites.some((c) => c.id === id);

  // Spells
  const toggleFavouriteSpell = (spell: Spell) => {
    setFavouriteSpells((current) => {
      const exists = current.some((s) => s.id === spell.id);
      if (exists) {
        return current.filter((s) => s.id !== spell.id);
      }
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
  if (!ctx) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }
  return ctx;
};

export default FavouritesProvider;
