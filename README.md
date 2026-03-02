# Telegram Android TV Admin Bot

A powerful Telegram bot for managing user messages and communications with admin replies. Built with Express.js, React, TypeScript, and MySQL. Optimized for Vercel deployment.

## Features

✨ **Core Features**
- User message forwarding to admin
- Admin reply system with automatic routing
- User blocking/unblocking
- Broadcast messages to all users
- Real-time statistics dashboard
- Arabic language support

🚀 **Technical Features**
- Built with Express.js and Telegraf
- React frontend with Tailwind CSS
- MySQL database integration
- Serverless-ready for Vercel deployment
- TypeScript for type safety
- Real-time stats API

## Quick Start

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo>
cd MyTelegram-androidtvbot-main
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

4. **Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file with:

```env
# Telegram Configuration
TELEGRAM_BOT_TOKEN="your_bot_token_here"
ADMIN_TELEGRAM_ID="your_admin_id_here"

# Database Configuration
DB_HOST="localhost"
DB_USER="your_db_user"
DB_PASSWORD="your_db_password"
DB_NAME="your_db_name"
DB_PORT="3306"

# Application
APP_URL="http://localhost:3000"
NODE_ENV="development"
```

## Deployment

### Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

Quick deploy:
```bash
npm i -g vercel
vercel --prod
```

## Project Structure

```
├── server.ts              # Express server & Telegram bot logic
├── src/
│   ├── App.tsx           # React dashboard component
│   ├── db.ts             # MySQL database service
│   ├── main.tsx          # React entry point
│   └── index.css         # Tailwind styles
├── vercel.json           # Vercel configuration
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## Bot Commands

### User Commands
- `/start` - Start the bot and register

### Admin Commands (requires ADMIN_TELEGRAM_ID)
- `/stats` - View bot statistics
- `/block <user_id>` - Block a user
- `/unblock <user_id>` - Unblock a user
- `/broadcast <message>` - Send message to all users

## API Endpoints

### GET /api/stats
Returns bot statistics:
```json
{
  "totalUsers": 42,
  "totalMessages": 156,
  "blockedUsers": 3
}
```

### GET /api/activate-webhook
Manually triggers webhook registration

### POST /webhook/{token}
Telegram webhook endpoint (auto-configured)

## Database Schema

### users
- `telegram_id` - User's Telegram ID (Primary Key)
- `username` - Telegram username
- `first_name` - User's first name
- `blocked` - Block status (0 or 1)
- `created_at` - Registration timestamp

### messages
- `id` - Message ID (Auto-increment)
- `user_id` - Sender's Telegram ID
- `message_text` - Message content
- `reply_text` - Admin's reply (if any)
- `admin_msg_id` - ID of message sent to admin
- `created_at` - Message timestamp

### admin_replies
- `admin_msg_id` - Admin message ID (Primary Key)
- `user_id` - User ID being replied to

## Technologies Used

- **Backend**: Node.js, Express.js, TypeScript
- **Frontend**: React 19, Tailwind CSS, Motion
- **Database**: MySQL with mysql2
- **Telegram**: Telegraf.js
- **Build Tool**: Vite
- **Deployment**: Vercel

## Development

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Type Checking
```bash
npm run lint
```

### Clean Build
```bash
npm run clean
```

## Troubleshooting

### Bot not responding
1. Check that `TELEGRAM_BOT_TOKEN` is correct
2. Verify webhook is set: `GET /api/activate-webhook`
3. Check logs for errors

### Database connection issues
1. Verify all database credentials
2. Check that database host is accessible
3. Ensure database user has proper permissions

### Webhook errors
1. Verify `APP_URL` environment variable
2. Check that the URL is publicly accessible
3. Review logs for detailed error messages

For more troubleshooting, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Performance

- Optimized for serverless environments
- Connection pooling for database efficiency
- Minimal dependencies
- Fast React component rendering with Motion animations

## Security

- Environment variables for sensitive data
- Input validation and error handling
- SQL injection protection via parameterized queries
- HTTPS-only in production (Vercel default)

## License

MIT

## Support

For issues and questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
2. Review logs on Vercel Dashboard
3. Check Telegraf.js documentation

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

## Changelog

### v1.0.0
- Initial release
- MySQL integration
- Vercel deployment support
- React dashboard
- Admin commands
- User blocking system
