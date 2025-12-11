// app/characters/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, View } from "react-native";

import { Text } from "@/components/ui/text";
import { useFavourites } from "@/context/FavouritesContext";
import { Character } from "@/types";
import { Pressable } from "react-native";

const CharacterDetailsScreen = () => {
  const params = useLocalSearchParams<{
    id: string;
    name?: string;
    house?: string;
    actor?: string;
    ancestry?: string;
    patronus?: string;
    image?: string;
  }>();

  const { id, name, house, actor, ancestry, patronus, image } = params;

  const { toggleFavourite, isFavourite } = useFavourites();

  const character: Character = {
    id: String(id),
    name: name || "Unknown",
    house: house || "Unknown",
    actor: actor || undefined,
    ancestry: ancestry || undefined,
    patronus: patronus || undefined,
    image: image || undefined,
  };

  const favourite = isFavourite(character.id);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center px-6 pt-10 pb-6">
        {/* Avatar / Image */}
        {character.image ? (
          <Image
            source={{ uri: character.image }}
            style={{
              width: 160,
              height: 160,
              borderRadius: 9999,
              marginBottom: 16,
              backgroundColor: "#e5e5e5",
            }}
            resizeMode="cover"
          />
        ) : (
          <View
            className="w-40 h-40 rounded-full bg-neutral-200 mb-4 items-center justify-center"
          >
            <Text className="text-neutral-500">No image</Text>
          </View>
        )}

        {/* Name + house */}
        <Text className="text-2xl font-bold mb-1">
          {character.name}
        </Text>

        <Text className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs mb-4">
          {character.house || "No house info"}
        </Text>

        {/* Favourite toggle */}
        <Pressable
          onPress={() => toggleFavourite(character)}
          className="px-4 py-2 border border-neutral-300 rounded-full flex-row items-center mb-6"
        >
          <Text
            className={
              favourite
                ? "text-red-500 text-lg mr-2"
                : "text-neutral-400 text-lg mr-2"
            }
          >
            {favourite ? "♥" : "♡"}
          </Text>
          <Text className="text-sm">
            {favourite ? "Remove from favourites" : "Add to favourites"}
          </Text>
        </Pressable>
      </View>

      {/* Info section */}
      <View className="px-6 pb-10">
        <Text className="text-lg font-semibold mb-3">
          Details
        </Text>

        <InfoRow label="Actor" value={character.actor} />
        <InfoRow label="Ancestry" value={character.ancestry} />
        <InfoRow label="Patronus" value={character.patronus} />
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => {
  return (
    <View className="mb-2">
      <Text className="text-xs text-neutral-500 uppercase">
        {label}
      </Text>
      <Text className="text-base">
        {value && value.trim().length > 0 ? value : "Unknown"}
      </Text>
    </View>
  );
};

export default CharacterDetailsScreen;
