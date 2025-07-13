import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";
import prisma from "./index.js";

import bcrypt from "bcryptjs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seedDemoUser() {
  const demoEmail = "demo@user.com";
  const demoUsername = "demouser";
  const plainPassword = "demopassword";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (existingUser) {
    console.log("- ⚠️ Demo user already exists, skipping creation.");
    return;
  }

  try {
    await prisma.user.create({
      data: {
        email: demoEmail,
        username: demoUsername,
        password: hashedPassword,
        role: "STUDENT",
        batch: 2025,
        branch: "CSE",
        about: "I’m a demo user created for testing purposes.",
      },
    });

    console.log(
      "- ✅ Demo user created (email: demo@user.com, password: demopassword)"
    );
  } catch (error) {
    console.error("❌ Error creating demo user:", error);
  }
}

async function seedProfessors(debugging = false) {
  const profsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./professors.json"), "utf8")
  );
  let skippedDueToNoEmail = 0;
  let skippedDueToDuplicate = 0;
  let badProfessorsData = 0;

  for (let prof of profsData) {
    try {
      if (!prof.email) {
        skippedDueToNoEmail++;
        continue; // skipping if no email
      }

      const existingProf = await prisma.professor.findFirst({
        where: { email: prof.email },
      });

      if (existingProf) {
        skippedDueToDuplicate++;
        continue; // skipping if email already exists
      }

      await prisma.professor.create({
        data: {
          name: prof.name,
          email: prof.email,
          ...(prof.department && { department: prof.department }),
        },
      });
    } catch (error) {
      if (debugging) {
        console.log(
          `❌ Error seeding professor: ${prof.name}, error: ${error.toString()}`
        );
      }
      badProfessorsData++;
    }
  }

  console.log(`- ✅ Professors seeding completed.`);
  if (skippedDueToNoEmail)
    console.log(
      `- ⚠️ Skipped ${skippedDueToNoEmail} professors due to missing email.`
    );
  if (skippedDueToDuplicate)
    console.log(
      `- ⚠️ Skipped ${skippedDueToDuplicate} duplicate professors based on email.`
    );
  if (badProfessorsData)
    console.log(
      `- ❌ Failed to insert ${badProfessorsData} professors due to errors.`
    );
}

function normalizeSemester(sem) {
  const mapping = {
    Winter: "WINTER",
    Monsoon: "MONSOON",
    Summer: "SUMMER",
    "Monsoon/Winter": "MONSOONWINTER",
  };

  return mapping[sem] || null;
}

async function seedCourses(debugging = false) {
  const coursesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./courses.json"), "utf8")
  );
  let badCoursesData = 0;
  try {
    for (let course of coursesData) {
      const normalizedSem = normalizeSemester(course.semester);
      if (!normalizedSem) {
        console.warn(`⚠️ Unknown semester for course "${course.name}"`);
        continue;
      }
      try {
        await prisma.course.upsert({
          where: { courseCode: course.code },
          update: {},
          create: {
            courseName: course.name,
            courseCode: course.code,
            acronym: course.acronym,
            sem: normalizedSem,
          },
        });
      } catch (error) {
        if (debugging) {
          console.log(`Error seeding course : `, course.name);
        }
        badCoursesData++;
      }
    }
    console.log("- ✅ Courses seeding completed.");
  } catch (error) {
    console.error(`‼️ Error seeding courses.`);
  }

  if (badCoursesData) {
    console.log(`- ⚠️ Error in seeding ${badCoursesData} courses.`);
  }
}

async function seedBadges() {
  const badgesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./badges.json"), "utf8")
  );

  try {
    for (let badge of badgesData) {
      await prisma.badge.upsert({
        where: { name: badge.name },
        update: {},
        create: {
          name: badge.name,
          description: badge.description,
          iconUrl: badge.iconUrl,
        },
      });
    }
    console.log("- ✅ Badges seeding completed.");
  } catch (error) {
    console.error(`‼️ Error seeding badge "${badge.name}":`, error);
  }
}

async function main() {
  try {
    console.log("Seeding database...🔨");
    await seedProfessors();
    await seedCourses();
    await seedBadges();
    await seedDemoUser();
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
