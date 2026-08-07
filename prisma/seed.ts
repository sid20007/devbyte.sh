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
  const academicYears = [ay2023, ay2024, ay2025];
  const names = generateIndianNames(250);

  // Seed 250 Students with decoupled program and academic year assignment
  for (let i = 0; i < 250; i++) {
    const name = names[i];
    const program = programs[i % programs.length];

    // Decouple academic year and semester allocation so all programs have representation across all academic years & semesters
    const academicYearObj = academicYears[i % academicYears.length];

    let admissionYear: number;
    let semesterNumber: number; // 1 to 8
    let status: string;

    const semesterIndex = (i + Math.floor(i / 4)) % 8; // Distribute evenly across 8 semesters
    semesterNumber = semesterIndex + 1;

    if (semesterNumber <= 2) {
      admissionYear = 2024;
      status = (i % 17 === 0) ? 'inactive' : 'active';
    } else if (semesterNumber <= 4) {
      admissionYear = 2023;
      status = (i % 19 === 0) ? 'inactive' : 'active';
    } else if (semesterNumber <= 6) {
      admissionYear = 2022;
      status = (i % 23 === 0) ? 'inactive' : 'active';
    } else {
      admissionYear = 2021;
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
