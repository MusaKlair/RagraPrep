RagraPrep — Project Index

Overview
- Root: Docker compose, README, Backend and Frontend folders.

Top-level items
- docker-compose.yml: orchestrates `db` (pgvector), `backend` (Next.js API), `frontend` (Next.js app).
- readme.md: quick start notes for running with Docker.

Backend/ (API service)
- app/: Next.js App Router API routes and pages (backend service UI)
  - app/api/auth/* : login, signup, change-password, forgot-password, me
  - app/api/ai/* : `embeddings`, `notes`, `quiz` — Gemini integration (GEMINI_API_KEY)
  - app/api/notes/* : notes CRUD, sharing endpoints
  - app/api/questions/* : questions CRUD, upload, search (vector similarity)
  - app/page.tsx, app/layout.tsx: backend UI shell
- lib/: core services and utilities
  - lib/prisma.ts: Prisma client factory (PrismaPg adapter using PG Pool)
  - lib/auth.ts, lib/email.ts, lib/supabase.ts
  - lib/di/ServiceFactory.ts: dependency factory for services/repositories
  - lib/repositories/: BaseRepository and entity repositories (User, Question, Answer, Note)
  - lib/services/: EmbeddingService, UserService, AuthService (business logic)
  - lib/utils/ResponseBuilder.ts: standardized API responses
- models/: domain model wrappers for Prisma rows (User, Question, Answer, Note, Task)
- prisma/
  - schema.prisma: models — User, Task, Question, Answer, Note (pgvector embedding column on Question)
  - migrations/: SQL migrations, includes enabling pgvector extension and embedding column
- scripts/: e.g., init-admin.ts
- Dockerfile, package.json, tsconfig.json, eslint, etc.

Frontend/ (UI)
- app/: Next.js App Router pages and routes
  - pages: `page.tsx` (home), `login`, `signup`, `dashboard`, `tasks`, `questions`, `notes`, `quiz`, `settings`, `admin/*`
  - notes/shared/[token]: public shared-note view
  - many client components under `components/` (DashboardNav, RichTextEditor, DatePicker, QuestionModal, LogoutButton)
- lib/: frontend-side helpers mirroring backend (prisma client, auth helpers, supabase client, email util)
- Dockerfile, package.json, tsconfig.json

Notable integrations and runtime concerns
- Database: PostgreSQL with pgvector extension for vector embeddings. Migrations create `UserRole` enum and entity tables.
- Embeddings & AI: Gemini models used for embeddings (`text-embedding-004`) and content generation (`gemini-2.5-flash`). Env var `GEMINI_API_KEY` required.
- File storage: Supabase storage used for uploads (`supabase` client configured via env vars).
- Email: Resend API used (Resend key in env).
- Auth: JWT cookies (`auth-token`) with `JWT_SECRET` and helper functions in `lib/auth.ts`.

Key files (quick links)
- [docker-compose.yml](docker-compose.yml)
- [readme.md](readme.md)
- [backend/prisma/schema.prisma](backend/prisma/schema.prisma)
- [backend/app/api/questions/route.ts](backend/app/api/questions/route.ts)
- [backend/app/api/ai/embeddings/route.ts](backend/app/api/ai/embeddings/route.ts)
- [backend/lib/services/EmbeddingService.ts](backend/lib/services/EmbeddingService.ts)
- [backend/lib/prisma.ts](backend/lib/prisma.ts)
- [frontend/app/notes/page.tsx](frontend/app/notes/page.tsx)
- [frontend/components/RichTextEditor.tsx](frontend/components/RichTextEditor.tsx)

How I indexed this repo
- Scanned top-level files, backend and frontend folders, Prisma schema, migrations, API routes and key service files.
- Identified AI-related endpoints, embedding generation and vector search logic, and database schema.

Next steps (available if you want)
- Export a JSON search index mapping file path -> short summary.
- Generate a symbol index (functions/classes) for faster lookup.
- Run a grep-style report for TODOs or potential issues.

Generated: PROJECT_INDEX.md
