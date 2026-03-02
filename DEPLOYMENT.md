# Telegram Android TV Bot - Vercel Deployment Guide

This guide will help you deploy the Telegram Android TV Bot to Vercel with your pre-configured MySQL database.

## ⚡ Quick Info: Your Database is Already Configured!

Your project comes with these database credentials pre-configured:

```
Host: 15.235.66.156
User: bringapk_androidtv_admin
Password: yCRQXTn88@xJ*eFn
Database: bringapk_androidtv
Port: 3306
```

**You only need to provide your Telegram Bot Token and Admin ID!**

## Prerequisites

- A Telegram Bot Token (from @BotFather)
- Your Telegram Admin ID (from @userinfobot)
- A Vercel account
- Git installed locally

## Step 1: Get Your Telegram Credentials

### Get Bot Token

1. Open Telegram and go to [@BotFather](https://t.me/BotFather)
2. Send `/newbot`
3. Follow the instructions to create a new bot
4. Copy the bot token (looks like: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

### Get Admin ID

1. Open Telegram and go to [@userinfobot](https://t.me/userinfobot)
2. Send `/start`
3. It will display your ID (a number like: 228411414)
4. Copy your ID

## Step 2: Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Method 2: Using GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Select your GitHub repository
5. Configure environment variables (see Step 3)
6. Click "Deploy"

## Step 3: Configure Environment Variables on Vercel

1. Go to your project on Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable | Value |
|----------|-------|
| `TELEGRAM_BOT_TOKEN` | Your bot token from @BotFather |
| `ADMIN_TELEGRAM_ID` | Your Telegram ID from @userinfobot |
| `NODE_ENV` | production |

**Database variables are already configured in the project!**

## Step 4: Set Up Telegram Webhook

After deployment, your bot will automatically set up the webhook. However, you can manually trigger it:

1. Visit: `https://your-app.vercel.app/api/activate-webhook`
2. You should see: `✅ Webhook registration triggered! Target URL: ...`

Alternatively, you can test the webhook endpoint:

```bash
curl https://your-app.vercel.app/webhook/YOUR_BOT_TOKEN
```

You should get: `✅ Webhook endpoint is active. Telegram should send POST requests here.`

## Step 5: Test Your Bot

1. Open Telegram and search for your bot
2. Start the bot with `/start`
3. Send a test message
4. Check if the admin receives the message
5. Reply from admin account (reply to the forwarded message)
6. Verify the user receives the reply

## Monitoring & Logs

### View Logs on Vercel

1. Go to your project on Vercel Dashboard
2. Click **Deployments**
3. Select the latest deployment
4. Click **Logs** to see real-time logs

### Common Issues

#### Issue: Webhook not being set
- Check that `TELEGRAM_BOT_TOKEN` is correct
- Verify it's in the format: `123456:ABC-DEF1234...`
- Check the logs for error messages

#### Issue: Bot not responding
- Check that the webhook is active: `https://your-app.vercel.app/webhook/YOUR_BOT_TOKEN`
- Verify admin ID is correct (should be a number)
- Check logs for error messages

#### Issue: Database connection fails
- The database is pre-configured, so this is unlikely
- If it happens, check your internet connection
- Verify the database host (15.235.66.156) is accessible

## Admin Commands

Once deployed, you can use these commands with your bot:

- `/stats` - View bot statistics
- `/block <user_id>` - Block a user
- `/unblock <user_id>` - Unblock a user
- `/broadcast <message>` - Send a message to all users

## Database Schema

The bot automatically creates three tables:

### users
- `telegram_id` (BIGINT, PRIMARY KEY)
- `username` (VARCHAR)
- `first_name` (VARCHAR)
- `blocked` (TINYINT, default 0)
- `created_at` (TIMESTAMP)

### messages
- `id` (INT, AUTO_INCREMENT)
- `user_id` (BIGINT)
- `message_text` (TEXT)
- `reply_text` (TEXT)
- `admin_msg_id` (BIGINT)
- `created_at` (TIMESTAMP)

### admin_replies
- `admin_msg_id` (BIGINT, PRIMARY KEY)
- `user_id` (BIGINT)

## Performance Optimization

The bot is optimized for Vercel's serverless environment:

- Connection pooling with limited connections (5)
- Proper timeout handling
- Keep-alive enabled for database connections
- Efficient query execution

## Security Considerations

1. **Never commit `.env` files** - Use Vercel's environment variables
2. **Keep your bot token secret** - Never share it
3. **Use HTTPS only** (Vercel provides this by default)
4. **Keep your admin ID secret**

## Troubleshooting

### Check Deployment Status

```bash
vercel logs --prod
```

### Redeploy

```bash
vercel --prod --force
```

### Clear Vercel Cache

```bash
vercel --prod --force --skip-build
```

### Test Bot Token

```bash
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getMe"
```

If successful, you'll see your bot info in JSON format.

## Support

For issues related to:
- **Telegram Bot**: Check [Telegraf Documentation](https://telegraf.js.org/)
- **Vercel**: Check [Vercel Docs](https://vercel.com/docs)
- **MySQL**: Check [MySQL Documentation](https://dev.mysql.com/doc/)

## Additional Resources

- [Telegraf.js Documentation](https://telegraf.js.org/)
- [Vercel Documentation](https://vercel.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)

## Quick Checklist

- [ ] Got bot token from @BotFather
- [ ] Got admin ID from @userinfobot
- [ ] Pushed code to GitHub (if using GitHub integration)
- [ ] Deployed to Vercel
- [ ] Added TELEGRAM_BOT_TOKEN to Vercel environment
- [ ] Added ADMIN_TELEGRAM_ID to Vercel environment
- [ ] Triggered webhook: `/api/activate-webhook`
- [ ] Tested bot on Telegram

## Next Steps

1. ✅ Database is configured
2. ⏳ Get your Telegram credentials
3. ⏳ Deploy to Vercel
4. ⏳ Add environment variables
5. ⏳ Activate webhook
6. ⏳ Test your bot

Good luck! 🚀
