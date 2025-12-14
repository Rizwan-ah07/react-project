import { View } from "react-native";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof View> & {
  className?: string;
};

export const Card = ({ className, ...props }: Props) => {
  return (
    <View
      className={cn(
        "bg-card border border-border rounded-2xl shadow-sm",
        className
      )}
      {...props}
    />
  );
};
