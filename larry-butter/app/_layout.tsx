import { Stack } from "expo-router";
import "@/global.css";
import FavouritesProvider from "@/context/FavouritesContext";
import { useEffect } from "react";
import { registerForNotifications } from "@/lib/notifications";

const RootLayout = () => {
    useEffect(() => {
    registerForNotifications();
  }, []);

  return (
    <FavouritesProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="characters/[id]"
          options={{ title: "Character details" }}
        />

        <Stack.Screen
          name="spells/[id]"
          options={{ title: "Spell details" }}
        />
      </Stack>
    </FavouritesProvider>
  );
};

export default RootLayout;
