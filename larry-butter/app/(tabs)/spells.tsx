// app/(tabs)/spells.tsx

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  View,
} from "react-native";
import { Link } from "expo-router";

import { Text } from "@/components/ui/text";
import type { Spell } from "@/types";

const SpellsScreen = () => {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSpells = async () => {
      try {
        setLoading(true);
        setError(null);

        // You can change this URL to another spells API if you want
        const response = await fetch("https://hp-api.onrender.com/api/spells");
        const json: Spell[] = await response.json();

        if (cancelled) return;
        setSpells(json);
      } catch (e) {
        if (cancelled) return;
        setError(e as Error);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

    loadSpells();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator animating={true} />
        <Text className="mt-2 text-muted-foreground">Loading spells…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-red-500 font-semibold">
          Failed to load spells
        </Text>
        <Text className="text-sm text-muted-foreground mt-1">
          {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={spells}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/spells/[id]",
              params: {
                id: item.name,
                name: item.name,
                description: item.description,
              },
            }}
            asChild
          >
            <Pressable className="px-4 py-3 border-b border-border">
              <Text className="font-semibold">{item.name}</Text>
              <Text
                className="text-sm text-muted-foreground mt-0.5"
                numberOfLines={1}
              >
                {item.description || "No description available"}
              </Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
};

export default SpellsScreen;
