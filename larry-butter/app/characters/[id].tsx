import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { Text } from "@/components/ui/text";
import { Character } from "@/types";
import { getCharacterImage, setCharacterImage } from "@/lib/characterImages";
import { useFavourites } from "@/context/FavouritesContext";

const CharacterDetailsScreen = () => {
  const params = useLocalSearchParams<{
    id: string;
    name?: string;
    house?: string;
    role?: string;
    description?: string;
  }>();

  const { toggleFavourite, isFavourite } = useFavourites();

  const character: Character = {
    id: String(params.id),
    name: params.name ?? "Unknown",
    house: params.house ?? "Unknown",
    role: params.role,
    description: params.description,
  };

  const favourite = isFavourite(character.id);

  const [pickedImage, setPickedImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const uri = await getCharacterImage(character.id);
        if (!cancelled) setPickedImage(uri);
      } catch (e) {
        console.log("Error loading character image", e);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [character.id]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setPickedImage(uri);
    await setCharacterImage(character.id, uri);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center px-6 pt-10 pb-6">
        {pickedImage ? (
          <Image
            source={{ uri: pickedImage }}
            style={{
              width: 160,
              height: 160,
              borderRadius: 9999,
              marginBottom: 16,
              backgroundColor: "#e5e5e5",
            }}
          />
        ) : (
          <View className="w-40 h-40 rounded-full bg-neutral-200 mb-4 items-center justify-center">
            <Text className="text-neutral-500">No image</Text>
          </View>
        )}

        <Text className="text-2xl font-bold mb-1">{character.name}</Text>

        <Text className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs mb-4">
          {character.house}
        </Text>

        <Pressable
          onPress={pickImage}
          className="px-4 py-2 border border-neutral-300 rounded-full mb-4"
        >
          <Text>Pick image</Text>
        </Pressable>

        <Pressable
          onPress={() => toggleFavourite(character)}
          className="px-4 py-2 border border-neutral-300 rounded-full flex-row items-center mb-6"
        >
          <Text className={favourite ? "text-red-500 text-lg mr-2" : "text-neutral-400 text-lg mr-2"}>
            {favourite ? "♥" : "♡"}
          </Text>
          <Text className="text-sm">
            {favourite ? "Remove from favourites" : "Add to favourites"}
          </Text>
        </Pressable>
      </View>

      <View className="px-6 pb-10">
        <Text className="text-lg font-semibold mb-3">Details</Text>
        <InfoRow label="Role" value={character.role} />
        <InfoRow label="Description" value={character.description} />
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => {
  return (
    <View className="mb-2">
      <Text className="text-xs text-neutral-500 uppercase">{label}</Text>
      <Text className="text-base">
        {value && value.trim().length > 0 ? value : "Unknown"}
      </Text>
    </View>
  );
};

export default CharacterDetailsScreen;
