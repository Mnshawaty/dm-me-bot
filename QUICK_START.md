# Quick Start Guide - Pre-configured with Your Database

Your project is pre-configured with your database credentials. You only need to add your Telegram bot details!

## Database Info (Already Configured)

```
Host: 15.235.66.156
User: bringapk_androidtv_admin
Password: yCRQXTn88@xJ*eFn
Database: bringapk_androidtv
Port: 3306
```

## What You Need to Do

### Step 1: Get Telegram Bot Token

1. Open Telegram and go to [@BotFather](https://t.me/BotFather)
2. Send `/newbot`
3. Follow the instructions and get your bot token
4. Copy the token

### Step 2: Get Your Telegram Admin ID

1. Open Telegram and go to [@userinfobot](https://t.me/userinfobot)
2. Send `/start`
3. It will show your ID
4. Copy your ID

### Step 3: Update Environment Variables

#### For Local Testing:

Edit `.env.local` and replace:
```env
TELEGRAM_BOT_TOKEN="PASTE_YOUR_BOT_TOKEN_HERE"
ADMIN_TELEGRAM_ID="PASTE_YOUR_ADMIN_ID_HERE"
```

#### For Vercel Deployment:

On Vercel Dashboard → Settings → Environment Variables, add:
```
TELEGRAM_BOT_TOKEN = your_bot_token
ADMIN_TELEGRAM_ID = your_admin_id
```

(Database credentials are already configured)

## Local Testing

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` and test your bot.

## Deploy to Vercel

### Option 1: Using Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

### Option 2: Using GitHub

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your repository
5. Add environment variables (see Step 3 above)
6. Deploy

## After Deployment

1. Visit: `https://your-app.vercel.app/api/activate-webhook`
2. You should see: `✅ Webhook registration triggered!`
3. Open Telegram and test your bot

## Test the Bot

1. Find your bot on Telegram
2. Send `/start`
3. Send a test message
4. Check if you (admin) receive it
5. Reply to the message
6. Verify the user gets your reply

## Admin Commands

- `/stats` - View statistics
- `/block <user_id>` - Block a user
- `/unblock <user_id>` - Unblock a user
- `/broadcast <message>` - Send to all users

## Troubleshooting

### Bot not responding?

Check 1: Verify webhook is set
```bash
curl https://your-app.vercel.app/webhook/YOUR_BOT_TOKEN
```

Check 2: View logs
```bash
vercel logs --prod
```

### Database connection error?

The database is already configured. If you get an error:
1. Check your Telegram bot token is correct
2. Check your admin ID is correct
3. Verify your internet connection
4. Check Vercel logs

### Can't deploy?

1. Make sure you have a GitHub account
2. Push your code to GitHub
3. Connect to Vercel
4. Add environment variables
5. Deploy

## Files Included

- `.env.local` - Pre-configured for local development
- `.env.example` - Template with database info
- `DEPLOYMENT.md` - Detailed deployment guide
- `SETUP.md` - Comprehensive setup instructions
- `README.md` - Project overview

## Need Help?

1. Check `DEPLOYMENT.md` for detailed guide
2. Check `SETUP.md` for troubleshooting
3. Check logs: `vercel logs --prod`

## Next Steps

1. ✅ Database is configured
2. ⏳ Add your Telegram bot token
3. ⏳ Add your admin ID
4. ⏳ Deploy to Vercel
5. ⏳ Activate webhook
6. ⏳ Test your bot

Good luck! 🚀
