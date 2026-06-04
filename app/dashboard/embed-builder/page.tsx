"use client";

import { useState } from "react";
import { FolderOpen, Send, Palette, LayoutTemplate, AlertCircle } from "lucide-react";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function EmbedBuilderPage() {
  const [channelId, setChannelId] = useState("");
  const [embed, setEmbed] = useState({
    title: "",
    description: "",
    color: "#ef4444",
    image_url: "",
    thumbnail_url: "",
    author_name: "",
    author_icon: "",
    footer_text: "",
    footer_icon: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{type: "success" | "error" | null, msg: string}>({type: null, msg: ""});
  
  const botApiUrl = process.env.NEXT_PUBLIC_BOT_API_URL || "http://localhost:8080";

  const handleSendEmbed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelId) return;
    
    setIsSending(true);
    setStatus({type: null, msg: ""});

    try {
      const response = await fetch(`${botApiUrl}/api/message/embed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_id: channelId,
          ...embed,
          color: embed.color.replace("#", "")
        }),
      });

      if (response.ok) {
        setStatus({type: "success", msg: "Embed transmitted successfully."});
      } else {
        const errorText = await response.text();
        setStatus({type: "error", msg: `Transmission failed: ${errorText}`});
      }
    } catch (error: any) {
      setStatus({type: "error", msg: `Network Error: ${error.message}`});
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-600" />
          <h3 className="font-outfit font-semibold text-lg uppercase tracking-widest">Embed Studio</h3>
        </div>
        
        {!process.env.NEXT_PUBLIC_BOT_API_URL && (
          <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-4 py-2 rounded text-xs font-inter uppercase tracking-widest font-bold">
            <AlertCircle className="w-4 h-4" />
            <span>Warning: NEXT_PUBLIC_BOT_API_URL is missing. Network calls may fail.</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full">
        <div className="bg-[#0a0a0a] border border-white/5 rounded p-8 flex flex-col gap-8 h-fit">
          <div className="flex items-center gap-4 pb-6 border-b border-white/5">
            <Palette className="w-6 h-6 text-red-500" />
            <div>
              <h4 className="font-outfit text-white font-medium">Embed Configuration</h4>
              <p className="text-xs text-zinc-500 font-inter mt-1">Design and transmit rich messages to the network.</p>
            </div>
          </div>

          <form onSubmit={handleSendEmbed} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Target Channel ID *</label>
              <input 
                type="text" 
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder="Required"
                className="bg-transparent border border-white/10 p-3 rounded text-white font-mono text-sm focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Title</label>
                <input 
                  type="text" 
                  value={embed.title}
                  onChange={(e) => setEmbed({...embed, title: e.target.value})}
                  className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Theme Color</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={embed.color}
                    onChange={(e) => setEmbed({...embed, color: e.target.value})}
                    className="h-11 w-11 bg-transparent rounded cursor-pointer border border-white/10 p-1"
                  />
                  <input 
                    type="text" 
                    value={embed.color}
                    onChange={(e) => setEmbed({...embed, color: e.target.value})}
                    className="bg-transparent border border-white/10 p-3 rounded text-white font-mono text-sm focus:outline-none focus:border-red-500 transition-colors flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Description (Markdown Supported)</label>
              <textarea 
                value={embed.description}
                onChange={(e) => setEmbed({...embed, description: e.target.value})}
                className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors min-h-[150px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Author Name</label>
                <input 
                  type="text" 
                  value={embed.author_name}
                  onChange={(e) => setEmbed({...embed, author_name: e.target.value})}
                  className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Author Icon URL</label>
                <input 
                  type="text" 
                  value={embed.author_icon}
                  onChange={(e) => setEmbed({...embed, author_icon: e.target.value})}
                  className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Image URL</label>
                <input 
                  type="text" 
                  value={embed.image_url}
                  onChange={(e) => setEmbed({...embed, image_url: e.target.value})}
                  className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Thumbnail URL</label>
                <input 
                  type="text" 
                  value={embed.thumbnail_url}
                  onChange={(e) => setEmbed({...embed, thumbnail_url: e.target.value})}
                  className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Footer Text</label>
                <input 
                  type="text" 
                  value={embed.footer_text}
                  onChange={(e) => setEmbed({...embed, footer_text: e.target.value})}
                  className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Footer Icon URL</label>
                <input 
                  type="text" 
                  value={embed.footer_icon}
                  onChange={(e) => setEmbed({...embed, footer_icon: e.target.value})}
                  className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-2">
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
                {isSending ? "Transmitting..." : "Send Embed"}
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-zinc-500">
            <LayoutTemplate className="w-5 h-5" />
            <h4 className="font-outfit uppercase tracking-widest text-xs font-bold">Live Preview</h4>
          </div>
          
          <div className="bg-[#313338] rounded flex flex-col p-4 w-full max-w-full">
            <div className="flex flex-col border-l-4 rounded bg-[#2b2d31] p-4 gap-2" style={{ borderColor: embed.color || "#1e1f22" }}>
              {(embed.author_name || embed.author_icon) && (
                <div className="flex items-center gap-2 mb-1">
                  {embed.author_icon && <img src={embed.author_icon} alt="author" className="w-6 h-6 rounded-full" />}
                  {embed.author_name && <span className="text-white text-sm font-semibold">{embed.author_name}</span>}
                </div>
              )}
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  {embed.title && <span className="text-[#00A8FC] font-semibold text-base">{embed.title}</span>}
                  {embed.description && (
                    <div className="text-zinc-300 text-sm discord-markdown">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {embed.description}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                {embed.thumbnail_url && (
                  <div className="shrink-0">
                    <img src={embed.thumbnail_url} alt="thumbnail" className="w-20 rounded" />
                  </div>
                )}
              </div>
              {embed.image_url && (
                <div className="mt-2 rounded overflow-hidden w-full max-w-full">
                  <img src={embed.image_url} alt="embed" className="w-full object-cover" />
                </div>
              )}
              {(embed.footer_text || embed.footer_icon) && (
                <div className="flex items-center gap-2 mt-2 pt-2 text-xs text-zinc-400 font-medium">
                  {embed.footer_icon && <img src={embed.footer_icon} alt="footer" className="w-5 h-5 rounded-full" />}
                  {embed.footer_text && <span>{embed.footer_text}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
