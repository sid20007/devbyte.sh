"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStudent(formData: FormData) {
  const name = formData.get("name") as string;
  const admissionYear = parseInt(formData.get("admissionYear") as string, 10);
  const status = formData.get("status") as string;
  const departmentId = formData.get("departmentId") as string;
  const programId = formData.get("programId") as string;
  const academicYearId = formData.get("academicYearId") as string;
  const semesterId = formData.get("semesterId") as string;

  if (!name || isNaN(admissionYear) || !status || !departmentId || !programId || !academicYearId || !semesterId) {
    throw new Error("All fields are required");
  }

  const student = await prisma.student.create({
    data: {
      name,
      admissionYear,
      status,
      departmentId,
      programId,
      academicYearId,
      semesterId,
    },
  });

  revalidatePath("/");
  revalidatePath("/students");
  redirect(`/students/${student.id}`);
}

export async function updateStudent(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const admissionYear = parseInt(formData.get("admissionYear") as string, 10);
  const status = formData.get("status") as string;
  const departmentId = formData.get("departmentId") as string;
  const programId = formData.get("programId") as string;
  const academicYearId = formData.get("academicYearId") as string;
  const semesterId = formData.get("semesterId") as string;

  if (!name || isNaN(admissionYear) || !status || !departmentId || !programId || !academicYearId || !semesterId) {
    throw new Error("All fields are required");
  }

  await prisma.student.update({
    where: { id },
    data: {
      name,
      admissionYear,
      status,
      departmentId,
      programId,
      academicYearId,
      semesterId,
    },
  });

  revalidatePath("/");
  revalidatePath("/students");
  revalidatePath(`/students/${id}`);
  redirect(`/students/${id}`);
}

export async function deleteStudent(id: string) {
  await prisma.student.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/students");
  redirect("/students");
}
