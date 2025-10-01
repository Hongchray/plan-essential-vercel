import { prisma } from "@/lib/prisma";
// function generateSlug(name: string) {
//   return slugify(name, {
//     lower: true,
//     strict: true,
//     locale: "en",
//     trim: true,
//   });
// }
export function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s\.\•]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
export async function getUniqueSlug(name: string, excludeId?: string) {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (
    await prisma.event.findFirst({
      where: {
        slug,
        NOT: excludeId ? { id: excludeId } : undefined,
      },
    })
  ) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
}
