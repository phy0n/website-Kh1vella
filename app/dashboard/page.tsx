"use client";

import { createClient } from "@/utils/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Power, LogOut, Cpu, Send, Server, TerminalSquare, AlertCircle, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface GuildInfo {
  id: string;
  name: string;
  member_count: number;
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
          setBotStatus("Online");
        } else {
          setBotStatus("Offline");
        }
      } catch (error) {
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const commandsList = [
    { cmd: "/play", desc: "Start audio stream" },
    { cmd: "/skip", desc: "Skip current track" },
    { cmd: "/kick", desc: "Remove target entity" },
    { cmd: "/ban", desc: "Permanent exile" },
    { cmd: "/purge", desc: "Mass delete messages" },
    { cmd: "/chatbot", desc: "Toggle AI systems" }
  ];

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-red-600/30 selection:text-white pb-20">
      <nav className="fixed top-0 w-full border-b border-red-900/30 bg-black/50 backdrop-blur-xl z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600/10 border border-red-500/20 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="font-outfit font-bold text-2xl leading-none tracking-tight">Kh1vella</h2>
              <span className="text-[10px] text-red-500 font-inter uppercase tracking-[0.2em]">Restricted Access</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-outfit font-semibold">{user?.user_metadata?.full_name}</p>
                <p className="text-[10px] text-zinc-500 font-inter uppercase tracking-widest">Root Admin</p>
              </div>
              <img src={user?.user_metadata?.avatar_url} alt="Profile" className="w-10 h-10 grayscale hover:grayscale-0 transition-all border border-red-500/20" />
            </div>
            <div className="w-px h-8 bg-white/10 hidden md:block" />
            <button onClick={handleLogout} className="text-zinc-500 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
      <div className="max-w-[1400px] mx-auto px-6 pt-32">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-outfit font-bold tracking-tighter leading-[0.9]">
                CORE <br/>
                <span className="text-red-600 italic">DASHBOARD</span>
              </h1>
              <p className="text-zinc-400 font-inter mt-6 max-w-xl text-lg">
                Real-time monitoring and direct interaction protocol for the Kh1vella Discord infrastructure.
              </p>
            </div>
            <div className="relative pt-8">
              <div className="absolute top-0 left-0 w-32 h-1 bg-red-600" />
              <div className="flex items-center gap-3 mb-6">
                <Send className="w-5 h-5 text-red-500" />
                <h3 className="font-outfit font-bold text-2xl uppercase tracking-widest">Direct Push</h3>
              </div>
              
              <form onSubmit={handleSendMessage} className="flex flex-col gap-4 max-w-2xl">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-inter uppercase tracking-widest text-zinc-500">Target Channel ID</label>
                  <input 
                    type="text" 
                    value={messageTarget}
                    onChange={(e) => setMessageTarget(e.target.value)}
                    placeholder="e.g. 123456789012345678"
                    className="bg-transparent border-b border-zinc-800 focus:border-red-500 px-0 py-3 text-white font-inter outline-none transition-colors placeholder:text-zinc-700"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <label className="text-xs font-inter uppercase tracking-widest text-zinc-500">Payload Content</label>
                  <textarea 
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Enter message..."
                    rows={3}
                    className="bg-transparent border-b border-zinc-800 focus:border-red-500 px-0 py-3 text-white font-inter outline-none transition-colors resize-none placeholder:text-zinc-700"
                    required
                  />
                </div>
                
                <div className="flex items-center gap-6 mt-4">
                  <button 
                    type="submit"
                    disabled={isSending || botStatus === "Offline"}
                    className="bg-red-600 text-white font-outfit font-semibold px-8 py-3 uppercase tracking-widest text-sm hover:bg-red-500 disabled:opacity-50 transition-colors flex items-center gap-2">
                    {isSending ? "Transmitting..." : "Push Payload"}
                  </button>
                  
                  {sendStatus.type && (
                    <span className={clsx("text-sm font-inter", sendStatus.type === "success" ? "text-emerald-500" : "text-red-500")}>
                      {sendStatus.msg}
                    </span>
                  )}
                </div>
              </form>
            </div>
            <div className="relative pt-8">
              <div className="absolute top-0 left-0 w-32 h-1 bg-zinc-800" />
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-red-500" />
                  <h3 className="font-outfit font-bold text-2xl uppercase tracking-widest">Network Nodes</h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-outfit font-bold text-white leading-none">{totalMembers}</p>
                  <span className="text-[10px] text-zinc-500 font-inter uppercase tracking-widest">Total Entities</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {guilds.length > 0 ? guilds.map(guild => (
                  <div key={guild.id} className="flex items-center justify-between py-3 border-b border-white/5 group">
                    <div>
                      <h4 className="font-outfit font-semibold text-lg group-hover:text-red-400 transition-colors">{guild.name}</h4>
                      <p className="text-xs text-zinc-500 font-mono mt-1">{guild.id}</p>
                    </div>
                    <span className="bg-red-500/10 text-red-500 px-3 py-1 text-xs font-semibold rounded-full font-inter">
                      {guild.member_count} mem
                    </span>
                  </div>
                )) : (
                  <p className="text-zinc-600 italic text-sm">No connected nodes detected.</p>
                )}
              </div>
            </div>

          </div>
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-8">
            <div className="bg-red-600 p-8 relative overflow-hidden">
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-black/20 blur-[40px] rounded-full pointer-events-none" />
              
              <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="flex items-center gap-2 text-black/50 uppercase tracking-widest text-[10px] font-bold">
                  <Activity className="w-4 h-4" />
                  <span>Main Cluster</span>
                </div>
                <div className={clsx(
                  "px-3 py-1 text-[10px] font-bold font-inter uppercase tracking-widest flex items-center gap-2",
                  botStatus === "Online" ? "bg-black/20 text-white" : "bg-black/50 text-red-200"
                )}>
                  <span className={clsx("w-1.5 h-1.5 rounded-full", botStatus === "Online" ? "bg-emerald-400" : "bg-red-900")} />
                  {botStatus}
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-4xl font-outfit font-black text-black leading-none mb-2 tracking-tighter">
                  {isAiEnabled ? "AI ACTIVE" : "AI HALTED"}
                </h3>
                <p className="text-white/90 font-inter text-sm mb-8">
                  Generative language model engine is currently {isAiEnabled ? "processing input streams" : "suspended"}.
                </p>
                
                <button 
                  onClick={toggleAi}
                  disabled={botStatus === "Offline"}
                  className={clsx(
                    "w-full h-16 flex items-center justify-center gap-3 font-outfit font-bold text-lg uppercase tracking-widest transition-all",
                    isAiEnabled ? "bg-black text-white hover:bg-zinc-900" : "bg-red-900 text-white hover:bg-black"
                  )}>
                  <Power className="w-5 h-5" />
                  <span>Toggle Engine</span>
                </button>
              </div>
            </div>

            <div className="p-8 border border-zinc-900 bg-zinc-950/50">
              <div className="flex items-center gap-3 mb-6">
                <TerminalSquare className="w-5 h-5 text-zinc-500" />
                <h3 className="font-outfit font-bold text-lg uppercase tracking-widest text-zinc-400">Registry</h3>
              </div>
              
              <div className="flex flex-col gap-4">
                {commandsList.map(item => (
                  <div key={item.cmd} className="flex flex-col">
                    <span className="font-mono text-red-500 text-sm font-bold">{item.cmd}</span>
                    <span className="font-inter text-zinc-500 text-xs">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </main>
  );
}
