// utils/avatar.ts
const colors = [
  { bg: "bg-red-500", text: "text-white" },
  { bg: "bg-blue-500", text: "text-white" },
  { bg: "bg-green-500", text: "text-white" },
  { bg: "bg-yellow-500", text: "text-black" },
  { bg: "bg-purple-500", text: "text-white" },
  { bg: "bg-pink-500", text: "text-white" },
  { bg: "bg-indigo-500", text: "text-white" },
  { bg: "bg-orange-500", text: "text-black" },
];

/**
 * Get background + text color based on the first letter of a string
 */
export function getAvatarColor(name: string) {
  if (!name) return { bg: "bg-gray-400", text: "text-white" };

  const firstChar = name.charAt(0).toUpperCase();
  const index = (firstChar.charCodeAt(0) - 65) % colors.length;

  return colors[index] || { bg: "bg-gray-400", text: "text-white" };
}

/**
 * Get the first 1 or 2 letters of a name.
 * @param name - The input name string
 * @param length - How many letters to get (default: 2)
 * @returns The initials (uppercase)
 */
export function getInitials(name: string, length: number = 2): string {
  if (!name) return "";
  return name.substring(0, Math.min(length, name.length)).toUpperCase();
}