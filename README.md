# Student Master & Academic Profile

A student information management system built for a university hackathon.

## Overview
Student Master & Academic Profile is a lightweight, responsive web application designed to simplify student data management and provide quick insights through program-level analytics.

## Tech Stack
- **Frontend & Backend Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database & ORM:** SQLite with Prisma ORM
- **Styling:** Tailwind CSS

## Features
- **Student Management:** Add and edit student profiles and academic details.
- **Search & Filter:** Search students by name/roll number and filter by program or status.
- **Program Dashboard:** Visual dashboard showing program-wise student counts and metrics.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sid20007/devbyte.sh.git
   cd devbyte.sh
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up database and run migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
