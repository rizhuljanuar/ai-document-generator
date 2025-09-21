# AI Document Generator

A smart web application that automatically generates code documentation using AI.

## Project Structure

```
ai-document-generator/
├── frontend/          # Nuxt.js frontend (Vue.js 3)
├── backend/           # Elysia.js backend (Bun.js runtime)
└── README.md
```

## Technology Stack

### Frontend
- **Framework**: Nuxt.js (Vue.js 3)
- **UI**: Tailwind CSS + Nuxt UI
- **Language**: TypeScript

### Backend
- **Runtime**: Bun.js
- **Framework**: Elysia.js
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Validation**: Zod

## Getting Started

### Prerequisites
- Bun.js installed
- Supabase project created
- Google AI Gemini API key

### Setup Instructions

1. **Clone and install dependencies**:
   ```bash
   bun install
   cd frontend && bun install
   cd ../backend && bun install
   ```

2. **Environment Configuration**:
   - Copy `backend/.env.example` to `backend/.env`
   - Fill in your Supabase credentials and Gemini API key

3. **Database Setup**:
   ```bash
   cd backend
   bun run db:generate
   bun run db:migrate
   ```

4. **Run Development Servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend && bun run dev

   # Terminal 2 - Frontend
   cd frontend && bun run dev
   ```

## Scripts

### Frontend
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run generate` - Generate static site

### Backend
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run db:generate` - Generate database migrations
- `bun run db:migrate` - Run database migrations
- `bun run test` - Run tests

## API Endpoints

- `GET /` - Health check
- `POST /api/generate-docs` - Generate documentation

## Features

- ✅ Multi-language code support (JavaScript, Python, Java, C++, TypeScript)
- ✅ Multiple documentation styles (JSDoc, Inline Comments, Markdown)
- ✅ Split-view comparison
- ✅ Copy and download functionality
- ✅ Responsive design
- ✅ User authentication (future)
- ✅ History tracking (future)