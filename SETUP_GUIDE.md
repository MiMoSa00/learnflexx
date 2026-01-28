# LearnFlex Project Setup Guide

This is a **Next.js 16 project** with React 19, TypeScript, Tailwind CSS, and Radix UI components.

## Prerequisites

### 1. **Node.js & npm**
- Download and install from: https://nodejs.org/ (LTS version recommended)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

## VS Code Extensions to Install

Install these extensions in VS Code for the best development experience:

### Essential
1. **ES7+ React/Redux/React-Native snippets** (dsznajder.es7-react-js-snippets)
2. **Prettier - Code formatter** (esbenp.prettier-vscode)
3. **ESLint** (dbaeumer.vscode-eslint)
4. **TypeScript Vue Plugin (Volar)** (Vue.volar) - or **Volar** for better TypeScript support

### Helpful for Next.js
5. **Next.js** (palmapps.nextjs-app-router)
6. **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
7. **PostCSS Language Support** (csstools.postcss)
8. **Thunder Client** or **REST Client** - for API testing

### Optional but Recommended
9. **Git Graph** (mhutchie.git-graph)
10. **Bracket Pair Colorizer 2** (coenraads.bracket-pair-colorizer-2)

## Installation Steps

### Step 1: Initialize the Project
```bash
npm install
```

### Step 2: Create Essential Config Files
Make sure you have:
- `package.json` ✅ (already have)
- `tsconfig.json` (will be auto-generated or add it)
- `next.config.js` (create if needed)
- `tailwind.config.ts` (create if needed)
- `postcss.config.mjs` (create if needed)

### Step 3: Run Development Server
```bash
npm run dev
```
Open http://localhost:3000 in your browser

### Step 4: (Optional) Set up Linting
```bash
npm run lint
```

## Project Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4 + PostCSS
- **Components**: Radix UI
- **Form Management**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme**: Next Themes (dark/light mode)
- **Notifications**: Sonner
- **Language**: TypeScript

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Troubleshooting

### Port 3000 already in use?
```bash
npm run dev -- -p 3001
```

### Node modules issues?
```bash
rm -r node_modules package-lock.json
npm install
```

### TypeScript errors?
- Make sure `tsconfig.json` exists
- Run: `npm run build` to check for build errors

## File Structure Tips

Typical Next.js 16 structure:
```
project/
├── app/                 # App router pages
├── components/          # Reusable components
├── lib/                 # Utility functions
├── public/              # Static files
├── styles/              # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

You're all set! 🚀
