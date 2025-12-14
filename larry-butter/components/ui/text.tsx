import { Text as RNText } from "react-native";
import { cn } from "@/lib/utils";

interface TextProps extends React.ComponentProps<typeof RNText> {
  className?: string;
}

export const Text = ({ className, ...props }: TextProps) => {
  return (
    <RNText
      className={cn("text-foreground text-base", className)}
      {...props}
    />
    
  );
};
