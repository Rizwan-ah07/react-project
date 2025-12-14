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
import { Badge } from "@/components/ui/badge"; // <--- 1. Import Badge

const CHARACTERS_URL =
  "https://sampleapis.assimilate.be/harrypotter/characters";

type ApiCharacter = {
  id: number;
  name: string;
  house: string;
  role?: string;
  description?: string;
};

// <--- 2. Deleted 'housePill' function from here

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

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator animating={true} />
        <Text className="text-muted-foreground mt-3">Loading characters…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-xl font-semibold mb-2">Something went wrong</Text>
        <Text className="text-muted-foreground text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold">Characters</Text>
        <Text className="text-muted-foreground mt-1">
          Tap to view details • Long press to favourite
        </Text>
      </View>

      <FlatList
        data={characters}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => {
          const favourite = isFavourite(item.id);
          const img = imagesById[item.id];
          const initial = item.name?.trim()?.[0]?.toUpperCase() ?? "?";

          return (
            <Pressable
              className="bg-card border border-border rounded-2xl p-4 flex-row items-center justify-between"
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
              <View className="flex-row items-center gap-3 flex-1 pr-3">
                {img ? (
                  <Image
                    source={{ uri: img }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                  />
                ) : (
                  <View className="w-12 h-12 rounded-full bg-muted border border-border items-center justify-center">
                    <Text className="text-sm font-bold text-muted-foreground">
                      {initial}
                    </Text>
                  </View>
                )}

                <View className="flex-1">
                  <Text className="text-base font-semibold">{item.name}</Text>

                  <View className="flex-row items-center gap-2 mt-2">
                    {/* <--- 3. Using the new Badge component here */}
                    <Badge label={item.house} />

                    {item.role ? (
                      <Text
                        className="text-xs text-muted-foreground"
                        numberOfLines={1}
                      >
                        {item.role}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View className="px-3 py-2 rounded-full bg-muted border border-border">
                <Text
                  className={
                    favourite
                      ? "text-red-500 text-lg"
                      : "text-muted-foreground text-lg"
                  }
                >
                  {favourite ? "♥" : "♡"}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default CharactersScreen;