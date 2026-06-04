"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase";
import { FolderOpen, Search, AlertCircle, RefreshCcw } from "lucide-react";
import clsx from "clsx";

export default function CasesPage() {
  const supabase = createClient();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCases = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("mod_cases")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setCases(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const filteredCases = cases.filter(c => 
    c.user_id.includes(search) || 
    c.moderator_id.includes(search) || 
    c.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10 w-full h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-600" />
          <h3 className="font-outfit font-semibold text-lg uppercase tracking-widest">Case History</h3>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search ID or Reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0a0a0a] border border-white/5 py-2 pl-10 pr-4 text-sm font-inter text-white focus:outline-none focus:border-red-500 rounded"
            />
          </div>
          <button 
            onClick={fetchCases}
            className="bg-white/5 hover:bg-white/10 p-2 rounded transition-colors text-zinc-400 hover:text-white">
            <RefreshCcw className={clsx("w-5 h-5", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 flex flex-col flex-1 rounded overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/5 font-inter text-xs text-zinc-500 uppercase tracking-widest">
          <div className="col-span-1">Type</div>
          <div className="col-span-2">User ID</div>
          <div className="col-span-2">Mod ID</div>
          <div className="col-span-4">Reason</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1 text-right">Status</div>
        </div>
        
        <div className="flex flex-col overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-zinc-600 font-inter text-sm flex justify-center">
              <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredCases.length > 0 ? (
            filteredCases.map(c => (
              <div key={c.id} className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center font-mono text-sm">
                <div className="col-span-1">
                  <span className={clsx(
                    "px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold",
                    c.type === "strike" ? "bg-red-500/10 text-red-500" :
                    c.type === "warn" ? "bg-amber-500/10 text-amber-500" :
                    c.type === "ban" ? "bg-purple-500/10 text-purple-500" :
                    c.type === "kick" ? "bg-orange-500/10 text-orange-500" :
                    "bg-zinc-500/10 text-zinc-500"
                  )}>
                    {c.type}
                  </span>
                </div>
                <div className="col-span-2 text-zinc-300 truncate" title={c.user_id}>{c.user_id}</div>
                <div className="col-span-2 text-zinc-500 truncate" title={c.moderator_id}>{c.moderator_id}</div>
                <div className="col-span-4 text-zinc-400 font-inter truncate" title={c.reason}>{c.reason}</div>
                <div className="col-span-2 text-zinc-500">{new Date(c.created_at).toLocaleDateString()}</div>
                <div className="col-span-1 text-right flex justify-end">
                  {c.is_active ? (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-zinc-600" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 flex flex-col items-center justify-center gap-4 text-zinc-600">
              <AlertCircle className="w-8 h-8 opacity-50" />
              <p className="font-inter text-sm italic">No moderation cases found in the database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
