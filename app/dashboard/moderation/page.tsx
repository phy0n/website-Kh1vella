"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase";
import { ShieldAlert, Save, ShieldCheck, Zap, Link, Trash2, Users } from "lucide-react";

export default function ModerationPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("mod_settings").select("*").single();
    if (data) {
      setSettings(data);
    } else {
      const defaultSettings = {
        guild_id: "1234567890",
        auto_mod_enabled: true,
        anti_spam_enabled: true,
        anti_link_enabled: false,
        anti_raid_enabled: true,
        anti_nuke_enabled: true,
        strike_ban_threshold: 3,
        strike_kick_threshold: 2
      };
      setSettings(defaultSettings);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("mod_settings").upsert(settings);
    setTimeout(() => setSaving(false), 1000);
  };

  if (loading) return null;

  return (
    <div className="flex flex-col gap-10 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-600" />
          <h3 className="font-outfit font-semibold text-lg uppercase tracking-widest">Enforcement Settings</h3>
        </div>
        <button 
          onClick={handleSave}
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 flex items-center gap-2 text-xs font-inter uppercase tracking-widest transition-colors">
          <Save className="w-4 h-4" />
          {saving ? "Deploying..." : "Save Config"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0a0a0a] border border-white/5 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <ShieldCheck className="w-5 h-5 text-zinc-500" />
            <h4 className="font-outfit text-white tracking-wide">Core Protection</h4>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-inter text-sm text-white">Auto Moderation</p>
              <p className="font-inter text-xs text-zinc-500 mt-1">Automatically enforce rules using AI and Regex.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.auto_mod_enabled} onChange={(e) => setSettings({...settings, auto_mod_enabled: e.target.checked})} className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-inter text-sm text-white">Anti-Spam Filter</p>
              <p className="font-inter text-xs text-zinc-500 mt-1">Detect and suppress fast repetitive messages.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.anti_spam_enabled} onChange={(e) => setSettings({...settings, anti_spam_enabled: e.target.checked})} className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-inter text-sm text-white">Anti-Link / Scam</p>
              <p className="font-inter text-xs text-zinc-500 mt-1">Block unauthorized URLs and known phishing links.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.anti_link_enabled} onChange={(e) => setSettings({...settings, anti_link_enabled: e.target.checked})} className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <Zap className="w-5 h-5 text-zinc-500" />
            <h4 className="font-outfit text-white tracking-wide">Server Defenses</h4>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-inter text-sm text-white">Anti-Raid Mode</p>
              <p className="font-inter text-xs text-zinc-500 mt-1">Automatically lock down server during mass-joins.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.anti_raid_enabled} onChange={(e) => setSettings({...settings, anti_raid_enabled: e.target.checked})} className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-inter text-sm text-white">Anti-Nuke Protection</p>
              <p className="font-inter text-xs text-zinc-500 mt-1">Prevent unauthorized mass channel/role deletion.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.anti_nuke_enabled} onChange={(e) => setSettings({...settings, anti_nuke_enabled: e.target.checked})} className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-6 flex flex-col gap-6 lg:col-span-2">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <Trash2 className="w-5 h-5 text-zinc-500" />
            <h4 className="font-outfit text-white tracking-wide">Strike Escalation</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-inter text-zinc-500 uppercase tracking-widest">Kick Threshold</label>
              <input 
                type="number" 
                value={settings.strike_kick_threshold}
                onChange={(e) => setSettings({...settings, strike_kick_threshold: parseInt(e.target.value)})}
                className="bg-transparent border border-white/10 p-3 text-white font-mono text-sm focus:outline-none focus:border-red-500 transition-colors"
              />
              <p className="text-[10px] text-zinc-600 mt-1">Amount of strikes before an automated Kick.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-inter text-zinc-500 uppercase tracking-widest">Ban Threshold</label>
              <input 
                type="number" 
                value={settings.strike_ban_threshold}
                onChange={(e) => setSettings({...settings, strike_ban_threshold: parseInt(e.target.value)})}
                className="bg-transparent border border-white/10 p-3 text-white font-mono text-sm focus:outline-none focus:border-red-500 transition-colors"
              />
              <p className="text-[10px] text-zinc-600 mt-1">Amount of strikes before an automated permanent Ban.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
