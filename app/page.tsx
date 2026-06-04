"use client";

import { createClient } from "@/utils/supabase";
import { motion } from "framer-motion";
import { Bot, Terminal, ShieldAlert, DiscIcon as DiscordIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      } else {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6">
          <div className="flex items-center gap-3 text-red-500">
            <Terminal className="w-6 h-6" />
            <span className="font-outfit font-semibold tracking-widest uppercase text-sm">System Restricted</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-outfit font-bold leading-[1.1] tracking-tight">
            Control <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 font-style-italic">
              Protocol.
            </span>
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-xl font-inter max-w-md">
            Advanced management interface for Kh1vella Discord integration. Authorized personnel only.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col items-start md:items-end justify-center w-full">
          <div className="w-full max-w-sm flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-xl">Identity Required</h3>
                <p className="text-zinc-500 text-sm font-inter">Authenticate via Discord to access the command center.</p>
              </div>
            </div>

            <button 
              onClick={handleLogin}
              className="group relative w-full h-14 bg-white text-black font-outfit font-semibold text-lg flex items-center justify-center gap-3 overflow-hidden transition-all hover:bg-zinc-200">
              <DiscordIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Authenticate</span>
              <div className="absolute inset-0 border border-white/20 scale-[0.98] opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
            </button>
            
            <div className="flex items-center gap-2 text-zinc-600 text-xs font-inter uppercase tracking-widest">
              <Bot className="w-4 h-4" />
              <span>Kh1vella Core v2.0</span>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
