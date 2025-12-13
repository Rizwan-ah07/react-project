// app/spells/[id].tsx

import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useFavourites } from "@/context/FavouritesContext";

const SpellDetailScreen = () => {
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    description?: string;
  }>();

  const { toggleFavouriteSpell, isFavouriteSpell } = useFavourites();

  const id = typeof params.id === "string" ? params.id : "";

  const name =
    typeof params.name === "string" && params.name.length > 0
      ? params.name
      : "Unknown spell";

  const description =
    typeof params.description === "string" && params.description.length > 0
      ? params.description
      : "No description available for this spell.";

  const favourite = id ? isFavouriteSpell(id) : false;

  return (
    <View className="flex-1 bg-background px-6 pt-10">
      <Stack.Screen options={{ title: "Spell details" }} />

      {/* Header */}
      <View className="items-center mb-10">
        <View className="w-32 h-32 rounded-full bg-muted items-center justify-center mb-4">
          <Text className="text-muted-foreground">Spell</Text>
        </View>

        <Text className="text-2xl font-bold mb-1 text-center">{name}</Text>
        <Text className="text-xs text-muted-foreground">
          Incantation from the wizarding world
        </Text>
      </View>

      {/* Details */}
      <View className="gap-3">
        <Text className="text-sm font-semibold text-muted-foreground">
          DESCRIPTION
        </Text>
        <Text className="leading-6">{description}</Text>
      </View>

      {/* Favourite button */}
      <View className="mt-10 items-center">
        <Button
          variant={favourite ? "outline" : "default"}
          onPress={() => {
            if (!id) return;

            toggleFavouriteSpell({
              id,
              name,
              description,
            });
          }}
        >
          <Text>
            {favourite ? "Remove from favourite spells" : "Add to favourite spells"}
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default SpellDetailScreen;
