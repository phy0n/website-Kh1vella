"use client";

import { useState } from "react";
import { ShieldAlert, Send } from "lucide-react";
import clsx from "clsx";

export default function RemoteModPage() {
  const [guildId, setGuildId] = useState("");
  const [userId, setUserId] = useState("");
  const [action, setAction] = useState("warn");
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState(10);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{type: "success" | "error" | null, msg: string}>({type: null, msg: ""});
  
  const botApiUrl = process.env.NEXT_PUBLIC_BOT_API_URL || "http://localhost:8080";

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guildId || !userId || !reason) return;
    
    setIsSending(true);
    setStatus({type: null, msg: ""});

    try {
      const response = await fetch(`${botApiUrl}/api/moderation/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guild_id: guildId,
          target_user_id: userId,
          moderator_id: "API_SYSTEM", 
          action: action,
          reason: reason,
          duration_minutes: action === "timeout" ? duration : null,
        }),
      });

      if (response.ok) {
        setStatus({type: "success", msg: "Action executed successfully."});
        setUserId("");
        setReason("");
      } else {
        const errorText = await response.text();
        setStatus({type: "error", msg: `Execution failed: ${errorText}`});
      }
    } catch (error: any) {
      setStatus({type: "error", msg: `Network Error: ${error.message}`});
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-[1200px]">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-red-600" />
        <h3 className="font-outfit font-semibold text-lg uppercase tracking-widest">Remote Enforcement</h3>
      </div>
      
      <div className="bg-[#0a0a0a] border border-white/5 p-8 flex flex-col flex-1 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
          <ShieldAlert className="w-12 h-12 text-zinc-800" />
          <div>
            <h4 className="font-outfit font-medium text-white text-lg">Execute Remote Action</h4>
            <p className="text-sm font-inter text-zinc-500 mt-1 max-w-xl">
              Force an immediate disciplinary action to the target entity through the API. This bypasses Discord permissions entirely and executes with bot priority.
            </p>
          </div>
        </div>

        <form onSubmit={handleAction} className="flex flex-col gap-6 flex-1 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-inter text-zinc-500 uppercase tracking-widest">Server (Guild) ID</label>
              <input 
                type="text" 
                value={guildId}
                onChange={(e) => setGuildId(e.target.value)}
                placeholder="e.g. 123456789012345678"
                className="bg-transparent border border-white/10 p-4 rounded text-white font-mono text-sm focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-inter text-zinc-500 uppercase tracking-widest">Target User ID</label>
              <input 
                type="text" 
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. 123456789012345678"
                className="bg-transparent border border-white/10 p-4 rounded text-white font-mono text-sm focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-inter text-zinc-500 uppercase tracking-widest">Action Type</label>
            <div className="flex flex-wrap gap-3">
              {["warn", "strike", "timeout", "kick", "ban"].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAction(a)}
                  className={clsx(
                    "px-6 py-3 rounded text-xs font-inter uppercase tracking-widest font-bold transition-all border border-white/5",
                    action === a ? "bg-red-600 text-white border-red-500" : "bg-white/5 text-zinc-400 hover:bg-white/10"
                  )}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {action === "timeout" && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-inter text-zinc-500 uppercase tracking-widest">Duration (Minutes)</label>
              <input 
                type="number" 
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="bg-transparent border border-white/10 p-4 rounded text-white font-mono text-sm focus:outline-none focus:border-red-500 transition-colors"
                min="1"
                required
              />
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-inter text-zinc-500 uppercase tracking-widest">Reason / Evidence</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Detailed reason for action..."
              className="bg-transparent border border-white/10 p-4 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors min-h-[120px] resize-none"
              required
            />
          </div>
          
          <div className="flex items-center justify-between pt-4">
            {status.type && (
              <span className={clsx(
                "text-xs font-inter uppercase tracking-widest flex items-center gap-2",
                status.type === "success" ? "text-emerald-500" : "text-red-500"
              )}>
                <span className={clsx("w-2 h-2 rounded-full", status.type === "success" ? "bg-emerald-500" : "bg-red-500")} />
                {status.msg}
              </span>
            )}
            
            <button 
              type="submit"
              disabled={isSending}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded text-white font-outfit font-semibold uppercase tracking-widest text-xs px-8 py-4 transition-colors cursor-pointer flex items-center gap-2 ml-auto">
              <Send className="w-4 h-4" />
              {isSending ? "Executing..." : `Execute ${action}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
