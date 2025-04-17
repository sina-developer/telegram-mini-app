# Telegram Mini App - Blog Platform

A blog platform built as a Telegram Mini App, featuring a clean UI. Built with Next.js and Material-UI.

## Features

- 📝 Create and manage blog posts
- 🖼️ Image upload support (via Vercel Blob Storage)
- 📱 Responsive Material-UI design
- 🗄️ Redis-based data persistence
- 📊 Pagination support
- 🚀 Optimized for Vercel deployment

## Live Demo

- 🌐 Web App: [https://telegram-mini-app-chi-three.vercel.app/](https://telegram-mini-app-chi-three.vercel.app/)
- 🤖 Telegram Bot: [@fanap_sina_test_bot](https://t.me/fanap_sina_test_bot)

## Tech Stack

- **Frontend:**
  - Next.js (App Router)
  - Material-UI v7
  - React Hook Form
  - Zod (Form validation)
  - TypeScript

- **Backend:**
  - Next.js API Routes
  - Redis (Data storage)
  - Vercel Blob Storage (Image storage)

## Prerequisites

- Node.js 18+
- npm or yarn
- Redis instance (Cloud or local)
- Vercel account (for deployment)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Redis Configuration
REDIS_URL=your_redis_connection_string

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_blob_token
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/sina-developer/telegram-mini-app.git
cd telegram-mini-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import your repository in Vercel

3. Configure environment variables in Vercel project settings:
   - Add `REDIS_URL`
   - Add `BLOB_READ_WRITE_TOKEN`

4. Deploy!

### Manual Configuration

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Link your project:

```bash
vercel link
```

3. Add environment variables:

```bash
vercel env add REDIS_URL
vercel env add BLOB_READ_WRITE_TOKEN
```

4. Deploy:

```bash
vercel deploy
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── constants/        # Constants and configurations
│   ├── enums/           # TypeScript enums
│   ├── schemas/         # Zod validation schemas
│   ├── types/           # TypeScript types/interfaces
│   └── utils/           # Utility functions
├── public/              # Static files
└── scripts/             # Utility scripts
```

## API Routes

- `POST /api/posts` - Create a new post
- `GET /api/posts` - Get all posts (with pagination)
- `POST /api/upload` - Upload images to Vercel Blob
