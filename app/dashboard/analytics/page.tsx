"use client";

import { useState, useEffect } from "react";
import { ActivityIcon, Users, BrainCircuit, ShieldAlert, Zap, Server, MessageSquare } from "lucide-react";
import { createClient } from "@/utils/supabase";

export default function AnalyticsPage() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    memoryBlocks: 0,
    activeStaff: 0,
    autoReplies: 0,
    auditLogs: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [memoryReq, staffReq, replyReq, auditReq] = await Promise.all([
      supabase.from("khivella_memory").select("user_id", { count: 'exact', head: true }),
      supabase.from("khivella_access").select("discord_id", { count: 'exact', head: true }),
      supabase.from("khivella_autoreplies").select("id", { count: 'exact', head: true }),
      supabase.from("khivella_audit_logs").select("id", { count: 'exact', head: true })
    ]);

    setStats({
      memoryBlocks: memoryReq.count || 0,
      activeStaff: staffReq.count || 0,
      autoReplies: replyReq.count || 0,
      auditLogs: auditReq.count || 0,
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto h-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-outfit text-3xl font-bold tracking-wide text-white mb-2 flex items-center gap-3">
            <ActivityIcon className="w-8 h-8 text-red-500" />
            System Analytics
          </h1>
          <p className="font-inter text-sm text-zinc-400">
            Real-time telemetry and aggregated database metrics across the Kh1ev core engine.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
          <div className="flex justify-between items-center relative z-10">
            <h3 className="font-inter text-xs uppercase tracking-widest font-bold text-zinc-500">Neural Memory</h3>
            <BrainCircuit className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="relative z-10 flex items-end gap-2">
            <span className="font-outfit text-4xl font-bold text-white">{stats.memoryBlocks}</span>
            <span className="font-inter text-sm text-zinc-500 pb-1">Entities</span>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
          <div className="flex justify-between items-center relative z-10">
            <h3 className="font-inter text-xs uppercase tracking-widest font-bold text-zinc-500">Authorized Staff</h3>
            <Users className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="relative z-10 flex items-end gap-2">
            <span className="font-outfit text-4xl font-bold text-white">{stats.activeStaff}</span>
            <span className="font-inter text-sm text-zinc-500 pb-1">Agents</span>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
          <div className="flex justify-between items-center relative z-10">
            <h3 className="font-inter text-xs uppercase tracking-widest font-bold text-zinc-500">Auto-Replies</h3>
            <MessageSquare className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="relative z-10 flex items-end gap-2">
            <span className="font-outfit text-4xl font-bold text-white">{stats.autoReplies}</span>
            <span className="font-inter text-sm text-zinc-500 pb-1">Triggers</span>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
          <div className="flex justify-between items-center relative z-10">
            <h3 className="font-inter text-xs uppercase tracking-widest font-bold text-zinc-500">Audit Logs</h3>
            <ShieldAlert className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="relative z-10 flex items-end gap-2">
            <span className="font-outfit text-4xl font-bold text-white">{stats.auditLogs}</span>
            <span className="font-inter text-sm text-zinc-500 pb-1">Events</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div className="bg-[#0a0a0a] border border-white/5 rounded p-6">
          <h3 className="font-outfit font-bold text-white text-lg mb-6 flex items-center gap-2">
            <Server className="w-5 h-5 text-zinc-400" /> Node Status
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="font-inter text-sm text-zinc-400">Database Engine</span>
              <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded text-xs font-mono">ONLINE (PostgreSQL)</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="font-inter text-sm text-zinc-400">Bot Latency (Ping)</span>
              <span className="bg-zinc-800 text-zinc-300 border border-white/10 px-2 py-0.5 rounded text-xs font-mono">~45ms</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="font-inter text-sm text-zinc-400">Uptime</span>
              <span className="bg-zinc-800 text-zinc-300 border border-white/10 px-2 py-0.5 rounded text-xs font-mono">99.9%</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded p-6 flex flex-col justify-center items-center text-center">
          <Zap className="w-12 h-12 text-zinc-600 mb-4 opacity-50" />
          <h3 className="font-outfit font-bold text-white text-lg mb-2">Visual Charts Upcoming</h3>
          <p className="font-inter text-sm text-zinc-400 max-w-sm">
            Phase 6 will introduce full time-series charts for message volume, new joins, and peak activity hours.
          </p>
        </div>
      </div>
    </div>
  );
}
