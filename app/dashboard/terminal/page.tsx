"use client";

import { useState } from "react";
import { Send, TerminalSquare } from "lucide-react";
import clsx from "clsx";

export default function TerminalPage() {
  const [messageTarget, setMessageTarget] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{type: "success" | "error" | null, msg: string}>({type: null, msg: ""});
  const botApiUrl = process.env.NEXT_PUBLIC_BOT_API_URL || "http://localhost:8080";

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageTarget || !messageContent) return;
    
    setIsSending(true);
    setSendStatus({type: null, msg: ""});

    try {
      const response = await fetch(`${botApiUrl}/api/message/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_id: messageTarget,
          content: messageContent,
        }),
      });

      if (response.ok) {
        setSendStatus({type: "success", msg: "Payload delivered successfully."});
        setMessageContent("");
      } else {
        const errorText = await response.text();
        setSendStatus({type: "error", msg: `Transmission failed: ${errorText}`});
      }
    } catch (error: any) {
      setSendStatus({type: "error", msg: `Network Error: ${error.message}`});
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-red-600" />
        <h3 className="font-outfit font-semibold text-lg uppercase tracking-widest">Direct Comm Link</h3>
      </div>
      
      <div className="bg-[#0a0a0a] border border-white/5 p-8 flex flex-col flex-1 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
          <TerminalSquare className="w-12 h-12 text-zinc-800" />
          <div>
            <h4 className="font-outfit font-medium text-white text-lg">Execute Manual Payload</h4>
            <p className="text-sm font-inter text-zinc-500 mt-1 max-w-xl">
              Remotely command the core engine to transmit a message into any accessible Discord channel. Bypasses standard rate limits.
            </p>
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="flex flex-col gap-6 flex-1 max-w-3xl">
          <div className="flex flex-col gap-2 relative">
            <label className="text-xs font-inter text-zinc-500 uppercase tracking-widest">Target Channel ID</label>
            <input 
              type="text" 
              value={messageTarget}
              onChange={(e) => setMessageTarget(e.target.value)}
              placeholder="e.g. 123456789012345678"
              className="bg-transparent border border-white/10 p-4 rounded text-white font-mono text-sm focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-800"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2 flex-1 relative">
            <label className="text-xs font-inter text-zinc-500 uppercase tracking-widest">Payload Content</label>
            <textarea 
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Enter transmission..."
              className="bg-transparent border border-white/10 p-4 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors resize-none flex-1 min-h-[250px] placeholder:text-zinc-800"
              required
            />
          </div>
          
          <div className="flex items-center justify-between pt-4">
            {sendStatus.type && (
              <span className={clsx(
                "text-xs font-inter uppercase tracking-widest flex items-center gap-2",
                sendStatus.type === "success" ? "text-emerald-500" : "text-red-500"
              )}>
                <span className={clsx("w-2 h-2 rounded-full", sendStatus.type === "success" ? "bg-emerald-500" : "bg-red-500")} />
                {sendStatus.msg}
              </span>
            )}
            
            <button 
              type="submit"
              disabled={isSending}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded text-white font-outfit font-semibold uppercase tracking-widest text-xs px-8 py-4 transition-colors cursor-pointer flex items-center gap-2 ml-auto">
              <Send className="w-4 h-4" />
              {isSending ? "Transmitting..." : "Execute payload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
