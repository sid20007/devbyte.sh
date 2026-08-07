import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteStudent } from "@/app/actions/student-actions";
import { ArrowLeft, Edit, Trash2, GraduationCap, Building2, Calendar, BookOpen, User, Hash } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const students = await prisma.student.findMany({ select: { id: true } });
  return students.map((s) => ({ id: s.id }));
}

interface StudentProfilePageProps {
  params: {
    id: string;
  };
}

export default async function StudentProfilePage({ params }: StudentProfilePageProps) {
  if (!params || typeof params.id !== "string" || !params.id) {
    notFound();
  }

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: {
      department: true,
      program: true,
      academicYear: true,
      semester: true,
    },
  });

  if (!student) {
    notFound();
  }

  const getStatusBadge = (s: string) => {
    switch (s.toLowerCase()) {
      case "active":
        return <Badge variant="success">Active Student</Badge>;
      case "graduated":
        return <Badge variant="secondary">Graduated</Badge>;
      case "inactive":
        return <Badge variant="inactive">Inactive</Badge>;
      default:
        return <Badge variant="outline">{s}</Badge>;
    }
  };

  const deleteStudentWithId = deleteStudent.bind(null, student.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link href="/students">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back to Directory
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/students/${student.id}/edit`}>
            <Button size="sm" className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700">
              <Edit className="h-4 w-4" /> Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="border shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-28 p-6 flex items-end">
          <div className="flex items-center gap-3 translate-y-8">
            <div className="h-20 w-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-primary font-bold text-2xl">
              {student.name.charAt(0)}
            </div>
          </div>
        </div>

        <CardHeader className="pt-10 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">{student.name}</CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <Hash className="h-3.5 w-3.5" /> ID: {student.id}
              </p>
            </div>
            <div>{getStatusBadge(student.status)}</div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Program</p>
                <p className="font-semibold text-foreground text-base">{student.program.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</p>
                <p className="font-semibold text-foreground text-base">{student.department.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Academic Session</p>
                <p className="font-semibold text-foreground text-base">{student.academicYear.label}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Semester</p>
                <p className="font-semibold text-foreground text-base">Semester {student.semester.number}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Admission Year</p>
                <p className="font-semibold text-foreground text-base">{student.admissionYear}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Record Created</p>
                <p className="font-semibold text-foreground text-base">
                  {new Date(student.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t bg-muted/30 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Last updated: {new Date(student.updatedAt).toLocaleDateString()}
          </span>
          <form action={deleteStudentWithId}>
            <Button variant="destructive" size="sm" className="flex items-center gap-1.5">
              <Trash2 className="h-4 w-4" /> Delete Profile
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
