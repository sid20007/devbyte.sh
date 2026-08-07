import { prisma } from "@/lib/db";
import { StudentForm } from "@/components/student-form";
import { createStudent } from "@/app/actions/student-actions";

export const dynamic = "force-dynamic";

export default async function AddStudentPage() {
  const [departments, programs, academicYears, semesters] = await Promise.all([
    prisma.department.findMany({ orderBy: { name: "asc" } }),
    prisma.program.findMany({ orderBy: { name: "asc" } }),
    prisma.academicYear.findMany({ orderBy: { label: "desc" } }),
    prisma.semester.findMany({ orderBy: { number: "asc" } }),
  ]);

  return (
    <div className="py-4">
      <StudentForm
        departments={departments}
        programs={programs}
        academicYears={academicYears}
        semesters={semesters}
        action={createStudent}
        title="Add New Student"
        description="Fill in student details to enroll them into the academic system"
      />
    </div>
  );
}
