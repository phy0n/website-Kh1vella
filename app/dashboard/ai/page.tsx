"use client";

import { useState, useEffect } from "react";
import { BrainCircuit, Search, Loader2, Database, Trash2, SlidersHorizontal } from "lucide-react";
import { createClient } from "@/utils/supabase";

type MemoryRecord = {
  user_id: string;
  username: string;
  favorite_game: string | null;
  favorite_food: string | null;
  about_user: string | null;
  relationship_score: number;
  last_interaction: string;
};

export default function AIPage() {
  const supabase = createClient();
  const [memories, setMemories] = useState<MemoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    const { data, error } = await supabase
      .from("khivella_memory")
      .select("*")
      .order("last_interaction", { ascending: false });

    if (!error && data) {
      setMemories(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Wipe this user's memory from the AI core?")) return;
    await supabase.from("khivella_memory").delete().eq("user_id", id);
    await fetchMemories();
  };

  const filteredMemories = memories.filter(m => 
    m.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.user_id.includes(searchQuery)
  );

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-600" />
          <h3 className="font-outfit font-semibold text-lg uppercase tracking-widest">Generative AI Center</h3>
        </div>
        <div className="bg-black border border-white/10 rounded px-4 py-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-zinc-500" />
          <span className="text-sm font-mono text-zinc-300">{memories.length} Memory Blocks</span>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 flex flex-col flex-1 relative overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-white/5 bg-[#050505] flex justify-between items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search username or Discord ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-white/10 rounded px-3 py-2 pl-9 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors placeholder:text-zinc-700 font-inter"
            />
          </div>
          <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded text-xs font-inter uppercase tracking-widest transition-colors flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filter Settings
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-inter uppercase tracking-widest">Syncing with neural core...</span>
            </div>
          ) : filteredMemories.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-3 p-10 text-center">
              <BrainCircuit className="w-8 h-8 opacity-20" />
              <span className="text-sm font-inter">No memory fragments found matching your criteria.</span>
            </div>
          ) : (
            <div className="w-full min-w-[800px]">
              <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-zinc-500 bg-[#050505] sticky top-0 z-10">
                <div className="col-span-2">User</div>
                <div className="col-span-1 text-center">Rel. Score</div>
                <div className="col-span-3">Personality Tags</div>
                <div className="col-span-4">Contextual Notes</div>
                <div className="col-span-1">Last Synced</div>
                <div className="col-span-1 text-right">Action</div>
              </div>
              {filteredMemories.map((m) => (
                <div key={m.user_id} className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 text-sm hover:bg-white/[0.02] transition-colors group items-start">
                  <div className="col-span-2 flex flex-col gap-1">
                    <span className="font-inter text-white font-medium tracking-wide truncate">{m.username}</span>
                    <span className="font-mono text-zinc-600 text-[10px]">{m.user_id}</span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      m.relationship_score > 10 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      m.relationship_score < 0 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                    }`}>
                      {m.relationship_score > 0 ? '+' : ''}{m.relationship_score}
                    </span>
                  </div>
                  <div className="col-span-3 flex flex-wrap gap-1 content-start">
                    {m.favorite_game && <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] uppercase truncate max-w-full tracking-wider" title={`Game: ${m.favorite_game}`}>🎮 {m.favorite_game}</span>}
                    {m.favorite_food && <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-[10px] uppercase truncate max-w-full tracking-wider" title={`Food: ${m.favorite_food}`}>🍔 {m.favorite_food}</span>}
                    {!m.favorite_game && !m.favorite_food && <span className="text-zinc-600 text-xs italic">No tags</span>}
                  </div>
                  <div className="col-span-4 font-inter text-zinc-400 text-xs line-clamp-2 leading-relaxed" title={m.about_user || ""}>
                    {m.about_user || <span className="italic text-zinc-600">No contextual notes available</span>}
                  </div>
                  <div className="col-span-1 font-inter text-zinc-500 text-xs">
                    {new Date(m.last_interaction).toLocaleDateString()}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button 
                      onClick={() => handleDelete(m.user_id)}
                      className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 p-2 rounded transition-all opacity-0 group-hover:opacity-100"
                      title="Wipe Memory">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
