// lib/badges.ts

type BadgeStyle = { container: string; text: string };

export const houseBadge = (house?: string): BadgeStyle => {
  const h = (house ?? "").toLowerCase();

  if (h.includes("gryff")) return { container: "bg-red-500/10 border-red-500/30", text: "text-red-700" };
  if (h.includes("slyth")) return { container: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-700" };
  if (h.includes("raven")) return { container: "bg-blue-500/10 border-blue-500/30", text: "text-blue-700" };
  if (h.includes("huff")) return { container: "bg-amber-500/10 border-amber-500/30", text: "text-amber-700" };

  return { container: "bg-neutral-500/10 border-neutral-500/20", text: "text-neutral-700" };
};

export const spellBadge = (): BadgeStyle => {
  return { container: "bg-violet-500/10 border-violet-500/30", text: "text-violet-700" };
};
