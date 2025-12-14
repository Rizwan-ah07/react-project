// app/(tabs)/spells.tsx
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { Link } from "expo-router";

import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useFavourites } from "@/context/FavouritesContext";
import { Spell } from "@/types";

type ApiSpell = {
  id: number;
  name: string;
  description?: string;
  type?: string;
  difficulty?: string;
};

const spellPill = (label?: string) => {
  const v = (label ?? "").toLowerCase();

  if (v === "curse") return "bg-red-500/10 border-red-500/30 text-red-700";
  if (v === "charm") return "bg-blue-500/10 border-blue-500/30 text-blue-700";
  if (v === "hex") return "bg-purple-500/10 border-purple-500/30 text-purple-700";
  if (v === "jinx") return "bg-amber-500/10 border-amber-500/30 text-amber-800";
  if (v === "healing") return "bg-emerald-500/10 border-emerald-500/30 text-emerald-700";

  return "bg-muted border-border text-muted-foreground";
};


const SpellsScreen = () => {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { toggleFavouriteSpell, isFavouriteSpell } = useFavourites();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(
          "https://sampleapis.assimilate.be/harrypotter/spells"
        );
        const json: ApiSpell[] = await res.json();

        if (cancelled) return;

        const mapped: Spell[] = json.map((s) => ({
          id: String(s.id),
          name: s.name ?? "Unknown spell",
          description: s.description ?? "",
          type: s.type,
          difficulty: s.difficulty,
        }));

        setSpells(mapped);
      } catch (e) {
        console.log("Error loading spells", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator animating={true} />
        <Text className="text-muted-foreground mt-3">Loading spells…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold">Spells</Text>
        <Text className="text-muted-foreground mt-1">
          Tap a spell for details
        </Text>
      </View>

      <FlatList
        data={spells}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => {
          const fav = isFavouriteSpell(item.id);

          return (
            <View className="bg-card border border-border rounded-2xl p-4">
            <Link
              href={{
                pathname: "/spells/[id]",
                params: {
                  id: item.id,
                  name: item.name,
                  description: item.description ?? "",
                  type: item.type ?? "",
                  difficulty: item.difficulty ?? "",
                },
              }}
              asChild
            >
                <Pressable className="flex-row items-start gap-3">
                  <View className="w-11 h-11 rounded-full bg-muted border border-border items-center justify-center">
                    <Text className="text-lg">✨</Text>
                  </View>

                  <View className="flex-1">
                    <Text className="font-semibold text-lg">{item.name}</Text>
                    <Text
                      className="text-muted-foreground mt-1"
                      numberOfLines={2}
                    >
                      {item.description && item.description.length > 0
                        ? item.description
                        : "No description"}
                    </Text>
                    <View className="flex-row gap-2 mt-2">
                    {item.type ? (
                      <View className={`px-2.5 py-1 rounded-full border ${spellPill(item.type)}`}>
                        <Text className="text-xs">{item.type}</Text>
                      </View>
                    ) : null}

                    {item.difficulty ? (
                      <View className={`px-2.5 py-1 rounded-full border ${spellPill(item.difficulty)}`}>
                        <Text className="text-xs">{item.difficulty}</Text>
                      </View>
                    ) : null}
                  </View>
                  </View>
                </Pressable>
              </Link>

              <View className="mt-4">
                <Button
                  variant={fav ? "outline" : "default"}
                  onPress={() => toggleFavouriteSpell(item)}
                >
                  <Text>{fav ? "Remove favourite" : "Add favourite"}</Text>
                </Button>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default SpellsScreen;
