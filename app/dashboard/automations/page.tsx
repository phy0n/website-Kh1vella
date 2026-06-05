"use client";

import { useState, useEffect } from "react";
import { Zap, MessageSquare, Pin, Search, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase";

type AutoReply = {
  id: number;
  trigger: string;
  response: string | null;
  media_url: string | null;
};

type StickyMessage = {
  channel_id: string;
  message: string;
};

export default function AutomationsPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<"autoreplies" | "sticky">("autoreplies");
  const [autoReplies, setAutoReplies] = useState<AutoReply[]>([]);
  const [stickyMessages, setStickyMessages] = useState<StickyMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    setLoading(true);
    const [repliesReq, stickyReq] = await Promise.all([
      supabase.from("khivella_autoreplies").select("*"),
      supabase.from("khivella_sticky").select("*")
    ]);

    if (!repliesReq.error && repliesReq.data) setAutoReplies(repliesReq.data);
    if (!stickyReq.error && stickyReq.data) setStickyMessages(stickyReq.data);
    setLoading(false);
  };

  const handleDeleteReply = async (id: number) => {
    if (!confirm("Are you sure you want to delete this auto-reply trigger?")) return;
    await supabase.from("khivella_autoreplies").delete().eq("id", id);
    fetchAutomations();
  };

  const handleDeleteSticky = async (channelId: string) => {
    if (!confirm("Are you sure you want to unpin this sticky message?")) return;
    await supabase.from("khivella_sticky").delete().eq("channel_id", channelId);
    fetchAutomations();
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-red-600" />
        <h3 className="font-outfit font-semibold text-lg uppercase tracking-widest">System Automations</h3>
      </div>

      <div className="flex border-b border-white/5">
        <button 
          onClick={() => setActiveTab("autoreplies")}
          className={`px-8 py-4 font-outfit uppercase tracking-widest text-xs font-semibold transition-colors border-b-2 ${activeTab === "autoreplies" ? "border-red-500 text-white" : "border-transparent text-zinc-500 hover:text-white"}`}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Auto-Replies
          </div>
        </button>
        <button 
          onClick={() => setActiveTab("sticky")}
          className={`px-8 py-4 font-outfit uppercase tracking-widest text-xs font-semibold transition-colors border-b-2 ${activeTab === "sticky" ? "border-red-500 text-white" : "border-transparent text-zinc-500 hover:text-white"}`}
        >
          <div className="flex items-center gap-2">
            <Pin className="w-4 h-4" /> Sticky Messages
          </div>
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 flex flex-col flex-1 relative overflow-hidden min-h-[500px]">
        {activeTab === "autoreplies" && (
          <div className="flex-1 flex flex-col">
            <div className="p-8 border-b border-white/5 bg-[#050505] flex justify-between items-center">
              <div>
                <h4 className="font-outfit font-medium text-white text-lg uppercase tracking-widest">Keyword Triggers</h4>
                <p className="text-sm font-inter text-zinc-500 mt-1">
                  Manage words that trigger automatic bot responses.
                </p>
              </div>
              <div className="bg-black border border-white/10 rounded px-4 py-2 flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs font-mono text-zinc-400">{autoReplies.length} Active Triggers</span>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#0a0a0a]">
              {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-sm font-inter uppercase tracking-widest">Loading triggers...</span>
                </div>
              ) : autoReplies.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-3 p-10 text-center">
                  <span className="text-sm font-inter">No auto-replies configured.</span>
                </div>
              ) : (
                <div className="w-full">
                  <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-zinc-500 bg-[#050505] sticky top-0 z-10">
                    <div className="col-span-3">Trigger Keyword</div>
                    <div className="col-span-8">Response Content</div>
                    <div className="col-span-1 text-right">Action</div>
                  </div>
                  {autoReplies.map((r) => (
                    <div key={r.id} className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 text-sm items-start hover:bg-white/[0.02] transition-colors group">
                      <div className="col-span-3 font-mono text-zinc-300 bg-black px-3 py-1.5 rounded w-fit text-xs border border-white/5">"{r.trigger}"</div>
                      <div className="col-span-8 font-inter text-zinc-400">
                        {r.response && <div className="mb-2 tracking-wide leading-relaxed">{r.response}</div>}
                        {r.media_url && <a href={r.media_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline text-xs">View Attached Media</a>}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button 
                          onClick={() => handleDeleteReply(r.id)}
                          className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 p-2 rounded transition-all opacity-0 group-hover:opacity-100"
                          title="Delete Trigger"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "sticky" && (
          <div className="flex-1 flex flex-col">
            <div className="p-8 border-b border-white/5 bg-[#050505] flex justify-between items-center">
              <div>
                <h4 className="font-outfit font-medium text-white text-lg uppercase tracking-widest">Pinned Announcements</h4>
                <p className="text-sm font-inter text-zinc-500 mt-1">
                  Messages that automatically stick to the bottom of their respective channels.
                </p>
              </div>
              <div className="bg-black border border-white/10 rounded px-4 py-2 flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs font-mono text-zinc-400">{stickyMessages.length} Active Pins</span>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#0a0a0a]">
              {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-sm font-inter uppercase tracking-widest">Loading sticky records...</span>
                </div>
              ) : stickyMessages.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-3 p-10 text-center">
                  <span className="text-sm font-inter">No sticky messages configured.</span>
                </div>
              ) : (
                <div className="w-full">
                  <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-zinc-500 bg-[#050505] sticky top-0 z-10">
                    <div className="col-span-3">Channel ID</div>
                    <div className="col-span-8">Sticky Content</div>
                    <div className="col-span-1 text-right">Action</div>
                  </div>
                  {stickyMessages.map((s) => (
                    <div key={s.channel_id} className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 text-sm items-start hover:bg-white/[0.02] transition-colors group">
                      <div className="col-span-3 font-mono text-zinc-300 bg-black px-3 py-1.5 rounded w-fit text-xs border border-white/5">{s.channel_id}</div>
                      <div className="col-span-8 font-inter text-zinc-400 whitespace-pre-wrap leading-relaxed tracking-wide">
                        {s.message}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button 
                          onClick={() => handleDeleteSticky(s.channel_id)}
                          className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 p-2 rounded transition-all opacity-0 group-hover:opacity-100"
                          title="Remove Sticky Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
