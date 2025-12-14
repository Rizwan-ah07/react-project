// app/(tabs)/favourites.tsx
import { useCallback, useState } from "react";
import { View, FlatList, Pressable, Image } from "react-native";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge"; // <--- 1. Import Badge
import { useFavourites } from "@/context/FavouritesContext";
import { getCharacterImage } from "@/lib/characterImages";

// <--- 2. Deleted 'pillStyle' and 'housePill' helper functions

type FavouriteRow =
  | {
      kind: "character";
      id: string;
      title: string;
      subtitle?: string;
      house?: string;
      role?: string;
    }
  | {
      kind: "spell";
      id: string;
      title: string;
      subtitle?: string;
      type?: string;
      difficulty?: string;
    };

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
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Loading…</Text>
      </View>
    );
  }

  const rows: FavouriteRow[] = [
    ...favourites.map((c) => ({
      kind: "character" as const,
      id: c.id,
      title: c.name,
      subtitle: c.description ? c.description : undefined,
      house: c.house,
      role: c.role,
    })),
    ...favouriteSpells.map((s) => ({
      kind: "spell" as const,
      id: s.id,
      title: s.name,
      subtitle: s.description ? s.description : "Spell",
      type: s.type ?? "",
      difficulty: s.difficulty ?? "",
    })),
  ];

  if (rows.length === 0) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-2xl font-bold mb-2">No favourites yet</Text>
        <Text className="text-muted-foreground text-center">
          Add characters or spells to your favourites.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold">Favourites</Text>
        <Text className="text-muted-foreground mt-1">
          {favourites.length} characters • {favouriteSpells.length} spells
        </Text>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => `${item.kind}-${item.id}`}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => {
          const img = item.kind === "character" ? imagesById[item.id] : null;

          const card = (
            <Pressable className="bg-card border border-border rounded-2xl p-4 flex-row items-center gap-3">
              {/* Left */}
              {item.kind === "character" ? (
                img ? (
                  <Image
                    source={{ uri: img }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                  />
                ) : (
                  <View className="w-12 h-12 rounded-full bg-muted border border-border items-center justify-center">
                    <Text className="text-sm font-bold text-muted-foreground">
                      {item.title?.trim()?.[0]?.toUpperCase() ?? "?"}
                    </Text>
                  </View>
                )
              ) : (
                <View className="w-12 h-12 rounded-full bg-muted border border-border items-center justify-center">
                  <Text className="text-lg">✨</Text>
                </View>
              )}

              {/* Middle */}
              <View className="flex-1">
                <Text className="font-semibold text-lg">{item.title}</Text>

                {item.subtitle ? (
                  <Text
                    className="text-muted-foreground mt-1"
                    numberOfLines={2}
                  >
                    {item.subtitle}
                  </Text>
                ) : null}

                {/* <--- 3. Replaced Spell pills with Badge */}
                {item.kind === "spell" ? (
                  <View className="flex-row gap-2 mt-2">
                    <Badge label={item.type} />
                    <Badge label={item.difficulty} />
                  </View>
                ) : null}

                {/* <--- 4. Replaced Character house pill with Badge */}
                {item.kind === "character" ? (
                  <View className="flex-row items-center gap-2 mt-2">
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
                ) : null}

                {/* Bottom Right Tag */}
                <View className="mt-2">
                  <Badge
                    label={item.kind === "character" ? "Character" : "Spell"}
                    // The Badge defaults to gray, so this matches your original style
                  />
                </View>
              </View>
            </Pressable>
          );

          if (item.kind === "character") {
            return (
              <Link
                href={{
                  pathname: "/characters/[id]",
                  params: {
                    id: item.id,
                    name: item.title,
                    house: item.house ?? "Unknown",
                    role: item.role ?? "",
                    description: item.subtitle ?? "",
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
                  type: item.type ?? "",
                  difficulty: item.difficulty ?? "",
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