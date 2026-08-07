"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  CartesianGrid,
  Cell,
} from "recharts";

interface StudentRecord {
  id: string;
  programName: string;
  semesterNumber: number;
  academicYearId: string;
  academicYearLabel: string;
}

interface AcademicYearOption {
  id: string;
  label: string;
}

interface ProgramBarChartProps {
  students: StudentRecord[];
  academicYears: AcademicYearOption[];
  programNames: string[];
}

const BAR_COLORS = [
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#84cc16", // Lime
];

export function ProgramBarChart({ students, academicYears, programNames }: ProgramBarChartProps) {
  const [viewMode, setViewMode] = useState<"program" | "semester">("program");
  const [selectedYearId, setSelectedYearId] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter students based on selected academic year (defaults to All Years = "")
  const filteredStudents = useMemo(() => {
    if (!selectedYearId) return students;
    return students.filter((s) => s.academicYearId === selectedYearId);
  }, [students, selectedYearId]);

  // Aggregate data based on viewMode
  const chartData = useMemo(() => {
    if (viewMode === "program") {
      return programNames.map((name) => {
        const count = filteredStudents.filter((s) => s.programName === name).length;
        return {
          category: name,
          "Student Count": count,
        };
      });
    } else {
      // By Semester (1 through 8)
      return [1, 2, 3, 4, 5, 6, 7, 8].map((semNum) => {
        const count = filteredStudents.filter((s) => s.semesterNumber === semNum).length;
        return {
          category: `Sem ${semNum}`,
          fullLabel: `Semester ${semNum}`,
          "Student Count": count,
        };
      });
    }
  }, [filteredStudents, viewMode, programNames]);

  return (
    <Card className="border shadow-sm rounded-xl bg-card">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {viewMode === "program" ? "Program-Wise Student Breakdown" : "Semester-Wise Student Breakdown"}
            </CardTitle>
            <CardDescription>
              {viewMode === "program"
                ? "Distribution of enrolled students across degree programs"
                : "Student distribution across Semesters 1 through 8"}
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Toggle */}
            <div className="inline-flex rounded-lg border bg-muted p-1 gap-1">
              <Button
                type="button"
                variant={viewMode === "program" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs font-medium px-3"
                onClick={() => setViewMode("program")}
              >
                By Program
              </Button>
              <Button
                type="button"
                variant={viewMode === "semester" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs font-medium px-3"
                onClick={() => setViewMode("semester")}
              >
                By Semester
              </Button>
            </div>

            {/* Academic Year Filter Dropdown */}
            <div className="w-44">
              <Select
                value={selectedYearId}
                onChange={(e) => setSelectedYearId(e.target.value)}
                className="h-8 text-xs font-medium"
              >
                <option value="">All Academic Years ({students.length})</option>
                {academicYears.map((ay) => (
                  <option key={ay.id} value={ay.id}>
                    {ay.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80 w-full pt-4">
          {!isMounted ? (
            /* Skeleton Loading State during First Paint */
            <div className="h-full w-full rounded-lg bg-slate-100/70 dark:bg-slate-800/40 animate-pulse flex flex-col justify-end p-6 gap-4">
              <div className="flex items-end justify-between gap-4 h-52">
                <div className="w-full bg-slate-200/80 rounded-t-md h-3/4" />
                <div className="w-full bg-slate-200/80 rounded-t-md h-full" />
                <div className="w-full bg-slate-200/80 rounded-t-md h-2/3" />
                <div className="w-full bg-slate-200/80 rounded-t-md h-5/6" />
              </div>
              <div className="h-4 bg-slate-200/80 rounded w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 25, right: 25, left: 10, bottom: 25 }}
                barCategoryGap="28%"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  interval={0}
                  tickFormatter={(val: string) => {
                    if (val.includes("(ISE)")) return "ISE";
                    if (val.includes("(CSE)")) return "CSE";
                    if (val.includes("(AIML)")) return "AIML";
                    if (val.includes("(ECE)")) return "ECE";
                    return val;
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = payload[0].payload;
                      const label = dataPoint.fullLabel || dataPoint.category;
                      return (
                        <div className="rounded-lg border bg-popover p-3 shadow-md text-popover-foreground">
                          <p className="font-semibold text-sm">{label}</p>
                          <p className="text-xs text-primary font-bold mt-1">
                            {dataPoint["Student Count"]} Students
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="Student Count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  <LabelList
                    dataKey="Student Count"
                    position="top"
                    style={{ fill: "#1e293b", fontWeight: 600, fontSize: 13 }}
                    offset={8}
                  />
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
