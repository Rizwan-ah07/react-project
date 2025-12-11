import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Character } from "@/types";

interface FavouritesContextValue {
  favourites: Character[];
  loading: boolean;
  toggleFavourite: (character: Character) => void;
  isFavourite: (id: string) => boolean;
}

const FavouritesContext = createContext<FavouritesContextValue | undefined>(undefined);

const STORAGE_KEY = "favouriteCharacters";

const FavouritesProvider = ({ children }: { children: ReactNode }) => {
  const [favourites, setFavourites] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // load from AsyncStorage on start
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;

        if (stored) {
          setFavourites(JSON.parse(stored));
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

  // save to AsyncStorage when favourites change
  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
      } catch (e) {
        console.log("Error saving favourites", e);
      }
    };

    // avoid writing before initial load
    if (!loading) {
      save();
    }
  }, [favourites, loading]);

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

  return (
    <FavouritesContext.Provider
      value={{ favourites, loading, toggleFavourite, isFavourite }}
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
