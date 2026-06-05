"use client";

import { useState, useEffect } from "react";
import { Shield, Plus, Trash2, ShieldCheck, Search, Loader2 } from "lucide-react";
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
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto h-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-outfit text-3xl font-bold tracking-wide text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-500" />
            Staff Access Operations
          </h1>
          <p className="font-inter text-sm text-zinc-400">
            Manage administrative clearance levels and grant Discord users access to strict bot systems.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form onSubmit={handleAddAccess} className="bg-[#0a0a0a] border border-white/5 p-6 rounded flex flex-col gap-4">
            <h2 className="font-outfit text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
              <ShieldCheck className="w-5 h-5 text-zinc-400" /> Grant Clearance
            </h2>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-inter uppercase tracking-widest font-bold text-zinc-500">Discord User ID</label>
              <input
                type="text"
                value={discordId}
                onChange={(e) => setDiscordId(e.target.value)}
                placeholder="e.g. 123456789012345678"
                className="bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors placeholder:text-zinc-700 font-mono"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-inter uppercase tracking-widest font-bold text-zinc-500">System Role</label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. Core Admin, Content Mod"
                className="bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors placeholder:text-zinc-700"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold font-inter text-sm py-2.5 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {submitting ? "Authorizing..." : "Authorize Identity"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#0a0a0a] border border-white/5 rounded overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <h2 className="font-outfit font-bold text-white text-sm uppercase tracking-wider">Authorized Identities</h2>
              <div className="bg-black border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs font-mono text-zinc-400">{staff.length} Active Records</span>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-sm font-inter">Loading registry...</span>
                </div>
              ) : staff.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-3 p-10 text-center">
                  <Shield className="w-8 h-8 opacity-20" />
                  <span className="text-sm font-inter">No identities authorized yet. Add a Discord ID to grant access.</span>
                </div>
              ) : (
                <div className="w-full">
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs font-bold uppercase tracking-wider text-zinc-500 bg-white/[0.01]">
                    <div className="col-span-4">Discord ID</div>
                    <div className="col-span-4">Assigned Role</div>
                    <div className="col-span-3">Authorization Date</div>
                    <div className="col-span-1 text-right">Action</div>
                  </div>
                  {staff.map((s) => (
                    <div key={s.discord_id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-sm items-center hover:bg-white/[0.02] transition-colors group">
                      <div className="col-span-4 font-mono text-zinc-300 bg-black px-2 py-1 rounded w-fit text-xs border border-white/5">{s.discord_id}</div>
                      <div className="col-span-4 font-inter text-white font-medium">{s.role_name}</div>
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
    </div>
  );
}
