// lib/notifications.ts
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const registerForNotifications = async () => {
  // Web: skip (notifications are not consistent there)
  if (Platform.OS === "web") return;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Notifications permission not granted");
    return;
  }
};

export const notifyFavouriteAdded = async (title: string) => {
  if (Platform.OS === "web") return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Added to favourites ✅",
      body: title,
    },
    trigger: null, // immediate
  });
};

export const notifyFavouriteRemoved = async (title: string) => {
  if (Platform.OS === "web") return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Removed from favourites ❌",
      body: title,
    },
    trigger: null,
  });
};
