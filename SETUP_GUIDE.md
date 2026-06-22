# 🛠️ Setup Guide for Habit Tracker

This guide walks you through setting up the Habit Tracker application from scratch.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** v14 or higher - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** as package manager
- A code editor (VS Code, Sublime Text, etc.)

Verify installation:
```bash
node --version
npm --version
```

## Step-by-Step Setup

### 1. Create a New React Project (Choose One)

#### Using Vite (Recommended - Faster)
```bash
npm create vite@latest habit-tracker -- --template react
cd habit-tracker
npm install
```

#### Using Create React App
```bash
npx create-react-app habit-tracker
cd habit-tracker
```

### 2. Install Required Dependencies

```bash
npm install recharts
npm install -D tailwindcss postcss autoprefixer
```

### 3. Initialize Tailwind CSS

```bash
npx tailwindcss init -p
```

This creates two files:
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration

### 4. Configure Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 5. Add Tailwind CSS Directives

Create or update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 6. Import the CSS File

In `src/main.jsx` (Vite) or `src/index.js` (CRA), add:

```javascript
import './index.css'
```

### 7. Replace App Component

Replace the content of `src/App.jsx` with the `ht.jsx` file from this repository.

### 8. Run the Application

#### For Vite:
```bash
npm run dev
```

#### For Create React App:
```bash
npm start
```

The app will open automatically at:
- Vite: `http://localhost:5173`
- CRA: `http://localhost:3000`

## Project Structure

```
habit-tracker/
├── src/
│   ├── App.jsx          # Main application component (from ht.jsx)
│   ├── index.css        # Tailwind CSS imports
│   ├── main.jsx         # Entry point (Vite)
│   └── index.js         # Entry point (CRA)
├── public/
│   └── index.html       # HTML template
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── vite.config.js       # Vite configuration (Vite only)
```

## Building for Production

### For Vite:
```bash
npm run build
npm run preview
```

### For Create React App:
```bash
npm run build
```

This creates an optimized production build in the `dist/` (Vite) or `build/` (CRA) folder.

## Troubleshooting

### Issue: "Cannot find module 'recharts'"
**Solution:**
```bash
npm install recharts
```

### Issue: Tailwind styles not working
**Solution:**
1. Verify `tailwind.config.js` content paths are correct
2. Restart the dev server: `npm run dev`
3. Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Unexpected token" errors
**Solution:**
1. Ensure you're using React 18+
2. Check that `package.json` has `"type": "module"` (Vite)
3. Restart npm server

### Issue: Port already in use
**Solution:**
```bash
# Kill the process on port 5173 (Vite) or 3000 (CRA)
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## Development Tips

### Hot Module Replacement (HMR)
- Changes to files are reflected instantly in the browser
- Your component state is preserved during edits

### Browser DevTools
- Install React DevTools browser extension for better debugging
- Open DevTools: F12 or Ctrl+Shift+I (Windows) / Cmd+Option+I (Mac)

### Debugging
Add `console.log()` statements in your code:
```javascript
useEffect(() => {
  console.log('Current state:', state);
}, [state]);
```

View logs in the browser console.

## Deployment Options

### Netlify
1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist` (Vite) or `build` (CRA)

### Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### GitHub Pages
1. Build: `npm run build`
2. Push `dist/` or `build/` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

## Next Steps

After setup:
1. Explore the `ht.jsx` code to understand the structure
2. Try adding new features (dark mode, notifications, etc.)
3. Customize the UI with your own colors and styles
4. Deploy to your preferred hosting platform

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Recharts Guide](https://recharts.org/en-US/guide)
- [localStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

Happy coding! 🚀
