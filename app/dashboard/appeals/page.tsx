"use client";

import { AlertTriangle, Lock } from "lucide-react";

export default function AppealsPage() {
  return (
    <div className="flex flex-col gap-10 w-full h-full items-center justify-center">
      <div className="bg-[#0a0a0a] border border-white/5 p-16 rounded flex flex-col items-center text-center max-w-lg">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-zinc-500" />
        </div>
        <h2 className="font-outfit text-2xl font-bold tracking-wide text-white mb-2">Member Appeals</h2>
        <p className="font-inter text-sm text-zinc-400 mb-8 leading-relaxed">
          The Automated Appeal System is part of the Moderation Phase 2. Banned or muted users will be able to submit appeals here for senior staff review.
        </p>
        <div className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded text-xs font-inter uppercase tracking-widest font-bold">
          <Lock className="w-3 h-3" />
          <span>Module Locked (In Development)</span>
        </div>
      </div>
    </div>
  );
}
