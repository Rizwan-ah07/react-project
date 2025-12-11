// app/(tabs)/characters.tsx
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { Text } from "@/components/ui/text";
import { Character } from "@/types";
import { useFavourites } from "@/context/FavouritesContext";

const CHARACTERS_URL =
  "https://sampleapis.assimilate.be/harrypotter/characters";

const CharactersScreen = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { toggleFavourite, isFavourite } = useFavourites();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const loadCharacters = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(CHARACTERS_URL);
        const json = await response.json();

        if (cancelled) return;

        const mapped: Character[] = json.map((item: any) => ({
          id: String(item.id ?? item.slug ?? item.name),
          name: item.name ?? "Unknown",
          house: item.house ?? "Unknown",
          image: item.image,
          actor: item.actor,
          ancestry: item.ancestry,
          patronus: item.patronus,
        }));

        setCharacters(mapped);
      } catch (e) {
        console.log(e);
        if (!cancelled) {
          setError("Failed to load characters");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCharacters();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <ActivityIndicator animating={true} />;
  }

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
        ItemSeparatorComponent={() => (
          <View className="h-[1px] bg-neutral-200" />
        )}
        renderItem={({ item }) => {
          const favourite = isFavourite(item.id);

          // inside renderItem in CharactersScreen

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
                    actor: item.actor ?? "",
                    ancestry: item.ancestry ?? "",
                    patronus: item.patronus ?? "",
                    image: item.image ?? "",
                  },
                })
              }
              onLongPress={() => toggleFavourite(item)}
            >
              <View>
                <Text className="text-base font-semibold">
                  {item.name}
                </Text>
                <Text className="text-sm text-neutral-500">
                  {item.house}
                </Text>
              </View>

              <Text
                className={
                  favourite
                    ? "text-red-500 text-lg"
                    : "text-neutral-300 text-lg"
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
