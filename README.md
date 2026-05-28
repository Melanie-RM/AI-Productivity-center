# AI Productivity Center

A productivity web app built with **TanStack React Start**, **Vite**, and **Tailwind CSS** that bundles AI-powered workflows for professionals.

## What it is

This project provides an AI workplace assistant with integrated tools for:

- **Smart email generation**
- **Meeting notes summarization**
- **Task planning** using an Eisenhower-style prioritization matrix
- **Research briefing generation**
- **General AI chat** for conversational support

The interface is a single-page app with file-based routes powered by `@tanstack/react-router`.

## Key features

- `GET /` - Dashboard with quick access to each AI workflow
- `GET /email` - Smart email generator with purpose, audience, tone, and detail input
- `GET /meeting` - Meeting note summarizer that returns structured summaries
- `GET /tasks` - Task planner that organizes work into priorities and time blocks
- `GET /research` - Research assistant that creates briefings with insights, trends, and actions
- `GET /chat` - Chat assistant for open-ended queries and follow-up interaction

## Tech stack

- `@tanstack/react-start` for app runtime and server functions
- `@tanstack/react-router` for file-based routing
- `vite` for development and build tooling
- `tailwindcss` for styling
- `lucide-react` icons
- `sonner` for toast notifications
- `zod` for input validation

## Project structure

- `src/routes/` - file-based routes for each UI workflow
- `src/lib/api/ai.functions.ts` - server functions that call the Lovable AI gateway
- `src/components/AppLayout.tsx` - shared layout and navigation
- `src/components/AIOutput.tsx` - reusable output panel for AI responses

## Environment

This app requires a Lovable AI API key to function.

Create a `.env` file or set the environment variable:

```bash
LOVABLE_API_KEY=your_api_key_here
```

## Scripts

```bash
npm run dev       # start local development server
npm run build     # build production bundle
npm run preview   # preview production build locally
npm run lint      # run ESLint
npm run format    # format project files with Prettier
```

## Configuration

- `vite.config.ts` uses `@lovable.dev/vite-tanstack-config` to integrate TanStack Start, Tailwind, and Nitro.
- `tsconfig.json` is configured for ES2022, React JSX, and path aliases with `@/*`.

## Notes

- AI requests are proxied through `https://ai.gateway.lovable.dev/v1/chat/completions`.
- All AI-generated content should be reviewed before use.
- The app is intended as a productivity toolkit for professionals and not as a finalized production product.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set `LOVABLE_API_KEY` in your environment.

3. Start development mode:

   ```bash
   npm run dev
   ```

4. Open the app in your browser at the local Vite URL.
