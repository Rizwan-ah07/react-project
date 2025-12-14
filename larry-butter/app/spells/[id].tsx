// app/spells/[id].tsx
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useFavourites } from "@/context/FavouritesContext";

const pillStyle = (value: string) => {
  const v = value.toLowerCase();

  if (v.includes("beginner")) {
    return { box: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-700" };
  }
  if (v.includes("intermediate")) {
    return { box: "bg-blue-500/10 border-blue-500/20", text: "text-blue-700" };
  }
  if (v.includes("advanced")) {
    return { box: "bg-purple-500/10 border-purple-500/20", text: "text-purple-700" };
  }

  if (v.includes("curse")) {
    return { box: "bg-red-500/10 border-red-500/20", text: "text-red-700" };
  }
  if (v.includes("hex")) {
    return { box: "bg-orange-500/10 border-orange-500/20", text: "text-orange-700" };
  }
  if (v.includes("jinx")) {
    return { box: "bg-yellow-500/10 border-yellow-500/20", text: "text-yellow-800" };
  }
  if (v.includes("charm") || v.includes("healing")) {
    return { box: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-700" };
  }

  return { box: "bg-muted border-border", text: "text-muted-foreground" };
};

const SpellDetailScreen = () => {
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    description?: string;
    type?: string;
    difficulty?: string;
  }>();

  const { toggleFavouriteSpell, isFavouriteSpell } = useFavourites();

  const id = typeof params.id === "string" ? params.id : "";

  const name =
    typeof params.name === "string" && params.name.length > 0 ? params.name : "Unknown spell";

  const description =
    typeof params.description === "string" && params.description.length > 0
      ? params.description
      : "No description available for this spell.";

  const type = typeof params.type === "string" && params.type.length > 0 ? params.type : "";
  const difficulty =
    typeof params.difficulty === "string" && params.difficulty.length > 0 ? params.difficulty : "";

  const favourite = id ? isFavouriteSpell(id) : false;

  return (
    <View className="flex-1 bg-background px-6 pt-10">
      <Stack.Screen options={{ title: "Spell details" }} />

      {/* Header */}
      <View className="items-center mb-8">
        <View className="w-24 h-24 rounded-full bg-muted items-center justify-center mb-4">
          <Text className="text-muted-foreground">Spell</Text>
        </View>

        <Text className="text-2xl font-bold mb-2 text-center">{name}</Text>

        {(type || difficulty) ? (
          <View className="flex-row gap-2">
            {type ? (
              <View className={`px-2.5 py-1 rounded-full border ${pillStyle(type).box}`}>
                <Text className={`text-xs ${pillStyle(type).text}`}>{type}</Text>
              </View>
            ) : null}

            {difficulty ? (
              <View className={`px-2.5 py-1 rounded-full border ${pillStyle(difficulty).box}`}>
                <Text className={`text-xs ${pillStyle(difficulty).text}`}>{difficulty}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* Details */}
      <View className="gap-3">
        <Text className="text-sm font-semibold text-muted-foreground">DESCRIPTION</Text>
        <Text className="leading-6">{description}</Text>
      </View>

      {/* Favourite button */}
      <View className="mt-10 items-center">
        <Button
          variant={favourite ? "outline" : "default"}
          onPress={() => {
            if (!id) return;
            toggleFavouriteSpell({ id, name, description, type, difficulty });
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
