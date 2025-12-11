import { View, Image, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { useFavourites } from "@/context/FavouritesContext";
import { Link } from "expo-router";

export default function FavouritesScreen() {
  const { favourites, toggleFavourite } = useFavourites();

  if (favourites.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-500">No favourites yet</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 gap-4">
      {favourites.map((item) => (
        <Link
          key={item.id}
          href={{
            pathname: "/characters/[id]",
            // pass all fields, like in the characters list
            params: { ...item, id: String(item.id) },
          }}
          asChild
        >
          <TouchableOpacity className="flex-row items-center gap-4 p-3 border border-gray-300 rounded-xl bg-white">
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <View className="w-16 h-16 rounded-full bg-gray-300 items-center justify-center">
                <Text>No image</Text>
              </View>
            )}

            <View className="flex-1">
              <Text className="text-lg font-bold">{item.name}</Text>
              <Text className="text-gray-500">{item.house || "Unknown"}</Text>
            </View>

            <TouchableOpacity onPress={() => toggleFavourite(item)}>
              <Text className="text-xl">❤️</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Link>

      ))}
    </View>
  );
}
