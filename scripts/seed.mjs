import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const data = [
  {
    id: "hGcLxY",
    name: "Test User",
    email: "test@test.com",
    phone: "8888888888",
    password: "12345",
  },
  {
    id: "aKcDzX",
    name: "Disha Bhandula",
    email: "disha.bh27@gmail.com",
    phone: "8447647605",
    password: "happysingingbird",
  },
  {
    id: "yJnBqW",
    name: "Kamini Ganguli",
    email: "kamini.ganguli2012@teachforindia.org",
    phone: "8390387091",
    password: "blueskyparadise",
  },
  {
    id: "tMnWsR",
    name: "Supriya Dhir",
    email: "connectingsupriya@gmail.com",
    phone: "9818524165",
    password: "purpleflowermeadow",
  },
  {
    id: "bRnSmX",
    name: "Shemran Rizwi",
    email: "shemranrizwi16@gmail.com",
    phone: "8116560074",
    password: "redbutterflydance",
  },
  {
    id: "fMnTjP",
    name: "Shefali Ahlawat",
    email: "shefali4ahlawat@gmail.com",
    phone: "9873435483",
    password: "yellowbeachsun",
  },
  {
    id: "8879881971",
    name: "Prashant Bhudwal",
    email: "prashant.bhudwal@gmail.com",
    phone: "8879881971",
    password: "greenfalcon",
  },
  {
    id: "9833045490",
    name: "Anushka Prabhu",
    email: "anushka.prabhu@gmail.com",
    phone: "9833045490",
    password: "purplefalcon",
  },
  {
    id: "987654321",
    name: "YC Admin",
    email: "falcon@yc.com",
    phone: "987654321",
    password: "orangefalcon",
  },
  {
    id: "EsdTfG",
    name: "Arjunsingh Jaysing Rajput",
    email: "arjunsingh.rajput20_mae@apu.edu.in",
    phone: "08779725485",
    password: "blueelephantdance",
  },
  {
    id: "GhiUjK",
    name: "Vaishnavi Mohan",
    email: "mvaishnavi8@gmail.com",
    phone: "+918075861295",
    password: "purpleparadisebird",
  },
  {
    id: "LmnOpQ",
    name: "Chetana P L",
    email: "chetanaplnaidu@gmail.com",
    phone: "08792833781",
    password: "greenbutterflysong",
  },
  {
    id: "MnoPqr",
    name: "Yasha Shivhare",
    email: "yasha.avma@adanischools.ac.in",
    phone: "9340466673",
    password: "redparrotwings",
  },
];

async function seedData() {
  try {
    for (const item of data) {
      const existingUser = await prisma.teacher.findUnique({
        where: {
          email: item.email,
        },
      });

      if (!existingUser) {
        await prisma.teacher.create({
          data: {
            name: item.name,
            email: item.email,
            password: item.password,
            phone: item.phone,
            accountType: "INDIVIDUAL",
          },
        });
      }
    }

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
