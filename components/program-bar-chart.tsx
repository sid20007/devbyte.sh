"use client";

import { BarChart, Card as TremorCard, Title, Subtitle } from "@tremor/react";

interface ProgramData {
  program: string;
  "Student Count": number;
}

interface ProgramBarChartProps {
  data: ProgramData[];
}

export function ProgramBarChart({ data }: ProgramBarChartProps) {
  return (
    <TremorCard className="border shadow-sm rounded-xl bg-card">
      <Title className="text-foreground text-lg font-semibold">Program-Wise Student Breakdown</Title>
      <Subtitle className="text-muted-foreground text-sm mb-4">
        Distribution of enrolled students across different academic programs
      </Subtitle>
      <BarChart
        className="mt-6 h-72"
        data={data}
        index="program"
        categories={["Student Count"]}
        colors={["blue"]}
        valueFormatter={(number: number) => `${number} Students`}
        yAxisWidth={48}
        showAnimation={true}
      />
    </TremorCard>
  );
}
