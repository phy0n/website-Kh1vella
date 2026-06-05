"use client";

import { useState, useEffect } from "react";
import { FileText, Loader2, ShieldAlert, Clock, AlertTriangle, UserMinus, UserPlus, MessageSquare } from "lucide-react";
import { createClient } from "@/utils/supabase";

type AuditLog = {
  id: number;
  event_type: string;
  user_id: string | null;
  username: string | null;
  details: string;
  created_at: string;
};

export default function LogsPage() {
  const supabase = createClient();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("khivella_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setLogs(data);
    }
    setLoading(false);
  };

  const getEventIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("ban") || t.includes("kick")) return <UserMinus className="w-4 h-4 text-red-500" />;
    if (t.includes("join")) return <UserPlus className="w-4 h-4 text-green-500" />;
    if (t.includes("message")) return <MessageSquare className="w-4 h-4 text-blue-500" />;
    if (t.includes("warn") || t.includes("security")) return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    return <ShieldAlert className="w-4 h-4 text-zinc-400" />;
  };

  const getEventColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("ban") || t.includes("kick") || t.includes("delete")) return "text-red-400 bg-red-500/10 border-red-500/20";
    if (t.includes("join") || t.includes("create")) return "text-green-400 bg-green-500/10 border-green-500/20";
    if (t.includes("warn")) return "text-orange-400 bg-orange-500/10 border-orange-500/20";
    return "text-zinc-300 bg-zinc-800 border-white/10";
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-600" />
          <h3 className="font-outfit font-semibold text-lg uppercase tracking-widest">Centralized Audit Logs</h3>
        </div>
        <button 
          onClick={() => { setLoading(true); fetchLogs(); }}
          className="bg-black hover:bg-white/5 border border-white/10 text-white px-4 py-2 rounded text-xs font-inter uppercase tracking-widest transition-colors"
        >
          Refresh Logs
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 flex flex-col flex-1 relative overflow-hidden min-h-[600px]">
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-inter uppercase tracking-widest">Retrieving system records...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-3 p-10 text-center">
              <FileText className="w-8 h-8 opacity-20" />
              <span className="text-sm font-inter">The audit registry is currently empty. No events have been recorded yet.</span>
            </div>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-zinc-500 bg-[#050505] sticky top-0 z-10">
                <div className="col-span-2">Timestamp</div>
                <div className="col-span-2">Event Type</div>
                <div className="col-span-3">Target Entity</div>
                <div className="col-span-5">Audit Details</div>
              </div>
              <div className="flex flex-col">
                {logs.map((log) => (
                  <div key={log.id} className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 text-sm hover:bg-white/[0.02] transition-colors items-start">
                    <div className="col-span-2 flex items-center gap-2 font-mono text-zinc-500 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(log.created_at).toLocaleString('en-GB', { 
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' 
                      })}
                    </div>
                    
                    <div className="col-span-2">
                      <span className={`px-2 py-1 text-[10px] font-mono border uppercase tracking-widest flex items-center gap-1.5 w-fit ${getEventColor(log.event_type)}`}>
                        {getEventIcon(log.event_type)}
                        {log.event_type}
                      </span>
                    </div>

                    <div className="col-span-3 flex flex-col gap-0.5">
                      {log.username ? (
                        <>
                          <span className="font-inter text-white font-medium tracking-wide">{log.username}</span>
                          <span className="font-mono text-zinc-600 text-[10px]">{log.user_id}</span>
                        </>
                      ) : (
                        <span className="font-inter text-zinc-600 italic text-xs tracking-wide">System / Anonymous</span>
                      )}
                    </div>

                    <div className="col-span-5 font-inter text-zinc-400 text-sm leading-relaxed">
                      {log.details}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
