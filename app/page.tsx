"use client";

import { createClient } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DiscIcon as DiscordIcon } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-sans">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold tracking-widest uppercase">Login</h1>
        
        <button 
          onClick={handleLogin}
          className="flex items-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 rounded font-medium transition-colors cursor-pointer">
          <DiscordIcon className="w-6 h-6" />
          <span>Login with Discord</span>
        </button>
      </div>
    </main>
  );
}
