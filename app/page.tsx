import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgramBarChart } from "@/components/program-bar-chart";
import { Users, GraduationCap, Building2, UserCheck, ArrowRight, UserPlus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [totalStudents, activeStudents, programs, totalDepartments, academicYears, allStudents] = await Promise.all([
    prisma.student.count(),
    prisma.student.count({ where: { status: "active" } }),
    prisma.program.findMany({ orderBy: { name: "asc" } }),
    prisma.department.count(),
    prisma.academicYear.findMany({ orderBy: { label: "asc" } }),
    prisma.student.findMany({
      select: {
        id: true,
        academicYearId: true,
        program: { select: { name: true } },
        semester: { select: { number: true } },
        academicYear: { select: { label: true } },
      },
    }),
  ]);

  const studentRecords = allStudents.map((s) => ({
    id: s.id,
    programName: s.program.name,
    semesterNumber: s.semester.number,
    academicYearId: s.academicYearId,
    academicYearLabel: s.academicYear.label,
  }));

  const programNames = programs.map((p) => p.name);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Academic Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time enrollment metrics and program analytics overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/students">
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> View All Students
            </Button>
          </Link>
          <Link href="/students/new">
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Add Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Enrolled across all programs</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Students
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{activeStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}% active rate
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Programs Count
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <GraduationCap className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{programs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active degree offerings</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Departments Count
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Building2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalDepartments}</div>
            <p className="text-xs text-muted-foreground mt-1">Academic faculties</p>
          </CardContent>
        </Card>
      </div>

      {/* Program & Semester Bar Chart Section */}
      <div>
        <ProgramBarChart
          students={studentRecords}
          academicYears={academicYears}
          programNames={programNames}
        />
      </div>

      {/* Quick Action Footer Banner */}
      <Card className="border bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 shadow-md rounded-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Manage Student Directory</h3>
            <p className="text-blue-100 text-sm mt-1">
              Search, filter by department or program, and update student profiles in real-time.
            </p>
          </div>
          <Link href="/students">
            <Button variant="secondary" className="font-semibold flex items-center gap-2">
              Browse Directory <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
