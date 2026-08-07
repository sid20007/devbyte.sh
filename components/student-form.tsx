"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Save, User } from "lucide-react";

interface Department {
  id: string;
  name: string;
}

interface Program {
  id: string;
  name: string;
  departmentId: string;
}

interface AcademicYear {
  id: string;
  label: string;
}

interface Semester {
  id: string;
  number: number;
}

interface StudentInitialData {
  id?: string;
  name: string;
  admissionYear: number;
  status: string;
  departmentId: string;
  programId: string;
  academicYearId: string;
  semesterId: string;
}

interface StudentFormProps {
  departments: Department[];
  programs: Program[];
  academicYears: AcademicYear[];
  semesters: Semester[];
  initialData?: StudentInitialData;
  action: (formData: FormData) => Promise<void>;
  title: string;
  description: string;
}

export function StudentForm({
  departments,
  programs,
  academicYears,
  semesters,
  initialData,
  action,
  title,
  description,
}: StudentFormProps) {
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    initialData?.departmentId || (departments.length > 0 ? departments[0].id : "")
  );

  const filteredPrograms = programs.filter(
    (prog) => prog.departmentId === selectedDepartment
  );

  const [selectedProgram, setSelectedProgram] = useState<string>(
    initialData?.programId || (filteredPrograms.length > 0 ? filteredPrograms[0].id : "")
  );

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = e.target.value;
    setSelectedDepartment(deptId);
    const validProgs = programs.filter((p) => p.departmentId === deptId);
    if (validProgs.length > 0) {
      setSelectedProgram(validProgs[0].id);
    } else {
      setSelectedProgram("");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>
      </CardHeader>

      <form action={action}>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Full Name *
            </label>
            <Input
              type="text"
              name="name"
              required
              placeholder="e.g. Aarav Sharma"
              defaultValue={initialData?.name || ""}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Department *
              </label>
              <Select
                name="departmentId"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                required
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Program *
              </label>
              <Select
                name="programId"
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                required
              >
                {filteredPrograms.map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {prog.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Academic Year *
              </label>
              <Select
                name="academicYearId"
                defaultValue={initialData?.academicYearId || academicYears[0]?.id}
                required
              >
                {academicYears.map((ay) => (
                  <option key={ay.id} value={ay.id}>
                    {ay.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Semester *
              </label>
              <Select
                name="semesterId"
                defaultValue={initialData?.semesterId || semesters[0]?.id}
                required
              >
                {semesters.map((sem) => (
                  <option key={sem.id} value={sem.id}>
                    Semester {sem.number}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Admission Year *
              </label>
              <Input
                type="number"
                name="admissionYear"
                required
                min={2015}
                max={2030}
                defaultValue={initialData?.admissionYear || 2024}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Academic Status *
            </label>
            <Select
              name="status"
              defaultValue={initialData?.status || "active"}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
            </Select>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex items-center gap-1.5">
            <Save className="h-4 w-4" /> Save Student
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
