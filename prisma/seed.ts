import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("Password123", 10);
  const user = await prisma.user.create({
    data: {
      email: "john@example.com",
      password: hashedPassword, // store hashed password in real app
      name: "John Doe",
      phone: "123456789",
      photoUrl: "https://via.placeholder.com/150",
      role: "admin",
    },
  });

  // Seed first user (admin)
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {}, // do nothing if exists
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
      phone: "0976168988",
      photoUrl: "https://via.placeholder.com/150",
      role: "user",
    },
  });

  const weddingTemplate = await prisma.template.create({
    data: {
      unique_name: "elegant-wedding", // Adding required unique_name field
      name: "Elegant Wedding",
      type: "wedding",
      image: "https://theapka.com/storage/01J45Z76636PDX9JANP0FTWRGE.png",
      defaultConfig: {
        background: "/templates/wedding/bg.jpg",
        colors: { primary: "#e63946", secondary: "#f1faee" },
        sections: [
          {
            type: "hero",
            title: "John & Jane",
            subtitle: "We're Getting Married!",
          },
          { type: "details", fields: ["date", "time", "location"] },
          { type: "schedule", fields: ["shifts", "timeline"] },
        ],
      },
      status: "active",
    },
  });

  const birthdayTemplate = await prisma.template.create({
    data: {
      unique_name: "fun-birthday", // Adding required unique_name field
      name: "Fun Birthday",
      type: "birthday",
      image: "https://theapka.com/storage/01J4TYPHHH659MS837318XM7GJ.png",
      defaultConfig: {
        background: "/templates/wedding/bg.jpg",
        colors: { primary: "#e63946", secondary: "#f1faee" },
        sections: [
          {
            type: "hero",
            title: "John & Jane",
            subtitle: "We're Getting Married!",
          },
          { type: "details", fields: ["date", "time", "location"] },
          { type: "schedule", fields: ["shifts", "timeline"] },
        ],
      },
      status: "active",
    },
  });

  const event = await prisma.event.create({
    data: {
      name: "John & Jane's Wedding",
      description: "A celebration of love 💍",
      image: "https://via.placeholder.com/600x300",
      userId: user.id,
      status: "active",
      type: "wedding",
      location: "Phnom Penh, Cambodia",
      latitude: "11.5564",
      longitude: "104.9282",
      startTime: new Date("2025-12-01T14:00:00Z"),
      endTime: new Date("2025-12-01T22:00:00Z"),
      schedules: {
        create: [
          {
            shifts: {
              create: [
                {
                  name: "Morning Ceremony",
                  date: new Date("2025-12-01"),
                  timeLine: {
                    create: [
                      { name: "Buddhist Ceremony", time: "08:00 AM" },
                      { name: "Tea Ceremony", time: "09:30 AM" },
                    ],
                  },
                },
                {
                  name: "Evening Reception",
                  date: new Date("2025-12-01"),
                  timeLine: {
                    create: [
                      { name: "Cocktail Hour", time: "06:00 PM" },
                      { name: "Dinner & Dance", time: "07:30 PM" },
                      { name: "After Party", time: "10:00 PM" },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      eventTemplates: {
        create: {
          templateId: weddingTemplate.id,
          config: {
            background: "/templates/wedding/bg.jpg",
            colors: { primary: "#e63946", secondary: "#f1faee" },
            sections: [
              {
                type: "hero",
                title: "John & Jane",
                subtitle: "We're Getting Married!",
              },
              { type: "details", fields: ["date", "time", "location"] },
              { type: "schedule", fields: ["shifts", "timeline"] },
            ],
          },
        },
      },
    },
    include: { schedules: true, eventTemplates: true },
  });

  console.log("✅ Seeded data successfully:", {
    user,
    event,
    weddingTemplate,
    birthdayTemplate,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
