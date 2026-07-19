# AI Creator Studio

A powerful AI-powered content creation platform built with Next.js, Express, and Prisma.

## Project Structure

```
ai-creator-studio/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── api/          # Express.js backend API
├── packages/
│   ├── ui/           # Shared UI components
│   ├── config/       # Shared configuration
│   └── types/        # Shared TypeScript types
├── prisma/           # Database schema and migrations
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Run database migrations:
   ```bash
   npm run db:migrate
   ```

### Development

Start both the frontend and backend:
```bash
npm run dev
```

Or run them separately:
```bash
cd apps/web && npm run dev
cd apps/api && npm run dev
```

## Features

- 🤖 AI-powered content generation
- 📝 Rich text editor for content creation
- 📊 Analytics and performance tracking
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔐 Secure authentication with JWT
- 🗄️ PostgreSQL database with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Tools**: Turbo, ESLint, Prettier

## License

MIT
