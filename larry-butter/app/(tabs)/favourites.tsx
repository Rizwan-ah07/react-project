// app/(tabs)/favourites.tsx

import { View, FlatList, Pressable } from "react-native";
import { Link } from "expo-router";

import { Text } from "@/components/ui/text";
import { useFavourites } from "@/context/FavouritesContext";

type FavouriteRow =
  | { kind: "character"; id: string; title: string; subtitle?: string }
  | { kind: "spell"; id: string; title: string; subtitle?: string };

const FavouritesScreen = () => {
  const { favourites, favouriteSpells, loading } = useFavourites();

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
          const card = (
            <Pressable className="bg-muted rounded-xl p-4">
              <Text className="font-semibold text-lg">{item.title}</Text>
              {item.subtitle ? (
                <Text className="text-muted-foreground mt-1" numberOfLines={2}>
                  {item.subtitle}
                </Text>
              ) : null}
              <Text className="text-xs text-muted-foreground mt-2">
                {item.kind === "character" ? "Character" : "Spell"}
              </Text>
            </Pressable>
          );

          // Link to the right detail page
          if (item.kind === "character") {
            return (
              <Link href={`/characters/${item.id}`} asChild>
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
