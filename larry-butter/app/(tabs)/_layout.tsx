// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="characters"
        options={{ title: "Characters" }}
      />
      <Tabs.Screen
        name="spells"
        options={{ title: "Spells" }}
      />
      <Tabs.Screen
        name="favourites"
        options={{ title: "Favourites" }}
      />
    </Tabs>
  );
};

export default TabsLayout;
