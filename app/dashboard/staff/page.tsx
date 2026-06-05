"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Search, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase";

type StaffAccess = {
  discord_id: string;
  role_name: string;
  added_at: string;
};

export default function StaffPage() {
  const supabase = createClient();
  const [staff, setStaff] = useState<StaffAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [discordId, setDiscordId] = useState("");
  const [roleName, setRoleName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    const { data, error } = await supabase
      .from("khivella_access")
      .select("*")
      .order("added_at", { ascending: false });

    if (!error && data) {
      setStaff(data);
    }
    setLoading(false);
  };

  const handleAddAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discordId || !roleName) return;
    
    setSubmitting(true);
    const { error } = await supabase
      .from("khivella_access")
      .insert([{ discord_id: discordId, role_name: roleName }]);

    if (!error) {
      setDiscordId("");
      setRoleName("");
      await fetchStaff();
    } else {
      alert("Error adding access. Discord ID might already exist.");
    }
    setSubmitting(false);
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this user's access?")) return;
    
    await supabase.from("khivella_access").delete().eq("discord_id", id);
    await fetchStaff();
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-red-600" />
        <h3 className="font-outfit font-semibold text-lg uppercase tracking-widest">Staff Operations Center</h3>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 flex flex-col flex-1 relative overflow-hidden min-h-[600px] lg:flex-row">
        <div className="lg:w-[400px] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col">
          <div className="p-8 border-b border-white/5">
            <h4 className="font-outfit font-medium text-white text-lg uppercase tracking-widest">Grant Clearance</h4>
            <p className="text-sm font-inter text-zinc-500 mt-1">
              Authorize a Discord user for elevated access.
            </p>
          </div>
          
          <form onSubmit={handleAddAccess} className="p-8 flex flex-col gap-6 flex-1">
            <div className="flex flex-col gap-2 relative">
              <label className="text-xs font-inter text-zinc-500 uppercase tracking-widest">Discord User ID</label>
              <input
                type="text"
                value={discordId}
                onChange={(e) => setDiscordId(e.target.value)}
                placeholder="e.g. 123456789012345678"
                className="bg-transparent border border-white/10 p-4 rounded text-white font-mono text-sm focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-800"
                required
              />
            </div>

            <div className="flex flex-col gap-2 relative">
              <label className="text-xs font-inter text-zinc-500 uppercase tracking-widest">System Role</label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. Core Admin, Content Mod"
                className="bg-transparent border border-white/10 p-4 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-800"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded text-white font-outfit font-semibold uppercase tracking-widest text-xs px-8 py-4 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {submitting ? "Authorizing..." : "Authorize Identity"}
            </button>
          </form>
        </div>

        <div className="flex-1 flex flex-col h-full min-h-[400px]">
          <div className="p-8 border-b border-white/5 bg-[#050505] flex justify-between items-center">
            <h4 className="font-outfit font-medium text-white text-lg uppercase tracking-widest">Authorized Identities</h4>
            <div className="bg-black border border-white/10 rounded px-4 py-2 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs font-mono text-zinc-400">{staff.length} Active Records</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-[#0a0a0a]">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm font-inter uppercase tracking-widest">Loading registry...</span>
              </div>
            ) : staff.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-3 p-10 text-center">
                <span className="text-sm font-inter">No identities authorized yet.</span>
              </div>
            ) : (
              <div className="w-full">
                <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-zinc-500 bg-[#050505] sticky top-0 z-10">
                  <div className="col-span-4">Discord ID</div>
                  <div className="col-span-4">Assigned Role</div>
                  <div className="col-span-3">Authorization Date</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>
                {staff.map((s) => (
                  <div key={s.discord_id} className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 text-sm items-center hover:bg-white/[0.02] transition-colors group">
                    <div className="col-span-4 font-mono text-zinc-300 bg-black px-3 py-1.5 rounded w-fit text-xs border border-white/5">{s.discord_id}</div>
                    <div className="col-span-4 font-inter text-white font-medium tracking-wide">{s.role_name}</div>
                    <div className="col-span-3 font-inter text-zinc-500 text-xs">{new Date(s.added_at).toLocaleDateString()}</div>
                    <div className="col-span-1 flex justify-end">
                      <button 
                        onClick={() => handleRevoke(s.discord_id)}
                        className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 p-2 rounded transition-all opacity-0 group-hover:opacity-100"
                        title="Revoke Access"
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
      </div>
    </div>
  );
}
