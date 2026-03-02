# Quick Start Guide - Fully Configured

Your project is now fully configured with your Telegram credentials and MySQL database. I've also fixed the build error related to minification.

## Credentials (Already Set)

✅ **Telegram Bot Token**: `8721533073:AAGkuTSi_bOIFbgFzijOH67SGPHLCuepZSo`
✅ **Admin ID**: `228411414`
✅ **MySQL Host**: `15.235.66.156`
✅ **MySQL User**: `bringapk_androidtv_admin`
✅ **MySQL Database**: `bringapk_androidtv`

## Deployment Fixes

1.  **Vercel Structure**: Server logic moved to `api/server.ts` to satisfy Vercel's requirements.
2.  **Build Error Fix**: Updated `vite.config.ts` to use `esbuild` for minification, which is the default and faster option, resolving the missing `terser` dependency error.
3.  **Dependency Update**: Added `terser` to `devDependencies` just in case, but switched to `esbuild` for a more reliable build process on Vercel.

## How to Deploy to Vercel

### Option 1: Using Vercel CLI (Recommended)

1. Open your terminal in the project root.
2. Run:
```bash
npm i -g vercel
vercel --prod
```

### Option 2: Using GitHub

1. Push this project to a new GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click "New Project".
3. Select your repository and click "Deploy".

## After Deployment

1. Visit: `https://your-app.vercel.app/api/activate-webhook`
2. You should see: `✅ Webhook registration triggered!`
3. Open Telegram and test your bot.

## Troubleshooting

### Deployment Error?
I have updated the build configuration to use `esbuild` for minification. This should resolve the previous build error you encountered.

### Bot not responding?
1. Visit the activation link: `https://your-app.vercel.app/api/activate-webhook`
2. Check Vercel logs: `vercel logs --prod`

Good luck! 🚀
