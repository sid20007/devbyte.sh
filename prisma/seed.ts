import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const indianNames = [
  "Aarav Sharma", "Ananya Verma", "Rohan Gupta", "Priya Patel", "Aditya Singh",
  "Sneha Reddy", "Vihaan Iyer", "Kavya Nair", "Ishaan Malhotra", "Diya Joshi",
  "Kabir Kapoor", "Riya Sen", "Devansh Mehta", "Meera Saxena", "Arjun Bhatia",
  "Pooja Deshmukh", "Yash Rao", "Nisha Chaudhary", "Siddharth Das", "Neha Agarwal",
  "Karan Kulkarni", "Tarun Kumar", "Tanvi Pillai", "Rahul Mishra", "Shruti Pandey",
  "Varun Bose", "Anushka Ghosh", "Harsh Vardhan", "Divya Menon", "Aman Trivedi"
];

async function main() {
  console.log('Seeding database...');

  // Clean up existing data for idempotency
  await prisma.student.deleteMany();
  await prisma.program.deleteMany();
  await prisma.department.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.semester.deleteMany();

  // Create 2 Departments
  const deptCSE = await prisma.department.create({
    data: { name: 'Department of Computer Science & Engineering' },
  });

  const deptEME = await prisma.department.create({
    data: { name: 'Department of Electronics & Mechanical Engineering' },
  });

  // Create 3 Programs
  const progCSE = await prisma.program.create({
    data: {
      name: 'B.Tech CSE',
      departmentId: deptCSE.id,
    },
  });

  const progECE = await prisma.program.create({
    data: {
      name: 'B.Tech ECE',
      departmentId: deptEME.id,
    },
  });

  const progMech = await prisma.program.create({
    data: {
      name: 'B.Tech Mechanical',
      departmentId: deptEME.id,
    },
  });

  // Create 2 Academic Years
  const ay2024 = await prisma.academicYear.create({
    data: { label: '2024-25' },
  });

  const ay2025 = await prisma.academicYear.create({
    data: { label: '2025-26' },
  });

  // Create 4 Semesters
  const sem1 = await prisma.semester.create({ data: { number: 1 } });
  const sem2 = await prisma.semester.create({ data: { number: 2 } });
  const sem3 = await prisma.semester.create({ data: { number: 3 } });
  const sem4 = await prisma.semester.create({ data: { number: 4 } });

  const programs = [progCSE, progECE, progMech];
  const academicYears = [ay2024, ay2025];
  const semesters = [sem1, sem2, sem3, sem4];
  const statuses = ['active', 'active', 'active', 'inactive', 'graduated'];

  // Create 30 Students
  for (let i = 0; i < indianNames.length; i++) {
    const name = indianNames[i];
    const program = programs[i % programs.length];
    const departmentId = program.departmentId;
    const academicYear = academicYears[i % academicYears.length];
    const semester = semesters[i % semesters.length];
    const admissionYear = 2021 + (i % 4);
    const status = statuses[i % statuses.length];

    await prisma.student.create({
      data: {
        name,
        admissionYear,
        status,
        departmentId,
        programId: program.id,
        academicYearId: academicYear.id,
        semesterId: semester.id,
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
