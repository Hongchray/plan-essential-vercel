// utils/avatar.ts
const colors = [
  { bg: "bg-red-100", text: "text-red-600" },
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-green-100", text: "text-green-600" },
  { bg: "bg-yellow-100", text: "text-yellow-600" },
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-pink-100", text: "text-pink-600" },
  { bg: "bg-indigo-100", text: "text-indigo-600" },
  { bg: "bg-orange-100", text: "text-orange-600" },
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