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
};

const SpellsScreen = () => {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { toggleFavouriteSpell, isFavouriteSpell } = useFavourites();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("https://sampleapis.assimilate.be/harrypotter/spells");
        const json: ApiSpell[] = await res.json();

        if (cancelled) return;

        const mapped: Spell[] = json.map((s) => ({
          id: String(s.id),
          name: s.name ?? "Unknown spell",
          description: s.description ?? "",
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
    return <ActivityIndicator animating={true} />;
  }

  return (
    <View className="flex-1 bg-background px-4 pt-4">
      <Text className="text-2xl font-bold mb-3">Spells</Text>

      <FlatList
        data={spells}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => {
          const fav = isFavouriteSpell(item.id);

          return (
            <View className="bg-muted rounded-xl p-4">
              <Link
                href={{
                  pathname: "/spells/[id]",
                  params: {
                    id: item.id,
                    name: item.name,
                    description: item.description ?? "",
                  },
                }}
                asChild
              >
                <Pressable>
                  <Text className="font-semibold text-lg">{item.name}</Text>
                  <Text className="text-muted-foreground mt-1" numberOfLines={2}>
                    {item.description && item.description.length > 0
                      ? item.description
                      : "No description"}
                  </Text>
                </Pressable>
              </Link>

              <View className="mt-3">
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
