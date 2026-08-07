"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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

interface ProgramData {
  program: string;
  "Student Count": number;
}

interface ProgramBarChartProps {
  data: ProgramData[];
}

const BAR_COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#10b981"];

export function ProgramBarChart({ data }: ProgramBarChartProps) {
  return (
    <Card className="border shadow-sm rounded-xl bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Program-Wise Student Breakdown
        </CardTitle>
        <CardDescription>
          Distribution of enrolled students across different academic programs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 25, right: 30, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="program"
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
                    const dataPoint = payload[0].payload as ProgramData;
                    return (
                      <div className="rounded-lg border bg-popover p-3 shadow-md text-popover-foreground">
                        <p className="font-semibold text-sm">{dataPoint.program}</p>
                        <p className="text-xs text-primary font-bold mt-1">
                          {dataPoint["Student Count"]} Students
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="Student Count" radius={[6, 6, 0, 0]}>
                <LabelList
                  dataKey="Student Count"
                  position="top"
                  style={{ fill: "#1e293b", fontWeight: 600, fontSize: 13 }}
                  offset={8}
                />
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
