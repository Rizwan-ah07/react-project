import { Pressable } from "react-native";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ComponentProps<typeof Pressable> {
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

export const Button = ({
  variant = "default",
  className,
  ...props
}: ButtonProps) => {
  return (
    <Pressable
      className={cn(
        "flex-row items-center justify-center rounded-md px-4 py-2",
        variant === "default" && "bg-primary",
        variant === "outline" && "border border-border bg-background",
        variant === "ghost" && "bg-transparent",
        className
      )}
      {...props}
    />
  );
};
