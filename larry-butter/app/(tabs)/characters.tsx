// app/(tabs)/characters.tsx
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { Text } from "@/components/ui/text";
import { Character } from "@/types";
import { useFavourites } from "@/context/FavouritesContext";
import { getCharacterImage } from "@/lib/characterImages";

const CHARACTERS_URL =
  "https://sampleapis.assimilate.be/harrypotter/characters";

type ApiCharacter = {
  id: number;
  name: string;
  house: string;
  role?: string;
  description?: string;
};

const CharactersScreen = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // id -> imageUri
  const [imagesById, setImagesById] = useState<Record<string, string | null>>(
    {}
  );

  const { toggleFavourite, isFavourite } = useFavourites();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const loadCharacters = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(CHARACTERS_URL);
        const json: ApiCharacter[] = await response.json();

        if (cancelled) return;

        const mapped: Character[] = json.map((item) => ({
          id: String(item.id),
          name: item.name ?? "Unknown",
          house: item.house ?? "Unknown",
          role: item.role,
          description: item.description,
        }));

        setCharacters(mapped);
      } catch (e) {
        console.log(e);
        if (!cancelled) setError("Failed to load characters");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCharacters();

    return () => {
      cancelled = true;
    };
  }, []);

  // reload images whenever screen becomes active (so after you pick an image)
  const loadImages = useCallback(async () => {
    try {
      const entries = await Promise.all(
        characters.map(async (c) => {
          const uri = await getCharacterImage(c.id);
          return [c.id, uri] as const;
        })
      );

      const next: Record<string, string | null> = {};
      for (const [id, uri] of entries) next[id] = uri;

      setImagesById(next);
    } catch (e) {
      console.log("Error loading character images", e);
    }
  }, [characters]);

  useFocusEffect(
    useCallback(() => {
      if (characters.length > 0) loadImages();
    }, [characters.length, loadImages])
  );

  if (loading) return <ActivityIndicator animating={true} />;

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-neutral-200" />}
        renderItem={({ item }) => {
          const favourite = isFavourite(item.id);
          const img = imagesById[item.id];

          return (
            <Pressable
              className="flex-row items-center justify-between py-3"
              onPress={() =>
                router.push({
                  pathname: "/characters/[id]",
                  params: {
                    id: item.id,
                    name: item.name,
                    house: item.house,
                    role: item.role ?? "",
                    description: item.description ?? "",
                  },
                })
              }
              onLongPress={() => toggleFavourite(item)}
            >
              <View className="flex-row items-center gap-3">
                {img ? (
                  <Image
                    source={{ uri: img }}
                    style={{ width: 44, height: 44, borderRadius: 22 }}
                  />
                ) : (
                  <View className="w-11 h-11 rounded-full bg-neutral-200 items-center justify-center">
                    <Text className="text-xs text-neutral-500">N/A</Text>
                  </View>
                )}

                <View>
                  <Text className="text-base font-semibold">{item.name}</Text>
                  <Text className="text-sm text-neutral-500">{item.house}</Text>
                </View>
              </View>

              <Text
                className={
                  favourite ? "text-red-500 text-lg" : "text-neutral-300 text-lg"
                }
              >
                {favourite ? "♥" : "♡"}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default CharactersScreen;
