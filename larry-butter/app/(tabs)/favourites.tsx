// app/(tabs)/favourites.tsx
import { useCallback, useState } from "react";
import { View, FlatList, Pressable, Image } from "react-native";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { Text } from "@/components/ui/text";
import { useFavourites } from "@/context/FavouritesContext";
import { getCharacterImage } from "@/lib/characterImages";

type FavouriteRow =
  | { kind: "character"; id: string; title: string; subtitle?: string }
  | { kind: "spell"; id: string; title: string; subtitle?: string };

const FavouritesScreen = () => {
  const { favourites, favouriteSpells, loading } = useFavourites();

  const [imagesById, setImagesById] = useState<Record<string, string | null>>(
    {}
  );

  // Reload images when coming back to this screen
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const load = async () => {
        try {
          const entries = await Promise.all(
            favourites.map(async (c) => {
              const uri = await getCharacterImage(c.id);
              return [c.id, uri] as const;
            })
          );

          if (cancelled) return;

          const next: Record<string, string | null> = {};
          for (const [id, uri] of entries) next[id] = uri;

          setImagesById(next);
        } catch (e) {
          console.log("Error loading favourite images", e);
        }
      };

      load();

      return () => {
        cancelled = true;
      };
    }, [favourites])
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  const rows: FavouriteRow[] = [
    ...favourites.map((c) => ({
      kind: "character" as const,
      id: c.id,
      title: c.name,
      subtitle: c.house ? `House: ${c.house}` : "Character",
    })),
    ...favouriteSpells.map((s) => ({
      kind: "spell" as const,
      id: s.id,
      title: s.name,
      subtitle: s.description ? s.description : "Spell",
    })),
  ];

  if (rows.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-xl font-semibold mb-2">No favourites yet</Text>
        <Text className="text-muted-foreground text-center">
          Add characters or spells to your favourites.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 pt-4">
      <Text className="text-2xl font-bold mb-3">Favourites</Text>

      <FlatList
        data={rows}
        keyExtractor={(item) => `${item.kind}-${item.id}`}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => {
          const img = item.kind === "character" ? imagesById[item.id] : null;

          const card = (
            <Pressable className="bg-muted rounded-xl p-4 flex-row items-center gap-3">
              {item.kind === "character" ? (
                img ? (
                  <Image
                    source={{ uri: img }}
                    style={{ width: 44, height: 44, borderRadius: 22 }}
                  />
                ) : (
                  <View className="w-11 h-11 rounded-full bg-neutral-200 items-center justify-center">
                    <Text className="text-xs text-neutral-500">N/A</Text>
                  </View>
                )
              ) : null}

              <View className="flex-1">
                <Text className="font-semibold text-lg">{item.title}</Text>

                {item.subtitle ? (
                  <Text className="text-muted-foreground mt-1" numberOfLines={2}>
                    {item.subtitle}
                  </Text>
                ) : null}

                <Text className="text-xs text-muted-foreground mt-2">
                  {item.kind === "character" ? "Character" : "Spell"}
                </Text>
              </View>
            </Pressable>
          );

          if (item.kind === "character") {
            const character = favourites.find((c) => c.id === item.id);

            return (
              <Link
                href={{
                  pathname: "/characters/[id]",
                  params: {
                    id: item.id,
                    name: character?.name ?? item.title,
                    house: character?.house ?? "Unknown",
                    role: character?.role ?? "",
                    description: character?.description ?? "",
                  },
                }}
                asChild
              >
                {card}
              </Link>
            );
          }

          return (
            <Link
              href={{
                pathname: "/spells/[id]",
                params: {
                  id: item.id,
                  name: item.title,
                  description: item.subtitle ?? "",
                },
              }}
              asChild
            >
              {card}
            </Link>
          );
        }}
      />
    </View>
  );
};

export default FavouritesScreen;
