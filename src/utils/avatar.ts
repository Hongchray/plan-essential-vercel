// utils/avatar.ts
const colors = [
  { bg: "bg-red-100", text: "text-red-600" },
  { bg: "bg-orange-100", text: "text-orange-600" },
  { bg: "bg-amber-100", text: "text-amber-600" },
  { bg: "bg-yellow-100", text: "text-yellow-600" },
  { bg: "bg-lime-100", text: "text-lime-600" },
  { bg: "bg-green-100", text: "text-green-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "bg-teal-100", text: "text-teal-600" },
  { bg: "bg-cyan-100", text: "text-cyan-600" },
  { bg: "bg-sky-100", text: "text-sky-600" },
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-indigo-100", text: "text-indigo-600" },
  { bg: "bg-violet-100", text: "text-violet-600" },
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-fuchsia-100", text: "text-fuchsia-600" },
  { bg: "bg-pink-100", text: "text-pink-600" },
  { bg: "bg-rose-100", text: "text-rose-600" },
  { bg: "bg-stone-100", text: "text-stone-600" },
  { bg: "bg-neutral-100", text: "text-neutral-600" },
  { bg: "bg-gray-100", text: "text-gray-600" },
  { bg: "bg-slate-100", text: "text-slate-600" },
  { bg: "bg-zinc-100", text: "text-zinc-600" },
  { bg: "bg-amber-200", text: "text-amber-700" },
  { bg: "bg-emerald-200", text: "text-emerald-700" },
];

/**
 * Get background + text color based on the first letter of a string
 */
export function getAvatarColor(name: string) {
  const initials = getInitials(name);
  if (!initials) return { bg: "bg-gray-400", text: "text-white" };

  // Hash based on initials only
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Get initials from a full name.
 * Always includes the first two words (if available).
 * @param name - Full name string
 * @returns Initials in uppercase
 */
export function getInitials(name: string, length: number = 2): string {
  if (!name) return "";

  const parts = name
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].substring(0, length).toUpperCase();
  }

  return (parts[0][0] + parts[1][0]).toUpperCase();
}