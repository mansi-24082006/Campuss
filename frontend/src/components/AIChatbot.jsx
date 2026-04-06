import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, User, Sparkles, Loader2 } from "lucide-react";
import api from "@/lib/axios";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { 
      role: "model", 
      parts: [{ text: "Hello! I'm CampusBuzz Assistant. How can I help you today?" }] 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage("");
    
    // Update local history for UI
    const updatedHistory = [
      ...chatHistory,
      { role: "user", parts: [{ text: userMessage }] }
    ];
    setChatHistory(updatedHistory);
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", { 
        message: userMessage,
        history: chatHistory.slice(-10) // Send the last 10 messages for context
      });
      
      setChatHistory([
        ...updatedHistory,
        { role: "model", parts: [{ text: data.text }] }
      ]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setChatHistory([
        ...updatedHistory,
        { role: "model", parts: [{ text: "Sorry, I'm having trouble connecting. Please try again later." }] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <div className="absolute inset-0 rounded-full bg-indigo-400 blur-md opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
          <MessageSquare className="relative h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex h-[500px] w-80 md:w-96 flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-10 fade-in border border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-900 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold">Campus Assistant</h3>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 space-y-4">
            {chatHistory.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border
                  ${m.role === "user" ? "bg-white text-indigo-600 border-indigo-100" : "bg-indigo-600 text-white border-transparent"}`}>
                  {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`max-w-[75%] rounded-2xl p-3 text-sm shadow-sm
                  ${m.role === "user" 
                    ? "bg-indigo-600 text-white rounded-tr-none" 
                    : "bg-white text-slate-800 rounded-tl-none border border-slate-100"}`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{m.parts[0].text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <Bot size={14} />
                </div>
                <div className="bg-white border border-slate-100 text-slate-400 rounded-2xl rounded-tl-none p-3 shadow-sm">
                  <Loader2 className="animate-spin" size={16} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="border-t border-slate-100 bg-white p-3 flex gap-2"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm text-slate-800 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all font-bold"
            >
              <Send size={16} />
            </button>
          </form>
          <div className="bg-white px-4 pb-2 text-[10px] text-center text-slate-400">
            Powered by CampusBuzz Gemini AI
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
