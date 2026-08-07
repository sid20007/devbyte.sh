import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const firstNames = [
  "Aarav", "Ananya", "Rohan", "Priya", "Aditya", "Sneha", "Vihaan", "Kavya", "Ishaan", "Diya",
  "Kabir", "Riya", "Devansh", "Meera", "Arjun", "Pooja", "Yash", "Nisha", "Siddharth", "Neha",
  "Karan", "Tarun", "Tanvi", "Rahul", "Shruti", "Varun", "Anushka", "Harsh", "Divya", "Aman",
  "Karthik", "Swati", "Pranav", "Anish", "Preeti", "Gautam", "Bhavana", "Chetan", "Deepa", "Rajesh",
  "Shreya", "Nikhil", "Manish", "Aditi", "Abhinav", "Payal", "Sameer", "Simran", "Vikram", "Poonam"
];

const lastNames = [
  "Sharma", "Verma", "Gupta", "Patel", "Singh", "Reddy", "Iyer", "Nair", "Malhotra", "Joshi",
  "Kapoor", "Sen", "Mehta", "Saxena", "Bhatia", "Deshmukh", "Rao", "Chaudhary", "Das", "Agarwal",
  "Kulkarni", "Kumar", "Pillai", "Mishra", "Pandey", "Bose", "Ghosh", "Vardhan", "Menon", "Trivedi",
  "Nambiar", "Hegde", "Shetty", "Kalia", "Somani", "Solanki", "Bansal", "Wagh", "Naik", "Jain"
];

function generateIndianNames(count: number): string[] {
  const names: string[] = [];
  const set = new Set<string>();

  for (let i = 0; i < firstNames.length; i++) {
    for (let j = 0; j < lastNames.length; j++) {
      const name = `${firstNames[i]} ${lastNames[j]}`;
      if (!set.has(name)) {
        set.add(name);
        names.push(name);
        if (names.length === count) return names;
      }
    }
  }
  return names;
}

async function main() {
  console.log('Seeding database with updated 250 student dataset...');

  // Clean up existing data for idempotency
  await prisma.student.deleteMany();
  await prisma.program.deleteMany();
  await prisma.department.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.semester.deleteMany();

  // Create Department: School of Engineering
  const deptSOE = await prisma.department.create({
    data: { name: 'School of Engineering' },
  });

  // Create 4 Programs under School of Engineering
  const progISE = await prisma.program.create({
    data: {
      name: 'B.Tech Information Science & Engineering (ISE)',
      departmentId: deptSOE.id,
    },
  });

  const progCSE = await prisma.program.create({
    data: {
      name: 'B.Tech Computer Science & Engineering (CSE)',
      departmentId: deptSOE.id,
    },
  });

  const progAIML = await prisma.program.create({
    data: {
      name: 'B.Tech Artificial Intelligence & Machine Learning (AIML)',
      departmentId: deptSOE.id,
    },
  });

  const progECE = await prisma.program.create({
    data: {
      name: 'B.Tech Electronics & Communication Engineering (ECE)',
      departmentId: deptSOE.id,
    },
  });

  // Create 3 Academic Years
  const ay2023 = await prisma.academicYear.create({
    data: { label: '2023-24' },
  });

  const ay2024 = await prisma.academicYear.create({
    data: { label: '2024-25' },
  });

  const ay2025 = await prisma.academicYear.create({
    data: { label: '2025-26' },
  });

  // Create 8 Semesters
  const semesters = [];
  for (let s = 1; s <= 8; s++) {
    const sem = await prisma.semester.create({
      data: { number: s },
    });
    semesters.push(sem);
  }

  const programs = [progISE, progCSE, progAIML, progECE];
  const names = generateIndianNames(250);

  // Seed 250 Students with sensible cohort mapping
  for (let i = 0; i < 250; i++) {
    const name = names[i];
    const program = programs[i % programs.length];

    // Cohort distribution:
    // i % 4 determines academic year / semester bracket
    let admissionYear: number;
    let semesterNumber: number; // 1 to 8
    let academicYearObj: { id: string };
    let status: string;

    const cohort = i % 4;

    if (cohort === 0) {
      // 1st Year Students (Admitted 2024) -> Semesters 1 or 2
      admissionYear = 2024;
      semesterNumber = (i % 2 === 0) ? 1 : 2;
      academicYearObj = ay2024;
      status = (i % 17 === 0) ? 'inactive' : 'active';
    } else if (cohort === 1) {
      // 2nd Year Students (Admitted 2023) -> Semesters 3 or 4
      admissionYear = 2023;
      semesterNumber = (i % 2 === 0) ? 3 : 4;
      academicYearObj = ay2024;
      status = (i % 19 === 0) ? 'inactive' : 'active';
    } else if (cohort === 2) {
      // 3rd Year Students (Admitted 2022) -> Semesters 5 or 6
      admissionYear = 2022;
      semesterNumber = (i % 2 === 0) ? 5 : 6;
      academicYearObj = ay2023;
      status = (i % 23 === 0) ? 'inactive' : 'active';
    } else {
      // 4th Year / Final Year Students (Admitted 2021) -> Semesters 7 or 8
      admissionYear = 2021;
      semesterNumber = (i % 2 === 0) ? 7 : 8;
      academicYearObj = ay2023;
      // Only students in Semester 8 or completing 8th semester can be graduated
      if (semesterNumber === 8 && i % 3 === 0) {
        status = 'graduated';
      } else if (i % 25 === 0) {
        status = 'inactive';
      } else {
        status = 'active';
      }
    }

    const semesterObj = semesters[semesterNumber - 1];

    await prisma.student.create({
      data: {
        name,
        admissionYear,
        status,
        departmentId: deptSOE.id,
        programId: program.id,
        academicYearId: academicYearObj.id,
        semesterId: semesterObj.id,
      },
    });
  }

  const studentCount = await prisma.student.count();
  const deptCount = await prisma.department.count();
  const progCount = await prisma.program.count();
  const ayCount = await prisma.academicYear.count();
  const semCount = await prisma.semester.count();

  console.log('Seeding completed successfully!');
  console.log(`Database counts -> Departments: ${deptCount}, Programs: ${progCount}, AcademicYears: ${ayCount}, Semesters: ${semCount}, Students: ${studentCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
