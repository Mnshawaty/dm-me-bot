import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool with serverless-friendly settings
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 5, // Reduced for serverless
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
  // Timeout settings for serverless
  connectTimeout: 10000,
  acquireTimeout: 10000,
  idleTimeout: 30000
});

// Initialize tables (SQL for MySQL)
export const initDb = async () => {
  console.log('Initializing MySQL connection...');
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connection established successfully');
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          telegram_id BIGINT PRIMARY KEY,
          username VARCHAR(255),
          first_name VARCHAR(255),
          blocked TINYINT(1) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id BIGINT,
          message_text TEXT,
          reply_text TEXT,
          admin_msg_id BIGINT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX (user_id),
          INDEX (admin_msg_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS admin_replies (
          admin_msg_id BIGINT PRIMARY KEY,
          user_id BIGINT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      console.log('MySQL Tables initialized');
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Error initializing MySQL tables:', err);
    throw err;
  }
};

export interface User {
  telegram_id: number;
  username?: string;
  first_name: string;
  blocked: number;
  created_at: string;
}

export const dbService = {
  // User operations
  upsertUser: async (telegram_id: number, username?: string, first_name?: string) => {
    const sql = `
      INSERT INTO users (telegram_id, username, first_name)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        username = VALUES(username),
        first_name = VALUES(first_name)
    `;
    try {
      return await pool.execute(sql, [telegram_id, username, first_name]);
    } catch (err) {
      console.error('Error in upsertUser:', err);
      throw err;
    }
  },

  getUser: async (telegram_id: number): Promise<User | undefined> => {
    try {
      const [rows] = await pool.execute('SELECT * FROM users WHERE telegram_id = ?', [telegram_id]);
      return (rows as User[])[0];
    } catch (err) {
      console.error('Error in getUser:', err);
      throw err;
    }
  },

  blockUser: async (telegram_id: number) => {
    try {
      return await pool.execute('UPDATE users SET blocked = 1 WHERE telegram_id = ?', [telegram_id]);
    } catch (err) {
      console.error('Error in blockUser:', err);
      throw err;
    }
  },

  unblockUser: async (telegram_id: number) => {
    try {
      return await pool.execute('UPDATE users SET blocked = 0 WHERE telegram_id = ?', [telegram_id]);
    } catch (err) {
      console.error('Error in unblockUser:', err);
      throw err;
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      const [rows] = await pool.execute('SELECT * FROM users');
      return rows as User[];
    } catch (err) {
      console.error('Error in getAllUsers:', err);
      throw err;
    }
  },

  // Message operations
  saveMessage: async (user_id: number, message_text: string, admin_msg_id: number) => {
    const sql = `
      INSERT INTO messages (user_id, message_text, admin_msg_id)
      VALUES (?, ?, ?)
    `;
    try {
      return await pool.execute(sql, [user_id, message_text, admin_msg_id]);
    } catch (err) {
      console.error('Error in saveMessage:', err);
      throw err;
    }
  },

  saveAdminReplyMapping: async (admin_msg_id: number, user_id: number) => {
    const sql = `
      INSERT INTO admin_replies (admin_msg_id, user_id)
      VALUES (?, ?)
    `;
    try {
      return await pool.execute(sql, [admin_msg_id, user_id]);
    } catch (err) {
      console.error('Error in saveAdminReplyMapping:', err);
      throw err;
    }
  },

  getUserIdFromAdminMsg: async (admin_msg_id: number): Promise<number | undefined> => {
    try {
      const [rows] = await pool.execute('SELECT user_id FROM admin_replies WHERE admin_msg_id = ?', [admin_msg_id]);
      const result = (rows as { user_id: number }[])[0];
      return result?.user_id;
    } catch (err) {
      console.error('Error in getUserIdFromAdminMsg:', err);
      throw err;
    }
  },

  getStats: async () => {
    try {
      const [[totalUsers]] = await pool.execute('SELECT COUNT(*) as count FROM users') as any;
      const [[totalMessages]] = await pool.execute('SELECT COUNT(*) as count FROM messages') as any;
      const [[blockedUsers]] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE blocked = 1') as any;
      return {
        totalUsers: totalUsers.count,
        totalMessages: totalMessages.count,
        blockedUsers: blockedUsers.count
      };
    } catch (err) {
      console.error('Error in getStats:', err);
      throw err;
    }
  }
};
