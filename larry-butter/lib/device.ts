import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "deviceId";

export const getDeviceId = async () => {
  const existing = await AsyncStorage.getItem(KEY);
  if (existing) return existing;

  const id = `dev-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await AsyncStorage.setItem(KEY, id);
  return id;
};
