# Setup Instructions

## ⚡ Quick Note: Your Database is Pre-Configured!

Your project already has the database credentials configured:
- **Host**: 15.235.66.156
- **User**: bringapk_androidtv_admin
- **Database**: bringapk_androidtv

You only need to add your **Telegram Bot Token** and **Admin ID**!

## Prerequisites

Before you start, make sure you have:

1. **Telegram Bot Token**
   - Go to [@BotFather](https://t.me/BotFather)
   - Send `/newbot` and follow the instructions
   - Copy your bot token

2. **Your Telegram Admin ID**
   - Go to [@userinfobot](https://t.me/userinfobot)
   - Send `/start` and it will show your ID
   - Copy your ID

## Local Development Setup

### 1. Clone and Install

```bash
git clone <your-repo>
cd MyTelegram-androidtvbot-main
npm install
```

### 2. Update Environment File

The `.env.local` file is already created with database credentials.

Just edit it and add your Telegram details:

```env
TELEGRAM_BOT_TOKEN="paste_your_bot_token_here"
ADMIN_TELEGRAM_ID="paste_your_admin_id_here"

# Database is already configured below:
DB_HOST="15.235.66.156"
DB_USER="bringapk_androidtv_admin"
DB_PASSWORD="yCRQXTn88@xJ*eFn"
DB_NAME="bringapk_androidtv"
DB_PORT="3306"
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 4. Test Your Bot

1. Open Telegram and find your bot
2. Send `/start`
3. Send a test message
4. Check if you (admin) receive the message
5. Reply to the message in Telegram
6. Verify the user receives your reply

## Vercel Deployment Setup

### 1. Push to GitHub

```bash
git add .
git commit -m "Add Telegram credentials"
git push origin main
```

### 2. Deploy to Vercel

Option A: Using Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Continue to next step

### 3. Set Environment Variables on Vercel

On Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add these variables:
   - `TELEGRAM_BOT_TOKEN` = your_bot_token
   - `ADMIN_TELEGRAM_ID` = your_admin_id
   - `NODE_ENV` = `production`

**Database variables are already configured in the project!**

### 4. Trigger Webhook

After deployment, visit:
```
https://your-app.vercel.app/api/activate-webhook
```

You should see:
```
✅ Webhook registration triggered! Target URL: ...
```

### 5. Test on Vercel

1. Open Telegram and find your bot
2. Send `/start`
3. Send a test message
4. Verify you receive it
5. Reply and verify user receives it

## Troubleshooting

### Bot not responding to messages

**Check 1: Verify Bot Token**
```bash
# In local terminal
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getMe"
```

**Check 2: Verify Webhook**
```bash
# Replace YOUR_TOKEN with your actual token
curl "https://your-app.vercel.app/webhook/YOUR_TOKEN"
```

**Check 3: Check Logs**
- Local: Look at terminal output
- Vercel: Go to Deployments → Select latest → Logs

### Database connection error

**Check 1: Verify Connection**
The database is pre-configured. If you get an error:
- Make sure your internet connection is working
- Check that the database host (15.235.66.156) is accessible
- Verify your Telegram token is correct

**Check 2: Check Logs**
```bash
# Local
npm run dev

# Vercel
vercel logs --prod
```

### Webhook not being set

**Check 1: Verify Bot Token**
- Make sure `TELEGRAM_BOT_TOKEN` is correct
- It should start with numbers and contain a colon

**Check 2: Manually Trigger**
```bash
curl "https://your-app.vercel.app/api/activate-webhook"
```

**Check 3: Check Logs**
```bash
vercel logs --prod
```

## Admin Commands

Once deployed, use these commands:

- `/stats` - View statistics
- `/block 123456` - Block user
- `/unblock 123456` - Unblock user
- `/broadcast Hello everyone!` - Send to all users

## Performance Tips

1. Keep database connection pool small (Vercel has limits)
2. Monitor logs for errors
3. Test webhook regularly

## Security Checklist

- [ ] Bot token is in environment variables (not in code)
- [ ] `.env.local` is in `.gitignore` (don't commit it)
- [ ] Using HTTPS (Vercel provides this)
- [ ] Admin ID is kept secret
- [ ] Database password is not shared

## Next Steps

1. Read [QUICK_START.md](./QUICK_START.md) for fastest setup
2. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide
3. Check [README.md](./README.md) for project overview
4. Customize the bot as needed

## Support Resources

- [Telegraf.js Docs](https://telegraf.js.org/)
- [Vercel Docs](https://vercel.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [MySQL Docs](https://dev.mysql.com/doc/)

## Common Issues

| Issue | Solution |
|-------|----------|
| Bot doesn't respond | Check token, verify webhook, check logs |
| Database error | Database is pre-configured, check token |
| Webhook not set | Check bot token, verify it's correct |
| Slow responses | Check Vercel logs |
| Deployment fails | Check environment variables on Vercel |

Good luck! 🚀
