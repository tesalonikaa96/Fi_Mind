"use client";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, BookOpen, Mic, Code, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: "Hello! I'm your Fi-Mind Study Buddy. I can help you brainstorm speech ideas, analyze literary theories, debug your code, or just chat if you're feeling overwhelmed. What are we working on today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Saran pertanyaan cepat
  const quickPrompts = [
    { icon: <BookOpen className="h-4 w-4" />, text: "Analyze a short story" },
    { icon: <Mic className="h-4 w-4" />, text: "Brainstorm speech topics" },
    { icon: <Sparkles className="h-4 w-4" />, text: "Explain Universal Grammar" },
    { icon: <Code className="h-4 w-4" />, text: "Help me fix a Streamlit error" },
  ];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Tambahkan pesan user ke layar
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsLoading(true);

    // Simulasi delay balasan AI (Nanti ini diganti dengan API sungguhan)
    setTimeout(() => {
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm currently running in simulation mode, but I've noted your request! Once we connect the AI backend, I'll be able to give you a full analysis and break down complex concepts step-by-step. Keep up the great work!",
      };
      setMessages((prev) => [...prev, newAiMsg]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden m-4">
      
      {/* ── Header ── */}
      <div className="flex items-center gap-4 border-b border-slate-100 bg-white px-8 py-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-500 shadow-sm shadow-teal-100">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">AI Study Buddy</h1>
          <p className="text-sm text-slate-500">Your 24/7 academic and wellness companion</p>
        </div>
      </div>

      {/* ── Area Obrolan (Chat History) ── */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              msg.role === "assistant" ? "bg-teal-100 text-teal-600" : "bg-sky-500 text-white"
            }`}>
              {msg.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </div>

            {/* Bubble Chat */}
            <div className={`max-w-[75%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
              msg.role === "user" 
                ? "bg-sky-500 text-white rounded-br-none" 
                : "bg-white border border-slate-100 text-slate-700 rounded-bl-none"
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-600">
              <Bot className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex gap-1 rounded-2xl bg-white border border-slate-100 px-5 py-4 rounded-bl-none shadow-sm">
              <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Area Input & Quick Prompts ── */}
      <div className="border-t border-slate-100 bg-white p-6">
        
        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt.text)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
              >
                {prompt.icon}
                {prompt.text}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }} 
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-teal-300 focus-within:ring-2 focus-within:ring-teal-50 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your study buddy anything..."
            className="flex-1 bg-transparent px-4 py-2 text-slate-700 outline-none placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-white shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-slate-400">
          AI can make mistakes. Consider verifying important academic information.
        </p>
      </div>
    </div>
  );
}