"use client";

import { useState } from "react";
import { FolderOpen, Send, Palette, LayoutTemplate, AlertCircle, Plus, Trash2 } from "lucide-react";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type EmbedField = {
  name: string;
  value: string;
  inline: boolean;
};

export default function EmbedBuilderPage() {
  const [channelId, setChannelId] = useState("");
  const [embed, setEmbed] = useState({
    title: "",
    url: "",
    description: "",
    color: "#ef4444",
    image_url: "",
    thumbnail_url: "",
    author_name: "",
    author_url: "",
    author_icon: "",
    footer_text: "",
    footer_icon: "",
  });
  const [fields, setFields] = useState<EmbedField[]>([]);

  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{type: "success" | "error" | null, msg: string}>({type: null, msg: ""});
  
  const botApiUrl = process.env.NEXT_PUBLIC_BOT_API_URL || "http://localhost:8080";

  const addField = () => {
    if (fields.length >= 25) {
      alert("Discord embeds are limited to 25 fields max.");
      return;
    }
    setFields([...fields, { name: "", value: "", inline: false }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: keyof EmbedField, value: string | boolean) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
  };

  const handleSendEmbed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelId) return;
    
    setIsSending(true);
    setStatus({type: null, msg: ""});

    try {
      const response = await fetch(`${botApiUrl}/api/message/embed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_id: channelId,
          ...embed,
          color: embed.color.replace("#", ""),
          fields: fields.length > 0 ? fields : undefined
        }),
      });

      if (response.ok) {
        setStatus({type: "success", msg: "Embed transmitted successfully."});
      } else {
        const errorText = await response.text();
        setStatus({type: "error", msg: `Transmission failed: ${errorText}`});
      }
    } catch (error: any) {
      setStatus({type: "error", msg: `Network Error: ${error.message}`});
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-600" />
          <h3 className="font-outfit font-semibold text-lg uppercase tracking-widest">Embed Studio</h3>
        </div>
        
        {!process.env.NEXT_PUBLIC_BOT_API_URL && (
          <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-4 py-2 rounded text-xs font-inter uppercase tracking-widest font-bold">
            <AlertCircle className="w-4 h-4" />
            <span>Warning: NEXT_PUBLIC_BOT_API_URL is missing. Network calls may fail.</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full items-start">
        <div className="bg-[#0a0a0a] border border-white/5 rounded flex flex-col gap-8">
          <div className="flex items-center gap-4 p-8 pb-6 border-b border-white/5">
            <Palette className="w-6 h-6 text-red-500" />
            <div>
              <h4 className="font-outfit text-white font-medium uppercase tracking-widest">Embed Configuration</h4>
              <p className="text-xs text-zinc-500 font-inter mt-1">Design and transmit rich messages to the network.</p>
            </div>
          </div>

          <form onSubmit={handleSendEmbed} className="flex flex-col gap-6 px-8 pb-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Target Channel ID *</label>
              <input 
                type="text" 
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder="Required"
                className="bg-transparent border border-white/10 p-3 rounded text-white font-mono text-sm focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-800"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Title</label>
                <input 
                  type="text" 
                  value={embed.title}
                  onChange={(e) => setEmbed({...embed, title: e.target.value})}
                  className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Title URL</label>
                <input 
                  type="text" 
                  value={embed.url}
                  onChange={(e) => setEmbed({...embed, url: e.target.value})}
                  placeholder="https://"
                  className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-800"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Description (Markdown Supported)</label>
              <textarea 
                value={embed.description}
                onChange={(e) => setEmbed({...embed, description: e.target.value})}
                className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors min-h-[150px] resize-none"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Theme Color</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={embed.color}
                  onChange={(e) => setEmbed({...embed, color: e.target.value})}
                  className="h-11 w-11 bg-transparent rounded cursor-pointer border border-white/10 p-1"
                />
                <input 
                  type="text" 
                  value={embed.color}
                  onChange={(e) => setEmbed({...embed, color: e.target.value})}
                  className="bg-transparent border border-white/10 p-3 rounded text-white font-mono text-sm focus:outline-none focus:border-red-500 transition-colors flex-1"
                />
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 mt-2">
              <h5 className="font-outfit uppercase tracking-widest text-xs font-bold text-zinc-400 mb-4">Author Settings</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Name</label>
                  <input 
                    type="text" 
                    value={embed.author_name}
                    onChange={(e) => setEmbed({...embed, author_name: e.target.value})}
                    className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">URL</label>
                  <input 
                    type="text" 
                    value={embed.author_url}
                    onChange={(e) => setEmbed({...embed, author_url: e.target.value})}
                    placeholder="https://"
                    className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-800"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Icon URL</label>
                  <input 
                    type="text" 
                    value={embed.author_icon}
                    onChange={(e) => setEmbed({...embed, author_icon: e.target.value})}
                    placeholder="https://"
                    className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-800"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 mt-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h5 className="font-outfit uppercase tracking-widest text-xs font-bold text-zinc-400">Custom Fields</h5>
                <button 
                  type="button" 
                  onClick={addField}
                  className="bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded text-[10px] font-inter uppercase tracking-widest transition-colors flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Field
                </button>
              </div>
              
              {fields.length === 0 ? (
                <div className="text-zinc-600 text-xs italic">No fields added.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {fields.map((f, i) => (
                    <div key={i} className="flex gap-2 items-start bg-white/[0.02] p-4 border border-white/5 rounded">
                      <div className="flex-1 flex flex-col gap-4">
                        <div className="flex gap-4">
                          <div className="flex-1 flex flex-col gap-2">
                            <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Field Name *</label>
                            <input 
                              type="text" 
                              value={f.name}
                              onChange={(e) => updateField(i, 'name', e.target.value)}
                              className="bg-black border border-white/10 p-2 rounded text-white font-inter text-xs focus:outline-none focus:border-red-500 transition-colors"
                              required
                            />
                          </div>
                          <div className="flex items-center gap-2 pt-6">
                            <input 
                              type="checkbox" 
                              checked={f.inline}
                              onChange={(e) => updateField(i, 'inline', e.target.checked)}
                              className="w-4 h-4 accent-red-600 cursor-pointer"
                              id={`inline-${i}`}
                            />
                            <label htmlFor={`inline-${i}`} className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold cursor-pointer">Inline</label>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Field Value *</label>
                          <textarea 
                            value={f.value}
                            onChange={(e) => updateField(i, 'value', e.target.value)}
                            className="bg-black border border-white/10 p-2 rounded text-white font-inter text-xs focus:outline-none focus:border-red-500 transition-colors min-h-[60px] resize-none"
                            required
                          />
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeField(i)}
                        className="text-zinc-500 hover:text-red-500 p-1 bg-black rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/5 pt-6 mt-2">
              <h5 className="font-outfit uppercase tracking-widest text-xs font-bold text-zinc-400 mb-4">Media Settings</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Large Image URL</label>
                  <input 
                    type="text" 
                    value={embed.image_url}
                    onChange={(e) => setEmbed({...embed, image_url: e.target.value})}
                    placeholder="https://"
                    className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-800"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Thumbnail Image URL</label>
                  <input 
                    type="text" 
                    value={embed.thumbnail_url}
                    onChange={(e) => setEmbed({...embed, thumbnail_url: e.target.value})}
                    placeholder="https://"
                    className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-800"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 mt-2">
              <h5 className="font-outfit uppercase tracking-widest text-xs font-bold text-zinc-400 mb-4">Footer Settings</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Text</label>
                  <input 
                    type="text" 
                    value={embed.footer_text}
                    onChange={(e) => setEmbed({...embed, footer_text: e.target.value})}
                    className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-inter text-zinc-500 uppercase tracking-widest font-bold">Icon URL</label>
                  <input 
                    type="text" 
                    value={embed.footer_icon}
                    onChange={(e) => setEmbed({...embed, footer_icon: e.target.value})}
                    placeholder="https://"
                    className="bg-transparent border border-white/10 p-3 rounded text-white font-inter text-sm focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-2">
              {status.type && (
                <span className={clsx(
                  "text-xs font-inter uppercase tracking-widest flex items-center gap-2",
                  status.type === "success" ? "text-emerald-500" : "text-red-500"
                )}>
                  <span className={clsx("w-2 h-2 rounded-full", status.type === "success" ? "bg-emerald-500" : "bg-red-500")} />
                  {status.msg}
                </span>
              )}
              
              <button 
                type="submit"
                disabled={isSending}
                className="bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded text-white font-outfit font-semibold uppercase tracking-widest text-xs px-8 py-4 transition-colors cursor-pointer flex items-center gap-2 ml-auto">
                <Send className="w-4 h-4" />
                {isSending ? "Transmitting..." : "Execute Payload"}
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-6 sticky top-10">
          <div className="flex items-center gap-2 text-zinc-500">
            <LayoutTemplate className="w-5 h-5" />
            <h4 className="font-outfit uppercase tracking-widest text-xs font-bold">Live Preview</h4>
          </div>
          
          <div className="bg-[#313338] rounded flex flex-col p-4 w-full max-w-full">
            <div className="flex flex-col border-l-4 rounded bg-[#2b2d31] p-4 gap-2" style={{ borderColor: embed.color || "#1e1f22" }}>
              {(embed.author_name || embed.author_icon) && (
                <div className="flex items-center gap-2 mb-1">
                  {embed.author_icon && <img src={embed.author_icon} alt="author" className="w-6 h-6 rounded-full" />}
                  {embed.author_url ? (
                    <a href={embed.author_url} target="_blank" rel="noreferrer" className="text-white text-sm font-semibold hover:underline">
                      {embed.author_name || "Author"}
                    </a>
                  ) : (
                    <span className="text-white text-sm font-semibold">{embed.author_name}</span>
                  )}
                </div>
              )}
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  {embed.title && (
                    embed.url ? (
                      <a href={embed.url} target="_blank" rel="noreferrer" className="text-blue-400 font-semibold text-base break-words hover:underline">
                        {embed.title}
                      </a>
                    ) : (
                      <span className="text-white font-semibold text-base break-words">{embed.title}</span>
                    )
                  )}
                  {embed.description && (
                    <div className="text-zinc-300 text-sm discord-markdown break-words">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {embed.description}
                      </ReactMarkdown>
                    </div>
                  )}
                  
                  {fields.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 w-full">
                      {fields.map((f, i) => (
                        <div key={i} className={clsx("flex flex-col gap-1", f.inline ? "w-fit min-w-[30%] max-w-[45%]" : "w-full")}>
                          <span className="text-white text-sm font-semibold">{f.name || "Field Name"}</span>
                          <span className="text-zinc-300 text-sm discord-markdown break-words">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{f.value || "Field Value"}</ReactMarkdown>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {embed.thumbnail_url && (
                  <div className="shrink-0">
                    <img src={embed.thumbnail_url} alt="thumbnail" className="w-20 rounded" />
                  </div>
                )}
              </div>
              {embed.image_url && (
                <div className="mt-2 rounded overflow-hidden w-full max-w-full">
                  <img src={embed.image_url} alt="embed" className="w-full object-cover" />
                </div>
              )}
              {(embed.footer_text || embed.footer_icon) && (
                <div className="flex items-center gap-2 mt-2 pt-2 text-xs text-zinc-400 font-medium min-w-0">
                  {embed.footer_icon && <img src={embed.footer_icon} alt="footer" className="w-5 h-5 rounded-full shrink-0" />}
                  {embed.footer_text && <span className="break-words truncate whitespace-normal">{embed.footer_text}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
