# Database Setup Guide - Supabase & Drizzle ORM

## Prerequisites
- Install [Bun.js](https://bun.sh/)
- Create a Supabase account and project
- Get your Supabase URL and anon key

## Step 1: Install Dependencies
```bash
bun install
```

## Step 2: Set up Supabase Project

### Create Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose a name and password for your database
4. Select a region
5. Create the project

### Get Database Credentials
1. In your Supabase dashboard, go to "Settings" → "Database"
2. Copy the **Database URL** (starts with `postgresql://`)
3. Go to "Settings" → "API" to get your **anon key**

## Step 3: Configure Environment Variables

Edit `.env` file in the backend directory:
```env
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

## Step 4: Generate Database Migrations

```bash
bun run db:generate
```

This will create migration files in `src/database/migrations/`

## Step 5: Run Migrations

```bash
bun run db:migrate
```

This will apply the migrations to your Supabase database.

## Step 6: Verify Database Schema

Check if the `documentation_history` table was created:
1. Go to your Supabase dashboard
2. Navigate to "Table Editor"
3. Look for the `documentation_history` table

## Database Schema

The `documentation_history` table has the following columns:
- `id` (text, primary key) - Unique identifier using CUID2
- `user_id` (text, nullable) - Optional user identifier for future authentication
- `original_code` (text) - The original code submitted by the user
- `generated_docs` (text) - The AI-generated documentation
- `language` (text) - Programming language of the code
- `style` (text) - Documentation style used
- `created_at` (timestamp) - Creation timestamp

## Testing the Database Connection

Start the development server:
```bash
bun run dev
```

The server will test the database connection on startup and report success or failure.

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check if your Supabase URL is correct
   - Ensure the database URL starts with `postgresql://`
   - Verify your network connection

2. **Migration Issues**
   - Run `bun run db:migrate` with proper permissions
   - Check if the database URL is accessible
   - Ensure you have the latest dependencies

3. **Schema Errors**
   - Check that your schema.ts file is correctly defined
   - Verify all imports are correct
   - Run migrations in sequence

### Drizzle Studio

For database management and visualization:
```bash
bun run db:studio
```

This opens Drizzle Studio where you can:
- View and edit tables
- Run SQL queries
- Manage database schema
- Debug data

## Security Considerations

- **Never commit your `.env` file to version control**
- **Use environment variables for sensitive data**
- **Restrict database access using Supabase Row Level Security (RLS)**
- **Validate all user inputs**
- **Implement proper authentication in production**