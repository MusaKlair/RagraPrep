# Ragra-Prep Backend

This folder contains the isolated backend logic for the Ragra-Prep application. It is a standalone Next.js project focused on API routes, database management, and business logic.

## Project Structure

- `app/api/`: REST API endpoints.
- `lib/`: Core business logic, following SOLID principles.
  - `interfaces/`: Abstractions and types.
  - `repositories/`: Data access layer (Prisma).
  - `services/`: Business logic layer.
  - `models/`: Domain entities.
  - `di/`: Dependency Injection (ServiceFactory).
- `prisma/`: Database schema and migrations.
- `scripts/`: Initialization and maintenance scripts.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`.

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

4. Run the API (defaults to port 3000):
   ```bash
   npm run dev
   ```

## Development

This project uses TypeScript and Next.js App Router for API routes. Business logic is separated into services and repositories to ensure maintainability and testability.
