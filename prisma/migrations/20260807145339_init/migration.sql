-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Program_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AcademicYear" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Semester" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "admissionYear" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "departmentId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Student_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Student_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Student_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Student_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicYear_label_key" ON "AcademicYear"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Semester_number_key" ON "Semester"("number");
