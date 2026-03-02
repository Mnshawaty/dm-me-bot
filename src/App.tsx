import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Users, MessageSquare, ShieldAlert, CheckCircle2, Activity } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalMessages: number;
  blockedUsers: number;
}

export default function App() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const contentType = response.headers.get('content-type');
        if (!response.ok || !contentType?.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON response received:', text.substring(0, 100));
          return;
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 lg:py-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <Bot className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                Android TV Admin Bot
              </h1>
            </div>
            <p className="text-zinc-400 text-lg max-w-xl">
              نظام إدارة الرسائل الخاص. البوت يعمل حالياً ويقوم بتحويل الرسائل للمسؤول بشكل آمن.
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 font-medium text-sm uppercase tracking-wider">Active & Online</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            icon={<Users className="w-6 h-6 text-blue-400" />}
            label="إجمالي المستخدمين"
            value={loading ? '...' : stats?.totalUsers || 0}
            delay={0.1}
          />
          <StatCard 
            icon={<MessageSquare className="w-6 h-6 text-purple-400" />}
            label="إجمالي الرسائل"
            value={loading ? '...' : stats?.totalMessages || 0}
            delay={0.2}
          />
          <StatCard 
            icon={<ShieldAlert className="w-6 h-6 text-red-400" />}
            label="المستخدمين المحظورين"
            value={loading ? '...' : stats?.blockedUsers || 0}
            delay={0.3}
          />
        </div>

        {/* Status Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <Activity className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-semibold">حالة النظام</h2>
          </div>

          <div className="space-y-6">
            <StatusItem 
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              label="اتصال Telegram API"
              status="متصل"
            />
            <StatusItem 
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              label="قاعدة البيانات (MySQL)"
              status="جاهزة"
            />
            <StatusItem 
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              label="نظام الرد التلقائي"
              status="مفعل"
            />
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-white/5 text-center text-zinc-500 text-sm">
          <p>© {new Date().getFullYear()} Android TV Admin Bot. All systems operational.</p>
        </footer>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, delay }: { icon: any, label: string, value: string | number, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl hover:border-white/10 transition-colors"
    >
      <div className="mb-4">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-zinc-500 text-sm font-medium">{label}</div>
    </motion.div>
  );
}

function StatusItem({ icon, label, status }: { icon: any, label: string, status: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium text-zinc-300">{label}</span>
      </div>
      <span className="text-emerald-400 font-semibold text-sm">{status}</span>
    </div>
  );
}
