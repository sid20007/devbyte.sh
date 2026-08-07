import Link from "next/link";
import { prisma } from "@/lib/db";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SemesterCheckboxGroup } from "@/components/semester-checkbox-group";
import { Search, UserPlus, Eye, Edit, Filter, X } from "lucide-react";

export const dynamic = "force-dynamic";

interface StudentListPageProps {
  searchParams: {
    q?: string;
    departmentId?: string;
    programId?: string;
    academicYearId?: string;
    status?: string;
    semesters?: string | string[];
  };
}

export default async function StudentListPage({ searchParams }: StudentListPageProps) {
  const query = searchParams.q || "";
  const departmentId = searchParams.departmentId || "";
  const programId = searchParams.programId || "";
  const academicYearId = searchParams.academicYearId || "";
  const status = searchParams.status || "";

  // Parse multi-select semesters
  let selectedSemesters: number[] = [];
  if (Array.isArray(searchParams.semesters)) {
    selectedSemesters = searchParams.semesters
      .map((s) => parseInt(s, 10))
      .filter((n) => !isNaN(n));
  } else if (typeof searchParams.semesters === "string" && searchParams.semesters.trim() !== "") {
    selectedSemesters = searchParams.semesters
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
  }

  // Fetch filter options
  const [departments, programs, academicYears] = await Promise.all([
    prisma.department.findMany({ orderBy: { name: "asc" } }),
    prisma.program.findMany({ orderBy: { name: "asc" } }),
    prisma.academicYear.findMany({ orderBy: { label: "desc" } }),
  ]);

  // Construct Prisma query filter
  const where: any = {};

  if (query.trim() !== "") {
    where.name = { contains: query.trim() };
  }
  if (departmentId) {
    where.departmentId = departmentId;
  }
  if (programId) {
    where.programId = programId;
  }
  if (academicYearId) {
    where.academicYearId = academicYearId;
  }
  if (status) {
    where.status = status;
  }
  if (selectedSemesters.length > 0) {
    where.semester = {
      number: {
        in: selectedSemesters,
      },
    };
  }

  const students = await prisma.student.findMany({
    where,
    include: {
      department: true,
      program: true,
      academicYear: true,
      semester: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const getStatusBadge = (s: string) => {
    switch (s.toLowerCase()) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "graduated":
        return <Badge variant="secondary">Graduated</Badge>;
      case "inactive":
        return <Badge variant="inactive">Inactive</Badge>;
      default:
        return <Badge variant="outline">{s}</Badge>;
    }
  };

  const isFiltered =
    query || departmentId || programId || academicYearId || status || selectedSemesters.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Student Directory</h1>
          <p className="text-sm text-muted-foreground">
            View, search, and filter all enrolled students
          </p>
        </div>
        <Link href="/students/new">
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Add New Student
          </Button>
        </Link>
      </div>

      {/* Search and Filters Form */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" /> Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form method="GET" action="/students" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search Bar */}
              <div className="lg:col-span-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Search Name</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    name="q"
                    placeholder="Search by student name..."
                    defaultValue={query}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Department</label>
                <Select name="departmentId" defaultValue={departmentId}>
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Program Filter */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Program</label>
                <Select name="programId" defaultValue={programId}>
                  <option value="">All Programs</option>
                  {programs.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      {prog.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Academic Year Filter */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Academic Year</label>
                <Select name="academicYearId" defaultValue={academicYearId}>
                  <option value="">All Academic Years</option>
                  {academicYears.map((ay) => (
                    <option key={ay.id} value={ay.id}>
                      {ay.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
                <Select name="status" defaultValue={status}>
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                </Select>
              </div>
            </div>

            {/* Semester Multi-Select Checkboxes */}
            <SemesterCheckboxGroup selectedSemesters={selectedSemesters} />

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              {isFiltered && (
                <Link href="/students">
                  <Button variant="ghost" type="button" size="sm" className="flex items-center gap-1 text-muted-foreground">
                    <X className="h-4 w-4" /> Reset All Filters
                  </Button>
                </Link>
              )}
              <Button type="submit" size="sm" className="flex items-center gap-1.5">
                <Search className="h-4 w-4" /> Apply Filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Students Table */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground flex justify-between items-center px-1">
          <span>Showing {students.length} student{students.length !== 1 ? "s" : ""}</span>
          {selectedSemesters.length > 0 && (
            <span className="text-primary font-medium">
              Filtered by Semesters: {selectedSemesters.sort((a, b) => a - b).join(", ")}
            </span>
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Academic Year</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No students found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-semibold text-foreground">
                    <Link href={`/students/${student.id}`} className="hover:underline hover:text-primary">
                      {student.name}
                    </Link>
                  </TableCell>
                  <TableCell>{student.program.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{student.department.name}</TableCell>
                  <TableCell>{student.academicYear.label}</TableCell>
                  <TableCell>Semester {student.semester.number}</TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/students/${student.id}`}>
                        <Button variant="ghost" size="icon" title="View Profile">
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                      </Link>
                      <Link href={`/students/${student.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Edit Student">
                          <Edit className="h-4 w-4 text-amber-600" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
