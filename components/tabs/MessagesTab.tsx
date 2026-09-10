// components/tabs/MessagesTab.tsx
"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Plus, 
  Send, 
  Tag, 
  HelpCircle, 
  AlertCircle, 
  Briefcase, 
  Clock
} from "lucide-react";

interface MessageItem {
  id: string;
  subject: string;
  category: string;
  categoryLabel: string;
  date: string;
  status: "active" | "resolved" | "pending";
  messages: {
    id: string;
    sender: "user" | "support";
    senderName: string;
    text: string;
    time: string;
  }[];
}

const CATEGORIES = [
  { id: "criticism", label: "انتقاد و پیشنهاد", icon: AlertCircle, color: "text-amber-500 bg-amber-500/10 border-amber-500/30" },
  { id: "request", label: "درخواست امکانات", icon: Briefcase, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" },
  { id: "support", label: "پشتیبانی فنی و مالی", icon: HelpCircle, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30" },
  { id: "other", label: "سایر موضوعات", icon: Tag, color: "text-purple-500 bg-purple-500/10 border-purple-500/30" },
];

export const MessagesTab = (props: any) => {
  const [isDark, setIsDark] = useState<boolean>(props?.params?.isDark ?? true);

  useEffect(() => {
    if (props?.params?.isDark !== undefined) {
      setIsDark(props.params.isDark);
    }
  }, [props?.params?.isDark]);

  const [conversations, setConversations] = useState<MessageItem[]>([
    {
      id: "msg-1",
      subject: "درخواست افزودن خروجی متری در تور ۳۶۰",
      category: "request",
      categoryLabel: "درخواست امکانات",
      date: "۱۴۰۲/۰۶/۱۵ - ۱۰:۳۰",
      status: "active",
      messages: [
        { id: "m1", sender: "user", senderName: "شما", text: "سلام، آیا امکان اضافه کردن ابزار اندازه‌گیری متری به پوینترها وجود داره؟", time: "۱۰:۳۰" },
        { id: "m2", sender: "support", senderName: "تیم پشتیبانی طراحان", text: "سلام کاربر عزیز. این قابلیت در نقشه راه توسعه قرار داره و انشالله تا ماه آینده اضافه میشه.", time: "۱۱:۱۵" }
      ]
    },
    {
      id: "msg-2",
      subject: "انقضای لینک اشتراک‌گذاری پروژه",
      category: "support",
      categoryLabel: "پشتیبانی فنی و مالی",
      date: "۱۴۰۲/۰۶/۱۲ - ۱۶:۴۰",
      status: "resolved",
      messages: [
        { id: "m3", sender: "user", senderName: "شما", text: "لینک پروژه اولم برای کارفرما باز نمیشه، خطای اکسپایر میده.", time: "۱۶:۴۰" },
        { id: "m4", sender: "support", senderName: "پشتیبانی فنی", text: "سلام، لطفا کش مرورگر رو پاک کنید یا لینک جدید رو از بخش تنظیمات پروژه کپی کنید. مشکل حل شد.", time: "۱۷:۰۲" }
      ]
    }
  ]);

  const [activeConvId, setActiveConvId] = useState<string>("msg-1");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("request");
  const [newText, setNewText] = useState("");
  const [replyText, setReplyText] = useState("");

  const activeConversation = conversations.find(c => c.id === activeConvId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConvId) return;

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConvId) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            { id: `m-${Date.now()}`, sender: "user", senderName: "شما", text: replyText, time: "همین الان" }
          ]
        };
      }
      return conv;
    }));

    setReplyText("");
  };

  return (
    <div className={`p-6 h-full flex flex-col gap-5 overflow-hidden transition-colors duration-300 ${
      isDark ? "text-slate-100" : "text-slate-900"
    }`}>
      <div className="flex items-center justify-between border-b pb-4 shrink-0 border-white/10">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-amber-500" />
            مرکز پیام‌ها و پشتیبانی سامانه
          </h2>
          <p className={`text-xs mt-1 font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            ارسال تیکت‌های پشتیبانی، انتقادات و پیگیری درخواست‌های توسعه پنل.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>تیکت / پیام جدید</span>
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-hidden">
        {/* لیست گفتگوها */}
        <div className={`lg:col-span-5 rounded-3xl border flex flex-col overflow-hidden backdrop-blur-md ${
          isDark ? "bg-white/5 border-white/10" : "bg-white/40 border-white/60 shadow-sm"
        }`}>
          <div className="flex-1 overflow-y-auto custom-sidebar-scroll p-3 flex flex-col gap-2">
            {conversations.map((conv) => {
              const isSelected = activeConvId === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 relative ${
                    isSelected 
                      ? (isDark ? "bg-amber-500/20 border-amber-500 text-white shadow-md ring-1 ring-amber-500/40" : "bg-amber-500/20 border-amber-500 text-slate-950 shadow-md ring-1 ring-amber-500/40")
                      : (isDark ? "bg-white/5 border-white/10 hover:bg-white/10 text-slate-200" : "bg-white/60 border-white/80 hover:bg-white text-slate-800 shadow-sm")
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 border border-white/10">
                      {conv.categoryLabel}
                    </span>
                    <span className="text-[10px] opacity-60 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {conv.date}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold leading-snug">
                    {conv.subject}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* محتوای گفتگو */}
        <div className={`lg:col-span-7 rounded-3xl border flex flex-col overflow-hidden backdrop-blur-md ${
          isDark ? "bg-white/5 border-white/10" : "bg-white/40 border-white/60 shadow-sm"
        }`}>
          {activeConversation ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">{activeConversation.subject}</h3>
                  <span className="text-[10px] opacity-65">{activeConversation.categoryLabel}</span>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                  activeConversation.status === "active" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}>
                  {activeConversation.status === "active" ? "فعال و در جریان" : "بسته شده"}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto custom-sidebar-scroll p-4 flex flex-col gap-3">
                {activeConversation.messages.map((msg) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div key={msg.id} className={`flex flex-col max-w-[80%] ${isUser ? "self-end items-end" : "self-start items-start"}`}>
                      <span className="text-[10px] opacity-60 mb-1 px-1">{msg.senderName} • {msg.time}</span>
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                        isUser 
                          ? (isDark ? "bg-amber-500/20 border-amber-500/30 text-amber-200" : "bg-amber-500/20 border-amber-500/40 text-slate-900 shadow-sm")
                          : (isDark ? "bg-white/10 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800 shadow-sm")
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`p-3.5 border-t ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/30"}`}>
                <form onSubmit={handleSendReply} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="پاسخ خود را بنویسید..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className={`flex-1 border rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all font-medium ${
                      isDark ? "bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-amber-500" : "bg-white/60 border-white/80 text-slate-900 placeholder:text-slate-500 focus:border-amber-500 shadow-sm"
                    }`}
                  />
                  <button type="submit" className="p-2.5 bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 transition-all shadow-md cursor-pointer flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className={`flex-1 flex flex-col items-center justify-center p-6 text-center ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              <MessageSquare className="w-12 h-12 mb-3 stroke-1 text-amber-500 opacity-50" />
              <p className="text-sm font-bold">گفتگویی انتخاب نشده است</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};