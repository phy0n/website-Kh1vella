"use client";

import { createClient } from "@/utils/supabase";
import { LogOut, LayoutDashboard, Send, Server, Power, Activity, TerminalSquare, ShieldAlert, Cpu, HardDrive, Clock, Activity as PingIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";

interface GuildInfo {
  id: string;
  name: string;
  member_count: number;
}

interface SystemInfo {
  uptime_seconds: number;
  ram_used_mb: number;
  ram_total_mb: number;
  cpu_cores: number;
  os_name: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const [botStatus, setBotStatus] = useState("Offline");
  const [guilds, setGuilds] = useState<GuildInfo[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  
  const [activeTab, setActiveTab] = useState("Overview");

  const [messageTarget, setMessageTarget] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{type: "success"|"error"|null, msg: string}>({type: null, msg: ""});

  const BOT_API_URL = process.env.NEXT_PUBLIC_BOT_API_URL || "http://localhost:8080";

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        return;
      }
      
      if (session.user.user_metadata.provider_id !== "494169184175915019") {
        alert("ACCESS DENIED: Unauthorized Identity.");
        await supabase.auth.signOut();
        router.push("/");
        return;
      }
      setUser(session.user);
      
      try {
        const res = await fetch(`${BOT_API_URL}/api/status`);
        if (res.ok) {
          const data = await res.json();
          setIsAiEnabled(data.chatbot_enabled);
          setGuilds(data.guilds);
          setTotalMembers(data.total_members);
          setSystemInfo(data.system);
          setBotStatus("Online");
        } else {
          setBotStatus("Offline");
        }
      } catch (error) {
        console.error("Failed to fetch bot status:", error);
        setBotStatus("Offline");
      }
      
      setIsLoading(false);
    };
    checkUser();
  }, [router, BOT_API_URL]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const toggleAi = async () => {
    const newState = !isAiEnabled;
    setIsAiEnabled(newState);
    
    try {
      const res = await fetch(`${BOT_API_URL}/api/chatbot/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newState }),
      });
      if (!res.ok) {
        setIsAiEnabled(!newState);
        alert("Failed to communicate with the bot server.");
      }
    } catch (e) {
      setIsAiEnabled(!newState);
      alert("Bot API is unreachable. Make sure the bot is running.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageTarget || !messageContent) return;
    
    setIsSending(true);
    setSendStatus({ type: null, msg: "" });

    try {
      const res = await fetch(`${BOT_API_URL}/api/message/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel_id: messageTarget, content: messageContent }),
      });
      
      const data = await res.json();
      if (data.success) {
        setSendStatus({ type: "success", msg: "Transmission successful." });
        setMessageContent("");
      } else {
        setSendStatus({ type: "error", msg: data.error || "Transmission failed." });
      }
    } catch (e) {
      setSendStatus({ type: "error", msg: "API Unreachable." });
    }
    setIsSending(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Activity", icon: Activity },
    { name: "Terminal", icon: TerminalSquare },
  ];

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[1600px] mx-auto gap-10">
            {activeTab === "Overview" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="bg-[#0a0a0a] border border-white/5 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Server className="w-16 h-16" />
                    </div>
                    <p className="text-xs font-inter text-zinc-500 uppercase tracking-widest mb-4">Core Engine</p>
                    <div className="flex items-end gap-3">
                      <span className={clsx("w-2.5 h-2.5 rounded-full mb-2", botStatus === "Online" ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-red-500 shadow-[0_0_10px_#ef4444]")} />
                      <span className="text-3xl font-outfit font-bold tracking-tight">{botStatus}</span>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] border border-white/5 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Activity className="w-16 h-16" />
                    </div>
                    <p className="text-xs font-inter text-zinc-500 uppercase tracking-widest mb-4">Connected Nodes</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-outfit font-bold tracking-tight">{guilds.length}</span>
                      <span className="text-sm font-inter text-zinc-500 mb-1">servers</span>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] border border-white/5 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <TerminalSquare className="w-16 h-16" />
                    </div>
                    <p className="text-xs font-inter text-zinc-500 uppercase tracking-widest mb-4">Total Entities</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-outfit font-bold tracking-tight">{totalMembers}</span>
                      <span className="text-sm font-inter text-zinc-500 mb-1">users</span>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] border border-white/5 p-6 flex flex-col justify-between group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-600/20" />
                    {isAiEnabled && <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />}
                    
                    <div className="flex items-center justify-between z-10">
                      <p className="text-xs font-inter text-zinc-500 uppercase tracking-widest">Generative AI</p>
                      <span className={clsx(
                        "text-[10px] font-bold px-2 py-1 uppercase tracking-widest border",
                        isAiEnabled ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-white/5 text-zinc-500 border-white/5"
                      )}>
                        {isAiEnabled ? "Active" : "Halted"}
                      </span>
                    </div>
                    
                    <button 
                      onClick={toggleAi}
                      disabled={botStatus === "Offline"}
                      className="w-full bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white font-outfit text-sm font-medium py-3 transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4 z-10">
                      <Power className="w-4 h-4" />
                      Toggle Subsystem
                    </button>
                  </div>
                  
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                  <div className="xl:col-span-12 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-2 bg-red-600" />
                      <h3 className="font-outfit font-semibold text-lg uppercase tracking-widest">Network Topology</h3>
                    </div>
                    
                    <div className="bg-[#0a0a0a] border border-white/5 flex flex-col flex-1">
                      <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/5">
                        <div className="col-span-6 font-inter text-xs text-zinc-500 uppercase tracking-widest">Node Name</div>
                        <div className="col-span-4 font-inter text-xs text-zinc-500 uppercase tracking-widest">Identifier ID</div>
                        <div className="col-span-2 font-inter text-xs text-zinc-500 uppercase tracking-widest text-right">Entities</div>
                      </div>
                      <div className="flex flex-col">
                        {guilds.length > 0 ? guilds.map(guild => (
                          <div key={guild.id} className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center group">
                            <div className="col-span-6 font-outfit font-medium text-white group-hover:text-red-400 transition-colors truncate">
                              {guild.name}
                            </div>
                            <div className="col-span-4 font-mono text-sm text-zinc-500 truncate">
                              {guild.id}
                            </div>
                            <div className="col-span-2 text-right">
                              <span className="inline-block bg-white/5 px-3 py-1 text-xs font-inter text-zinc-300">
                                {guild.member_count}
                              </span>
                            </div>
                          </div>
                        )) : (
                          <div className="p-8 text-center text-zinc-600 font-inter text-sm italic">
                            No active nodes detected on the network.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Activity" && systemInfo && (
              <div className="flex flex-col gap-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="bg-[#0a0a0a] border border-white/5 p-6 relative overflow-hidden">
                    <div className="flex items-center gap-3 text-zinc-500 mb-6">
                      <Clock className="w-5 h-5" />
                      <h4 className="font-inter text-xs uppercase tracking-widest font-semibold">Uptime</h4>
                    </div>
                    <div className="text-3xl font-outfit font-bold text-white tracking-tight">
                      {formatUptime(systemInfo.uptime_seconds)}
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] border border-white/5 p-6 relative overflow-hidden">
                    <div className="flex items-center gap-3 text-zinc-500 mb-6">
                      <Cpu className="w-5 h-5" />
                      <h4 className="font-inter text-xs uppercase tracking-widest font-semibold">CPU Cores</h4>
                    </div>
                    <div className="text-3xl font-outfit font-bold text-white tracking-tight">
                      {systemInfo.cpu_cores}
                    </div>
                    <p className="text-xs text-zinc-500 font-inter mt-2">Logical Processors</p>
                  </div>

                  <div className="bg-[#0a0a0a] border border-white/5 p-6 relative overflow-hidden">
                    <div className="flex items-center gap-3 text-zinc-500 mb-6">
                      <HardDrive className="w-5 h-5" />
                      <h4 className="font-inter text-xs uppercase tracking-widest font-semibold">RAM Usage</h4>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-outfit font-bold text-white tracking-tight">{systemInfo.ram_used_mb}</span>
                      <span className="text-sm font-inter text-zinc-500 mb-1">/ {systemInfo.ram_total_mb} MB</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 mt-4">
                      <div 
                        className="h-full bg-red-600" 
                        style={{ width: `${Math.min((systemInfo.ram_used_mb / systemInfo.ram_total_mb) * 100, 100)}%` }} 
                      />
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] border border-white/5 p-6 relative overflow-hidden">
                    <div className="flex items-center gap-3 text-zinc-500 mb-6">
                      <Server className="w-5 h-5" />
                      <h4 className="font-inter text-xs uppercase tracking-widest font-semibold">OS Environment</h4>
                    </div>
                    <div className="text-xl font-outfit font-bold text-white tracking-tight">
                      {systemInfo.os_name}
                    </div>
                    <p className="text-xs text-zinc-500 font-inter mt-2">Host Machine</p>
                  </div>

                </div>
              </div>
            )}

    </div>
  );
}
