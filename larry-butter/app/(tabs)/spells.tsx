// app/(tabs)/spells.tsx
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { Link } from "expo-router";

import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // <--- 1. Import Badge
import { useFavourites } from "@/context/FavouritesContext";
import { Spell } from "@/types";

type ApiSpell = {
  id: number;
  name: string;
  description?: string;
  type?: string;
  difficulty?: string;
};

// <--- 2. Deleted 'spellPill' helper function

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
                    
                    {/* <--- 3. Using the new Badge component here */}
                    <View className="flex-row gap-2 mt-2">
                      <Badge label={item.type} />
                      <Badge label={item.difficulty} />
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