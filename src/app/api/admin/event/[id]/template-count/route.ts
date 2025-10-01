import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  // Extract eventId from the URL
  const url = new URL(req.url);
  const segments = url.pathname.split("/"); // split path
  const eventId = segments[segments.length - 2]; // [id] segment

  if (!eventId) return new Response("Missing eventId", { status: 400 });

  // Count templates linked to this event via EventTemplate
  const totalTemplates = await prisma.eventTemplate.count({
    where: { eventId },
  });

  return new Response(JSON.stringify({ totalTemplates }), {
    headers: { "Content-Type": "application/json" },
  });
}
