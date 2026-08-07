"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Save, User, AlertTriangle } from "lucide-react";

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

  // Sort academic years descending to find the most recent year label
  const sortedAcademicYears = useMemo(() => {
    return [...academicYears].sort((a, b) => b.label.localeCompare(a.label));
  }, [academicYears]);

  const mostRecentYearLabel = sortedAcademicYears[0]?.label || "";

  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    initialData?.departmentId || (departments.length > 0 ? departments[0].id : "")
  );

  const filteredPrograms = programs.filter(
    (prog) => prog.departmentId === selectedDepartment
  );

  const [selectedProgram, setSelectedProgram] = useState<string>(
    initialData?.programId || (filteredPrograms.length > 0 ? filteredPrograms[0].id : "")
  );

  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>(
    initialData?.academicYearId || (sortedAcademicYears.length > 0 ? sortedAcademicYears[0].id : "")
  );

  const [selectedSemesterId, setSelectedSemesterId] = useState<string>(
    initialData?.semesterId || (semesters.length > 0 ? semesters[0].id : "")
  );

  // Compute initial admission year derived from selected academic year if not provided
  const getInitialAdmissionYear = () => {
    if (initialData?.admissionYear) return initialData.admissionYear;
    const currentAy = academicYears.find((a) => a.id === selectedAcademicYearId);
    if (currentAy) {
      const year = parseInt(currentAy.label.split("-")[0], 10);
      if (!isNaN(year)) return year;
    }
    return 2024;
  };

  const [admissionYear, setAdmissionYear] = useState<number>(getInitialAdmissionYear());

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

  // Auto-update Admission Year when Academic Year changes
  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ayId = e.target.value;
    setSelectedAcademicYearId(ayId);

    const chosenAy = academicYears.find((a) => a.id === ayId);
    if (chosenAy) {
      const startYear = parseInt(chosenAy.label.split("-")[0], 10);
      if (!isNaN(startYear)) {
        setAdmissionYear(startYear);
      }
    }
  };

  // Validation logic: checks if selected Academic Year and Semester combination makes logical sense
  const validationError = useMemo(() => {
    const currentAyObj = academicYears.find((a) => a.id === selectedAcademicYearId);
    const currentSemObj = semesters.find((s) => s.id === selectedSemesterId);

    if (!currentAyObj || !currentSemObj) return null;

    const isMostRecentYear = currentAyObj.label === mostRecentYearLabel;
    const semNumber = currentSemObj.number;

    if (isMostRecentYear && semNumber > 2) {
      return `Validation Error: For the most recent Academic Year (${mostRecentYearLabel}), Semester cannot be higher than Semester 2.`;
    }

    if ((semNumber === 7 || semNumber === 8) && isMostRecentYear) {
      return `Validation Error: Semester ${semNumber} students belong to an earlier Academic Year, not ${mostRecentYearLabel}.`;
    }

    return null;
  }, [selectedAcademicYearId, selectedSemesterId, academicYears, semesters, mostRecentYearLabel]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (validationError) {
      e.preventDefault();
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

      <form action={action} onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Validation Warning Alert Banner */}
          {validationError && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs flex items-start gap-2.5 shadow-xs">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-950">Logical Combination Mismatch</p>
                <p className="mt-0.5 text-amber-800">{validationError}</p>
              </div>
            </div>
          )}

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
                value={selectedAcademicYearId}
                onChange={handleAcademicYearChange}
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
                value={selectedSemesterId}
                onChange={(e) => setSelectedSemesterId(e.target.value)}
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
                value={admissionYear}
                onChange={(e) => setAdmissionYear(parseInt(e.target.value, 10) || 2024)}
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
          <Button
            type="submit"
            disabled={!!validationError}
            className="flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" /> Save Student
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
