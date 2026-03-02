import express from 'express';
import { Telegraf, Context } from 'telegraf';
import { message } from 'telegraf/filters';
import dotenv from 'dotenv';
import { dbService, initDb } from './src/db';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminId = parseInt(process.env.ADMIN_TELEGRAM_ID || '0');
const appUrl = process.env.APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';

if (!token || !adminId) {
  console.error('Missing TELEGRAM_BOT_TOKEN or ADMIN_TELEGRAM_ID in environment variables');
  process.exit(1);
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware to check if user is blocked
  const checkBlocked = async (ctx: Context, next: () => Promise<void>) => {
    if (ctx.from) {
      const user = await dbService.getUser(ctx.from.id);
      if (user && user.blocked) {
        return; // Ignore messages from blocked users
      }
    }
    return next();
  };

  // Admin check middleware
  const isAdmin = (ctx: Context, next: () => Promise<void>) => {
    if (ctx.from?.id === adminId) {
      return next();
    }
    return ctx.reply('❌ عذراً، هذا الأمر مخصص للمسؤول فقط.');
  };

  // --- Server Setup ---
  app.use(express.json());

  // Logging middleware for debugging
  app.use((req, res, next) => {
    console.log(`[Server] ${req.method} ${req.url}`);
    next();
  });

  // Manual Webhook Activation Endpoint
  app.get('/api/activate-webhook', async (req, res) => {
    if (!appUrl) {
      return res.status(400).send('❌ Error: APP_URL environment variable is not set.');
    }
    try {
      const webhookUrl = `${appUrl}${webhookPath}`;
      await bot.telegram.setWebhook(webhookUrl);
      res.send(`✅ Webhook registration triggered! Target URL: ${webhookUrl}`);
    } catch (err) {
      console.error('Manual Webhook Error:', err);
      res.status(500).send(`❌ Failed to set webhook: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  // API endpoint for stats (used by frontend)
  app.get('/api/stats', async (req, res) => {
    console.log('[API] Request received for /api/stats');
    try {
      const stats = await dbService.getStats();
      console.log('[API] Stats fetched successfully:', stats);
      res.json(stats);
    } catch (err) {
      console.error('[API] Error fetching stats:', err);
      res.status(500).json({ 
        error: 'Failed to fetch stats', 
        details: err instanceof Error ? err.message : String(err) 
      });
    }
  });

  // Catch-all for other /api routes to prevent them from falling through to Vite
  app.all('/api/*', (req, res) => {
    console.log(`[API] 404 for ${req.url}`);
    res.status(404).json({ error: 'API route not found' });
  });

  // Initialize MySQL Database (don't block server start)
  initDb().catch(err => {
    console.error('Database initialization failed:', err);
  });

  const bot = new Telegraf(token);

  // Webhook endpoint
  const webhookPath = `/webhook/${token}`;
  
  // GET handler for status check
  app.get(webhookPath, (req, res) => {
    res.send('✅ Webhook endpoint is active. Telegram should send POST requests here.');
  });

  // POST handler for Telegram updates
  app.post(webhookPath, (req, res) => {
    bot.handleUpdate(req.body, res);
  });

  if (appUrl) {
    bot.telegram.setWebhook(`${appUrl}${webhookPath}`).then(() => {
      console.log(`Webhook set to ${appUrl}${webhookPath}`);
    }).catch(err => {
      console.error('Failed to set webhook:', err);
    });
  } else {
    // Fallback to polling for local dev if no APP_URL
    bot.launch();
    console.log('Bot started with long polling');
  }

  // --- Bot Logic ---

  bot.start(async (ctx) => {
    const { id, username, first_name } = ctx.from;
    await dbService.upsertUser(id, username, first_name);
    ctx.reply('مرحباً بك! يمكنك إرسال رسالتك هنا وسيتم تحويلها للمسؤول للرد عليك.');
  });

  // Admin Commands
  bot.command('stats', isAdmin, async (ctx) => {
    const stats = await dbService.getStats();
    const message = `📊 *إحصائيات البوت:*
  
👥 إجمالي المستخدمين: ${stats.totalUsers}
💬 إجمالي الرسائل: ${stats.totalMessages}
🚫 المستخدمين المحظورين: ${stats.blockedUsers}`;
    
    await ctx.replyWithMarkdown(message);
  });

  bot.command('block', isAdmin, async (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) return ctx.reply('⚠️ يرجى إدخال معرف المستخدم. مثال: /block 123456');
    
    const targetId = parseInt(args[1]);
    await dbService.blockUser(targetId);
    ctx.reply(`✅ تم حظر المستخدم ${targetId} بنجاح.`);
  });

  bot.command('unblock', isAdmin, async (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) return ctx.reply('⚠️ يرجى إدخال معرف المستخدم. مثال: /unblock 123456');
    
    const targetId = parseInt(args[1]);
    await dbService.unblockUser(targetId);
    ctx.reply(`✅ تم إلغاء حظر المستخدم ${targetId} بنجاح.`);
  });

  bot.command('broadcast', isAdmin, async (ctx) => {
    const broadcastMsg = ctx.message.text.replace('/broadcast', '').trim();
    if (!broadcastMsg) return ctx.reply('⚠️ يرجى إدخال نص الرسالة المراد بثها.');
    
    const users = await dbService.getAllUsers();
    let successCount = 0;
    
    for (const user of users) {
      try {
        await bot.telegram.sendMessage(user.telegram_id, `📢 *رسالة جماعية من المسؤول:*\n\n${broadcastMsg}`, { parse_mode: 'Markdown' });
        successCount++;
      } catch (err) {
        console.error(`Failed to send broadcast to ${user.telegram_id}:`, err);
      }
    }
    
    ctx.reply(`✅ تم إرسال الرسالة إلى ${successCount} مستخدم.`);
  });

  // Handle incoming messages
  bot.on(message('text'), checkBlocked, async (ctx) => {
    const fromId = ctx.from.id;
    const isFromAdmin = fromId === adminId;

    // If admin is replying to a message
    if (isFromAdmin && (ctx.message as any).reply_to_message) {
      const replyToMsgId = (ctx.message as any).reply_to_message.message_id;
      const targetUserId = await dbService.getUserIdFromAdminMsg(replyToMsgId);

      if (targetUserId) {
        try {
          await bot.telegram.sendMessage(targetUserId, ctx.message.text);
          return ctx.reply('✅ تم إرسال ردك للمستخدم.');
        } catch (err) {
          return ctx.reply('❌ فشل إرسال الرد. قد يكون المستخدم قد قام بحظر البوت.');
        }
      }
    }

    // If it's a regular user sending a message
    if (!isFromAdmin) {
      const { username, first_name } = ctx.from;
      await dbService.upsertUser(fromId, username, first_name);

      // Forward to admin with formatting
      const adminMsg = `📩 *رسالة جديدة:*
👤 الاسم: ${first_name}
🆔 المعرف: \`${fromId}\`
🔗 اليوزر: ${username ? `@${username}` : 'لا يوجد'}

📝 المحتوى:
${ctx.message.text}`;

      try {
        const sentToAdmin = await bot.telegram.sendMessage(adminId, adminMsg, { parse_mode: 'Markdown' });
        
        // Save mapping for replies
        await dbService.saveAdminReplyMapping(sentToAdmin.message_id, fromId);
        await dbService.saveMessage(fromId, ctx.message.text, sentToAdmin.message_id);

        // Auto-reply to user
        await ctx.reply('تم استلام رسالتك وسيتم الرد عليك قريباً');
      } catch (err) {
        console.error('Error forwarding to admin:', err);
        await ctx.reply('عذراً، حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة لاحقاً.');
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
