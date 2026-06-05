"use client";

import { createClient } from "@/utils/supabase";
import { LogOut, LayoutDashboard, Send, Server, Power, Activity, TerminalSquare, ShieldAlert, Users, Shield, FolderOpen, AlertTriangle, FileText, Settings, Database, ActivityIcon, BrainCircuit, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        return;
      }
      
      if (session.user.user_metadata.provider_id !== "494169184175915019") {
        alert("ACCESS DENIED: Unauthorized Identity.");
        await supabase.auth.signOut();
        router.push("/");
        return;
      }
      setUser(session.user);
      setIsLoading(false);
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navGroups = [
    {
      title: "Core System",
      items: [
        { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
        { name: "Terminal", icon: TerminalSquare, href: "/dashboard/terminal" },
        { name: "Embed Studio", icon: FolderOpen, href: "/dashboard/embed-builder" },
      ]
    },
    {
      title: "Access & Enforcement",
      items: [
        { name: "Staff Center", icon: Shield, href: "/dashboard/staff" },
        { name: "Automations", icon: Zap, href: "/dashboard/automations" },
      ]
    },
    {
      title: "Intelligence",
      items: [
        { name: "AI Center", icon: BrainCircuit, href: "/dashboard/ai" },
        { name: "Analytics", icon: ActivityIcon, href: "/dashboard/analytics" },
        { name: "Audit Logs", icon: FileText, href: "/dashboard/logs" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans selection:bg-red-600/30 selection:text-white">
      <aside className="w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col relative z-20 h-screen">
        <div className="h-24 px-8 border-b border-white/5 flex items-center gap-4 shrink-0">
          <div className="w-10 h-10 bg-red-600/10 border border-red-500/20 flex items-center justify-center rounded">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="font-outfit font-bold text-xl tracking-wide">Kh1vella</h2>
            <p className="text-[10px] text-red-500 font-inter uppercase tracking-[0.2em] mt-1">Admin Panel</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col gap-8 custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <h3 className="px-4 text-[10px] font-inter text-zinc-500 uppercase tracking-widest mb-2">{group.title}</h3>
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link 
                    href={item.href}
                    key={item.name}
                    className={clsx(
                      "flex items-center gap-4 px-4 py-3 rounded transition-all duration-300 relative group",
                      isActive ? "bg-white/5 text-white" : "text-zinc-500 hover:text-white hover:bg-white/5"
                    )}>
                    {isActive && <motion.div layoutId="navIndicator" className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-red-600 rounded-r" />}
                    <item.icon className={clsx("w-5 h-5 transition-colors", isActive ? "text-red-500" : "group-hover:text-red-400")} />
                    <span className="font-outfit text-sm tracking-wide font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-white/5 shrink-0">
          <div 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-4 cursor-pointer text-zinc-500 hover:text-red-500 transition-colors group rounded">
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-outfit text-sm tracking-wide font-medium">Disconnect</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-24 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-10 shrink-0 relative z-10">
          <div>
            <h1 className="text-2xl font-outfit font-bold tracking-tight">System Interface</h1>
            <p className="text-xs text-zinc-500 font-inter uppercase tracking-widest mt-1">
              Kh1ev Community Operating System
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-sm font-outfit font-medium">{user?.user_metadata?.full_name}</span>
              <span className="block text-[10px] text-zinc-500 font-inter uppercase tracking-widest mt-0.5">Root Admin</span>
            </div>
            <img src={user?.user_metadata?.avatar_url} alt="Avatar" className="w-10 h-10 border border-white/10" />
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-10 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
