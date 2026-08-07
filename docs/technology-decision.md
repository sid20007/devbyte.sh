# Technology Decision Record

This document outlines key technical decisions made for the **Student Master & Academic Profile** 8-hour hackathon MVP.

---

## 1. Prisma + SQLite vs. MongoDB / Raw SQL

### Decision
We chose **Prisma ORM with SQLite** for data persistence.

### Rationale
- **Type Safety & Developer Speed:** Prisma auto-generates TypeScript types based on our schema, giving us end-to-end type safety, auto-completion, and catching query errors at compile-time during rapid development.
- **Zero Server Setup:** SQLite is a file-based database that requires no external database server, Docker containers, or cloud setup. It runs locally out-of-the-box, making setup instant for judges and collaborators.
- **Why not MongoDB?** MongoDB requires running a local daemon or setting up Atlas cloud credentials, adding unnecessary friction during an 8-hour hackathon. Furthermore, relational relations (students to programs) fit a relational model naturally.
- **Why not Raw SQL?** Writing raw SQL strings increases the risk of runtime syntax errors, lacks compile-time type checks, and requires manual mapping of query results to TypeScript types.

---

## 2. Direct Foreign Keys vs. Separate Enrollment Entity

### Decision
We chose **Direct Foreign Keys** (linking `Student` directly to `Program`) instead of creating a separate `Enrollment` join entity.

### Rationale
- **MVP Scope:** For this 8-hour hackathon, we only need to store and display the student's *current* academic status and program enrollment.
- **Reduced Complexity:** A separate `Enrollment` entity is ideal for historical tracking (e.g., semester history, transfers, past courses), but introduces multi-table joins, complex mutations, and schema overhead.
- **Simpler Queries:** Direct foreign keys allow fast, single-level queries and straightforward forms while fulfilling all functional requirements for the MVP.
