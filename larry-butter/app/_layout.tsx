// app/_layout.tsx
import { Stack } from "expo-router";
import "@/global.css";
import FavouritesProvider from "@/context/FavouritesContext";

const RootLayout = () => {
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
