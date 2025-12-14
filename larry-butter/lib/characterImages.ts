import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "character_images_v1";

export const getCharacterImage = async (characterId: string) => {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;

  const map = JSON.parse(raw) as Record<string, string>;
  return map[characterId] ?? null;
};

export const getCharacterImageMap = async () => {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Record<string, string>) : {};
};

export const setCharacterImage = async (characterId: string, uri: string) => {
  const raw = await AsyncStorage.getItem(KEY);
  const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};

  map[characterId] = uri;
  await AsyncStorage.setItem(KEY, JSON.stringify(map));
};
