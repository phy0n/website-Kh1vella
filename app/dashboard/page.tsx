"use client";

import { createClient } from "@/utils/supabase";
import { LogOut, LayoutDashboard, Send, Server, Power } from "lucide-react";
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
        setSendStatus({ type: "success", msg: "Message sent successfully." });
        setMessageContent("");
      } else {
        setSendStatus({ type: "error", msg: data.error || "Failed to send message." });
      }
    } catch (e) {
      setSendStatus({ type: "error", msg: "Bot API is unreachable." });
    }
    setIsSending(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex font-sans">
      <aside className="w-64 bg-black border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="font-bold text-xl tracking-wide">Kh1vella Admin</h2>
          <p className="text-xs text-zinc-500 mt-1">v2.0 Dashboard</p>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900 rounded cursor-pointer text-white">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </div>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900 rounded cursor-pointer text-zinc-400 hover:text-white transition-colors" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 bg-[#0a0a0a] border-b border-zinc-800 flex items-center justify-between px-8">
          <h1 className="text-2xl font-bold">System Overview</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{user?.user_metadata?.full_name}</span>
            <img src={user?.user_metadata?.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full" />
          </div>
        </header>
        <div className="p-8 flex flex-col gap-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black border border-zinc-800 p-6 rounded flex flex-col gap-4">
              <div className="flex items-center gap-3 text-zinc-400">
                <Server className="w-5 h-5" />
                <span className="font-semibold uppercase tracking-wider text-xs">Bot Status</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={clsx("w-3 h-3 rounded-full", botStatus === "Online" ? "bg-green-500" : "bg-red-500")} />
                <span className="text-3xl font-bold">{botStatus}</span>
              </div>
            </div>
            <div className="bg-black border border-zinc-800 p-6 rounded flex flex-col gap-4">
              <div className="flex items-center gap-3 text-zinc-400">
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-semibold uppercase tracking-wider text-xs">Total Members</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">{totalMembers}</span>
              </div>
            </div>
            <div className="bg-black border border-zinc-800 p-6 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-zinc-400">
                  <Power className="w-5 h-5" />
                  <span className="font-semibold uppercase tracking-wider text-xs">AI Chatbot</span>
                </div>
                <span className={clsx("text-xs font-bold px-2 py-1 rounded", isAiEnabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                  {isAiEnabled ? "ENABLED" : "DISABLED"}
                </span>
              </div>
              
              <button 
                onClick={toggleAi}
                disabled={botStatus === "Offline"}
                className="mt-4 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-medium py-2 rounded transition-colors cursor-pointer">
                Toggle AI
              </button>
            </div>
            
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-black border border-zinc-800 rounded flex flex-col">
              <div className="p-6 border-b border-zinc-800">
                <h3 className="font-bold text-lg">Connected Servers</h3>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {guilds.length > 0 ? guilds.map(guild => (
                  <div key={guild.id} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded">
                    <div className="flex flex-col">
                      <span className="font-bold">{guild.name}</span>
                      <span className="text-xs text-zinc-500">{guild.id}</span>
                    </div>
                    <span className="text-sm font-medium bg-zinc-800 px-3 py-1 rounded">
                      {guild.member_count} members
                    </span>
                  </div>
                )) : (
                  <p className="text-zinc-500 text-sm">No servers found. Make sure bot is online.</p>
                )}
              </div>
            </div>
            <div className="bg-black border border-zinc-800 rounded flex flex-col">
              <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
                <Send className="w-5 h-5" />
                <h3 className="font-bold text-lg">Send Message to Channel</h3>
              </div>
              <div className="p-6">
                <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-zinc-400">Channel ID</label>
                    <input 
                      type="text" 
                      value={messageTarget}
                      onChange={(e) => setMessageTarget(e.target.value)}
                      placeholder="e.g. 1234567890"
                      className="bg-zinc-900 border border-zinc-800 rounded p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-zinc-400">Message Content</label>
                    <textarea 
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Type your message here..."
                      rows={4}
                      className="bg-zinc-900 border border-zinc-800 rounded p-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    {sendStatus.type && (
                      <span className={clsx("text-sm", sendStatus.type === "success" ? "text-green-500" : "text-red-500")}>
                        {sendStatus.msg}
                      </span>
                    )}
                    <button 
                      type="submit"
                      disabled={isSending || botStatus === "Offline"}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2 rounded transition-colors ml-auto cursor-pointer">
                      {isSending ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
