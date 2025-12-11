// lib/utils.ts

// Simple helper to merge Tailwind className strings.
// You can pass strings or false/null/undefined and it will ignore the falsy ones.
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
