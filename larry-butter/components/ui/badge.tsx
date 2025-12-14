import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

// Unified logic for colors based on content (House or Spell Type)
const getBadgeStyle = (label?: string) => {
  const v = (label ?? "").toLowerCase();

  // Red
  if (v === "gryffindor" || v.includes("curse")) {
    return { container: "bg-red-500/10 border-red-500/30", text: "text-red-700" };
  }
  
  // Green (Emerald)
  if (v === "slytherin" || v.includes("healing") || v.includes("charm") || v.includes("beginner")) {
    return { container: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-700" };
  }

  // Blue
  if (v === "ravenclaw" || v.includes("intermediate")) {
    return { container: "bg-blue-500/10 border-blue-500/30", text: "text-blue-700" };
  }

  // Yellow/Amber
  if (v === "hufflepuff" || v.includes("jinx")) {
    return { container: "bg-amber-500/10 border-amber-500/30", text: "text-amber-800" };
  }

  // Purple
  if (v.includes("hex") || v.includes("advanced")) {
    return { container: "bg-purple-500/10 border-purple-500/30", text: "text-purple-700" };
  }

  // Default Gray
  return { container: "bg-muted border-border", text: "text-muted-foreground" };
};

interface BadgeProps {
  label?: string; // The text to display (e.g. "Gryffindor", "Hex")
  className?: string; // Optional overrides for the container
  textClassName?: string; // Optional overrides for the text
}

export const Badge = ({ label, className, textClassName }: BadgeProps) => {
  if (!label) return null; // Don't render empty badges

  const styles = getBadgeStyle(label);

  return (
    <View
      className={cn(
        "px-2.5 py-1 rounded-full border flex-row items-center self-start",
        styles.container,
        className
      )}
    >
      <Text className={cn("text-xs font-medium", styles.text, textClassName)}>
        {label}
      </Text>
    </View>
  );
};