"use client";

import { Users, Lock } from "lucide-react";

export default function MembersPage() {
  return (
    <div className="flex flex-col gap-10 max-w-[1200px] h-full items-center justify-center">
      <div className="bg-[#0a0a0a] border border-white/5 p-16 rounded flex flex-col items-center text-center max-w-lg">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Users className="w-8 h-8 text-zinc-500" />
        </div>
        <h2 className="font-outfit text-2xl font-bold tracking-wide text-white mb-2">Member Profiles System</h2>
        <p className="font-inter text-sm text-zinc-400 mb-8 leading-relaxed">
          The comprehensive member management module is currently being finalized. This will include XP tracking, Reputation System, Join/Leave logs, and comprehensive Member Timelines.
        </p>
        <div className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded text-xs font-inter uppercase tracking-widest font-bold">
          <Lock className="w-3 h-3" />
          <span>Module Locked (In Development)</span>
        </div>
      </div>
    </div>
  );
}
