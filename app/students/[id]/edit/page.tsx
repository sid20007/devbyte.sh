import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { StudentForm } from "@/components/student-form";
import { updateStudent } from "@/app/actions/student-actions";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const students = await prisma.student.findMany({ select: { id: true } });
  return students.map((s) => ({ id: s.id }));
}

interface EditStudentPageProps {
  params: {
    id: string;
  };
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  if (!params || typeof params.id !== "string" || !params.id) {
    notFound();
  }

  const [student, departments, programs, academicYears, semesters] = await Promise.all([
    prisma.student.findUnique({ where: { id: params.id } }),
    prisma.department.findMany({ orderBy: { name: "asc" } }),
    prisma.program.findMany({ orderBy: { name: "asc" } }),
    prisma.academicYear.findMany({ orderBy: { label: "desc" } }),
    prisma.semester.findMany({ orderBy: { number: "asc" } }),
  ]);

  if (!student) {
    notFound();
  }

  const updateStudentWithId = updateStudent.bind(null, student.id);

  return (
    <div className="py-4">
      <StudentForm
        departments={departments}
        programs={programs}
        academicYears={academicYears}
        semesters={semesters}
        initialData={student}
        action={updateStudentWithId}
        title={`Edit Student: ${student.name}`}
        description="Update student academic profile, status, or program details"
      />
    </div>
  );
}
