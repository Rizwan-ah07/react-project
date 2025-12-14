// app/(tabs)/favourites.tsx
import { useCallback, useState } from "react";
import { View, FlatList, Pressable, Image, Role } from "react-native";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { Text } from "@/components/ui/text";
import { useFavourites } from "@/context/FavouritesContext";
import { getCharacterImage } from "@/lib/characterImages";

const pillStyle = (value: string) => {
  const v = value.toLowerCase();

  if (v.includes("beginner")) return { box: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-700" };
  if (v.includes("intermediate")) return { box: "bg-blue-500/10 border-blue-500/20", text: "text-blue-700" };
  if (v.includes("advanced")) return { box: "bg-purple-500/10 border-purple-500/20", text: "text-purple-700" };

  if (v.includes("curse")) return { box: "bg-red-500/10 border-red-500/20", text: "text-red-700" };
  if (v.includes("hex")) return { box: "bg-orange-500/10 border-orange-500/20", text: "text-orange-700" };
  if (v.includes("jinx")) return { box: "bg-yellow-500/10 border-yellow-500/20", text: "text-yellow-800" };
  if (v.includes("charm") || v.includes("healing"))
    return { box: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-700" };

  return { box: "bg-muted border-border", text: "text-muted-foreground" };
};

const housePill = (house?: string) => {
  const h = (house ?? "").toLowerCase();

  if (h === "gryffindor") return "bg-red-500/10 border-red-500/30 text-red-700";
  if (h === "slytherin") return "bg-emerald-500/10 border-emerald-500/30 text-emerald-700";
  if (h === "ravenclaw") return "bg-blue-500/10 border-blue-500/30 text-blue-700";
  if (h === "hufflepuff") return "bg-amber-500/10 border-amber-500/30 text-amber-800";

  return "bg-muted border-border text-muted-foreground";
};


type FavouriteRow =
  | { kind: "character"; id: string; title: string; subtitle?: string; house?: string; role?: string }
  | { kind: "spell"; id: string; title: string; subtitle?: string; type?: string; difficulty?: string };

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
                  <Text className="text-muted-foreground mt-1" numberOfLines={2}>
                    {item.subtitle}
                  </Text>
                ) : null}

                {/* ✅ Spell pills go HERE */}
                {item.kind === "spell" ? (
                  <View className="flex-row gap-2 mt-2">
                    {item.type ? (
                      <View className={`px-2.5 py-1 rounded-full border ${pillStyle(item.type).box}`}>
                        <Text className={`text-xs ${pillStyle(item.type).text}`}>{item.type}</Text>
                      </View>
                    ) : null}


                    {item.difficulty ? (
                      <View className={`px-2.5 py-1 rounded-full border ${pillStyle(item.difficulty).box}`}>
                        <Text className={`text-xs ${pillStyle(item.difficulty).text}`}>{item.difficulty}</Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {item.kind === "character" ? (
                  <View className="flex-row items-center gap-2 mt-2">
                    {item.house ? (
                      <View className={`px-2.5 py-1 rounded-full border ${housePill(item.house)}`}>
                        <Text className="text-xs">{item.house}</Text>
                      </View>
                    ) : null}

                    {item.role ? (
                      <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                        {item.role}
                      </Text>
                    ) : null}
                  </View>
                ) : null}


                <View className="mt-2">
                  <View className="self-start px-2.5 py-1 rounded-full bg-muted border border-border">
                    <Text className="text-xs text-muted-foreground">
                      {item.kind === "character" ? "Character" : "Spell"}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          );

          if (item.kind === "character") {
            // const character = favourites.find((c) => c.id === item.id);

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
