# AI-Powered Journaling API

A backend API for an AI-powered journaling application built with **Express 5**, **TypeScript**, **PostgreSQL**, and **Prisma 7**.

The system is designed with **strict typing**, **clean architecture**, and **provider-agnostic AI integration**, allowing seamless switching between local and cloud LLMs.

## Features

* JWT-based authentication
* Journal CRUD operations
* AI-powered journal analysis
* Date-range and quantity-based querying
* Strict runtime validation with Zod
* Clean error handling (domain errors + global handler)
* Prisma 7 with PostgreSQL adapter
* Express 5 native async error handling (no try/catch in routes)

## Tech Stack

* **Runtime**: Node.js
* **Framework**: Express 5
* **Language**: TypeScript (strict)
* **Database**: PostgreSQL
* **ORM**: Prisma 7 (`adapter-pg`)
* **Validation**: Zod
* **Auth**: JWT
* **AI / LLM**: Ollama (local), provider-agnostic abstraction

## Project Structure

```
src/
├── app.ts        # Express app setup
├── server.ts     # Server bootstrap
├── config/       # Application configuration 
├── errors/       # Domain / application error definitions
├── lib/llm/      # LLM abstraction layer
├── middleware/   # Express middleware
├── repository/   # Data access layer
├── routes/       # HTTP routes (auth, journal, analyze)
├── types/        # Global TypeScript augmentations
├── utils/        # Shared utilities (dates, helpers)
└── validations/  # Zod schemas for request/query validation
```

## Environment Variables

Create a `.env` file:

```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/ai_journal

JWT_SECRET=your_jwt_secret

LLM_PROVIDER=ollama
LLM_MODEL=llama3.2
OLLAMA_BASE_URL=http://localhost:11434
```

All environment variables are validated at startup using **Zod**.
The app will fail fast if configuration is invalid.

## Setup & Installation

### Install dependencies

```bash
npm install
```

### Initialize Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

> Ensure your PostgreSQL user can create databases (required for Prisma shadow DB).

### Run the server

```bash
npm run dev
```

API will be available at:

```
http://localhost:4000
```

## API Routes

### Auth

* `POST /auth/register`
* `POST /auth/login`

---

### Journals

* `POST /journal` – create a journal entry
* `GET /journal` – list journals
* `GET /journal/:id` – get a single journal
* `DELETE /journal/:id` – delete a journal

## Analyze Routes (AI)

### `GET /analyze/pattern`

Analyze multiple journal entries to detect patterns.

#### Query behavior

| Query  | Description              |
| ------ | ------------------------ |
| `from` | Start date (ISO string)  |
| `to`   | End date (ISO string)    |
| `qty`  | Number of latest entries |

Rules:

* Max **10 entries**
* You can use:

  * date range (`from` + `to`)
  * quantity (`qty`)
  * no query → defaults to **latest 5**
* Invalid combinations are rejected

#### Examples

```http
GET /analyze/pattern
```

```http
GET /analyze/pattern?qty=10
```

```http
GET /analyze/pattern?from=2025-01-01&to=2025-01-31
```

### `GET /analyze/:id`

Analyze a **single journal entry** by ID.

```http
GET /analyze/550e8400-e29b-41d4-a716-446655440000
```

## Error Handling Philosophy

* Repositories throw **domain errors**
* Express 5 forwards async errors automatically
* Global error handler maps errors → HTTP responses
* No `try/catch` in route handlers

Zod validation errors are handled separately.

## AI / LLM Architecture

AI access is abstracted behind a provider interface:

```ts
llm.analyze(entries);
```

Current provider:

* **Ollama (local)**

Future providers (no refactor needed):

* OpenAI
* Groq
* Mistral, etc.

## Design Principles

* Strict TypeScript (`strict`, `exactOptionalPropertyTypes`)
* No business logic in routes
* Repositories handle data access
* Validation at boundaries
* Clear separation of concerns
* Provider-agnostic AI design

## Roadmap

* Refresh tokens
* Weekly / monthly AI summaries
* Background jobs for AI processing
* Embeddings & semantic search
* Rate limiting
* Dockerized deployment