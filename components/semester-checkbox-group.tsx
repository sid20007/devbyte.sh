"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SemesterCheckboxGroupProps {
  selectedSemesters: number[];
}

export function SemesterCheckboxGroup({ selectedSemesters: initialSelected }: SemesterCheckboxGroupProps) {
  const [selected, setSelected] = useState<number[]>(initialSelected);

  const toggleSemester = (semNum: number) => {
    if (selected.includes(semNum)) {
      setSelected(selected.filter((s) => s !== semNum));
    } else {
      setSelected([...selected, semNum]);
    }
  };

  const clearAll = () => {
    setSelected([]);
  };

  return (
    <div className="pt-3 border-t">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          Filter by Semesters (Multi-Select)
          {selected.length > 0 && (
            <span className="text-[10px] bg-primary text-primary-foreground font-bold px-1.5 py-0.5 rounded-full">
              {selected.length} selected
            </span>
          )}
        </span>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <X className="h-3 w-3" /> Clear Semesters
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((semNum) => {
          const isChecked = selected.includes(semNum);
          return (
            <label
              key={semNum}
              className={cn(
                "flex items-center justify-center gap-1.5 text-xs font-medium px-2 py-1.5 rounded-md border cursor-pointer transition-all select-none text-center",
                isChecked
                  ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                  : "bg-background border-input hover:bg-accent hover:text-foreground text-muted-foreground"
              )}
            >
              <input
                type="checkbox"
                name="semesters"
                value={semNum}
                checked={isChecked}
                onChange={() => toggleSemester(semNum)}
                className="sr-only"
              />
              <span>Semester {semNum}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
