# ✅ Quick Checklist for LearnFlex Setup

## Before You Start

### System Requirements
- [ ] Node.js (v18+) installed - https://nodejs.org/
- [ ] npm or yarn installed
- [ ] Windows PowerShell or Command Prompt ready
- [ ] VS Code installed - https://code.visualstudio.com/

---

## VS Code Extensions to Install (Copy the IDs)

### 🔴 CRITICAL (Install these first)
```
esbenp.prettier-vscode
dbaeumer.vscode-eslint
```

### 🟡 ESSENTIAL (Highly recommended)
```
dsznajder.es7-react-js-snippets
bradlc.vscode-tailwindcss
palmapps.nextjs-app-router
csstools.postcss
```

### 🟢 OPTIONAL (Nice to have)
```
mhutchie.git-graph
coenraads.bracket-pair-colorizer-2
eamodio.gitlens
```

**How to install an extension:**
1. Press `Ctrl + Shift + X` (Extensions panel)
2. Search for the extension name or ID
3. Click "Install"

---

## Setup Steps

### Step 1: Open Terminal
Press `` Ctrl + ` `` in VS Code or open PowerShell

### Step 2: Navigate to Project
```powershell
cd c:\Users\DELL\Desktop\LearnFlex
```

### Step 3: Install Dependencies
```powershell
npm install
```
⏱️ This will take 2-5 minutes

### Step 4: Create Config Files (if missing)
The files below should auto-generate, but check:
- [ ] `tsconfig.json` exists
- [ ] `next.config.js` exists
- [ ] `tailwind.config.ts` exists
- [ ] `postcss.config.mjs` exists

### Step 5: Start Development Server
```powershell
npm run dev
```

### Step 6: Open in Browser
Navigate to: http://localhost:3000

---

## Expected Output When Running `npm run dev`

```
> next dev

  ▲ Next.js 16.0.10
  - Local:        http://localhost:3000

Ready in 2.5s
```

✅ If you see this, you're ready to start coding!

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| `npm: command not found` | Reinstall Node.js from nodejs.org |
| `Port 3000 already in use` | `npm run dev -- -p 3001` (use port 3001) |
| `Module not found` errors | Delete `node_modules` folder, run `npm install` again |
| TypeScript errors | Make sure `tsconfig.json` exists in project root |
| Tailwind classes not working | Check `tailwind.config.ts` exists and import in CSS |

---

## Project Structure

```
LearnFlex/
├── app/                      # Next.js App Router (pages, layouts)
├── components/               # React components (reusable UI)
├── lib/                       # Utility functions, helpers
├── public/                    # Static images, fonts
├── styles/                    # Global CSS
├── package.json               # Dependencies ✅
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind CSS config
├── postcss.config.mjs         # PostCSS config
└── next.config.js             # Next.js config
```

---

## Tech Stack Summary

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.0.10 | React framework |
| React | 19.2.0 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4.1.9 | Styling |
| Radix UI | Latest | Accessible components |
| React Hook Form | ^7.60.0 | Form management |
| Zod | 3.25.76 | Validation |
| Framer Motion | 12.27.0 | Animations |
| Recharts | 2.15.4 | Charts/graphs |

---

## Ready? 🚀

Once all steps are complete and `npm run dev` is running, you're ready to:
1. Open `http://localhost:3000`
2. Start editing files in `app/` directory
3. See changes automatically refresh in the browser (Hot Reload)

Good luck! 💪
