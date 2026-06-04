"use client";

import { Shield, Music, Wrench, Sparkles, TerminalSquare } from "lucide-react";
import clsx from "clsx";

export default function CommandsPage() {
  const commandCategories = [
    {
      name: "Public Utilities",
      icon: Wrench,
      description: "Available to all community members.",
      commands: [
        { name: "/help", desc: "Interactive command center manual.", admin: false },
        { name: "/ping", desc: "Check core engine network latency.", admin: false },
        { name: "/serverinfo", desc: "View detailed network node stats.", admin: false },
        { name: "/userinfo", desc: "Scan a specific entity profile.", admin: false },
        { name: "/avatar", desc: "Extract entity profile imagery.", admin: false },
      ]
    },
    {
      name: "Music System",
      icon: Music,
      description: "Audio streaming subsystem.",
      commands: [
        { name: "/play", desc: "Stream audio payload via URL/Query.", admin: false },
        { name: "/join", desc: "Summon engine to voice channel.", admin: false },
        { name: "/queue", desc: "View current tracklist.", admin: false },
        { name: "/skip", desc: "Bypass current track.", admin: false },
        { name: "/pause", desc: "Halt audio stream.", admin: false },
      ]
    },
    {
      name: "Enforcement (Staff Only)",
      icon: Shield,
      description: "Strictly for Moderators & Administrators.",
      commands: [
        { name: "/warn", desc: "Issue official warning to database.", admin: true },
        { name: "/strike", desc: "Issue strike. Auto-Bans on threshold.", admin: true },
        { name: "/timeout", desc: "Isolate user from communication.", admin: true },
        { name: "/kick", desc: "Forcibly eject entity from node.", admin: true },
        { name: "/ban", desc: "Permanently blacklist entity.", admin: true },
        { name: "/purge", desc: "Mass delete message payloads.", admin: true },
      ]
    },
    {
      name: "AI Subsystem",
      icon: Sparkles,
      description: "Generative AI controls.",
      commands: [
        { name: "/chatbot", desc: "Toggle Google Gemini subsystem on/off.", admin: true },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-10 max-w-[1200px]">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-red-600" />
        <h3 className="font-outfit font-semibold text-lg uppercase tracking-widest">Command Reference</h3>
      </div>
      
      <p className="text-zinc-400 font-inter text-sm max-w-3xl">
        Comprehensive index of all available subsystem functions. All commands support slash (`/`) execution. Interactive components (Modals & Buttons) are automatically invoked for complex workflows.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {commandCategories.map((category) => (
          <div key={category.name} className="bg-[#0a0a0a] border border-white/5 rounded p-6 flex flex-col gap-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <category.icon className="w-5 h-5 text-red-500" />
              <div>
                <h4 className="font-outfit text-white tracking-wide">{category.name}</h4>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">{category.description}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {category.commands.map(cmd => (
                <div key={cmd.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white/[0.02] rounded border border-white/5 hover:border-red-500/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <TerminalSquare className="w-4 h-4 text-zinc-600 group-hover:text-red-400 transition-colors" />
                    <span className="font-mono text-sm text-white font-semibold">{cmd.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-zinc-400 font-inter">{cmd.desc}</span>
                    {cmd.admin ? (
                      <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">Admin</span>
                    ) : (
                      <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">User</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
