// components/tabs/HomeTab.tsx
"use client";

import React, { useState, useEffect } from "react";
import { 
  Folder, 
  Trash2, 
  Eye, 
  Edit3, 
  Check, 
  Calendar,
  Share2,
  Building,
  Search,
  ChevronUp,
  ChevronDown,
  X
} from "lucide-react";

export interface Project {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  createdAt: string;
  hotspotsCount: number;
  description: string;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "تور ۳۶۰ درجه پنتهاوس زعفرانیه",
    category: "real-estate",
    categoryLabel: "مشاوران املاک (مسکونی)",
    createdAt: "۱۴۰۲/۰۶/۱۸ - ۱۴:۳۰",
    hotspotsCount: 8,
    description: "نمایش کامل سالن پذیرایی، اتاق خواب مستر و بالکن با قابلیت پخش صوت راهنما."
  },
  {
    id: "proj-2",
    name: "مجموعه گردشگری و ویلای جنگلی نمک‌آبرود",
    category: "tourism",
    categoryLabel: "تورهای مسافرتی و گردشگری",
    createdAt: "۱۴۰۲/۰۶/۱۵ - ۰۹:۱۵",
    hotspotsCount: 12,
    description: "تور مجازی فضاهای داخلی و محوطه باز ویلا به همراه پوینترهای اطلاعاتی."
  },
  {
    id: "proj-3",
    name: "مجتمع تجاری و تفریحی رویال مال",
    category: "commercial",
    categoryLabel: "مراکز تجاری و اداری",
    createdAt: "۱۴۰۲/۰۶/۱۲ - ۱۸:۰۰",
    hotspotsCount: 15,
    description: "بازدید مجازی از طبقات تجاری، فودکورت و پارکینگ هوشمند."
  },
];

// تابع کمکی برای هایلایت کردن متن‌های جستجو شده
function highlightText(text: string, query: string, isDark: boolean) {
  if (!query.trim()) return text;

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => 
    regex.test(part) ? (
      <span 
        key={i} 
        className={`font-extrabold px-1 rounded mx-0.5 ${
          isDark 
            ? "bg-amber-500/40 text-amber-300 ring-1 ring-amber-500 shadow-sm" 
            : "bg-amber-300 text-slate-950 ring-1 ring-amber-500 shadow-sm"
        }`}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}

export const HomeTab = (props: any) => {
  const [isDark, setIsDark] = useState<boolean>(props?.params?.isDark ?? true);

  useEffect(() => {
    if (props?.params?.isDark !== undefined) {
      setIsDark(props.params.isDark);
    }
  }, [props?.params?.isDark]);

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredProjects = projects.filter((proj) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      proj.name.toLowerCase().includes(query) ||
      proj.description.toLowerCase().includes(query) ||
      proj.categoryLabel.toLowerCase().includes(query)
    );
  });

  const total = filteredProjects.length;
  const current = total > 0 ? (activeIndex % total) + 1 : 0;

  const handleNext = () => {
    if (total > 0) {
      setActiveIndex((prev) => (prev + 1) % total);
    }
  };

  const handlePrev = () => {
    if (total > 0) {
      setActiveIndex((prev) => (prev - 1 + total) % total);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`آیا از حذف پروژه "${name}" مطمئن هستید؟`)) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handlePreview = (projectId: string) => {
    window.open(`/preview/${projectId}`, "_blank");
  };

  const handleCopyEmbedLink = (projectId: string) => {
    const embedCode = `<iframe src="${window.location.origin}/embed/${projectId}" width="100%" height="500px" frameborder="0" allowfullscreen></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopiedId(projectId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className={`p-4 sm:p-6 h-full flex flex-col gap-6 overflow-y-auto custom-sidebar-scroll transition-colors duration-300 ${
      isDark ? "text-slate-100" : "text-slate-900"
    }`}>
      {/* هدر صفحه همراه با سرچ‌باکس داخلی */}
      <div className={`border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark ? "border-white/10" : "border-slate-900/10"
      }`}>
        <div>
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <Folder className="w-5 h-5 text-amber-500" />
            پروژه‌های من (تورهای ۳۶۰ درجه و املاک)
          </h2>
          <p className={`text-[11px] mt-0.5 font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            فهرست پیش‌نمایش پروژه‌های آماده شده شما برای ارائه به مشتریان
          </p>
        </div>

        {/* سرچ‌باکس اختصاصی صفحه */}
        <div 
          className={`flex items-center h-9 rounded-full px-3.5 border transition-all duration-300 gap-2 backdrop-blur-md shadow-lg shrink-0 ${
            isDark 
              ? "bg-slate-900/40 border-white/10 text-slate-100 hover:bg-slate-900/60 focus-within:border-amber-500/50" 
              : "bg-white/40 border-white/60 text-slate-900 hover:bg-white/60 focus-within:border-amber-500/50 shadow-sm"
          }`}
        >
          <Search size={15} className={isDark ? "text-slate-400 shrink-0" : "text-slate-500 shrink-0"} />
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="جستجو در پروژه‌ها..."
            style={{ fontFamily: 'var(--font-iransans), sans-serif' }}
            className="bg-transparent text-xs focus:outline-none w-32 sm:w-44 placeholder:text-slate-400 font-medium"
          />

          {searchQuery && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span 
                style={{ fontFamily: 'var(--font-iransans), sans-serif' }}
                className={`text-[10px] px-1.5 select-none shrink-0 rounded ${isDark ? "bg-white/5 text-slate-300" : "bg-black/5 text-slate-700"}`}
              >
                {total > 0 ? `${current}/${total}` : '0/0'}
              </span>
              <button 
                onClick={handlePrev} 
                disabled={total === 0} 
                className={`rounded p-1 transition-colors cursor-pointer disabled:opacity-30 ${isDark ? "hover:bg-white/10 text-slate-300" : "hover:bg-black/10 text-slate-700"}`}
                title="قبلی"
              >
                <ChevronUp size={14} />
              </button>
              <button 
                onClick={handleNext} 
                disabled={total === 0} 
                className={`rounded p-1 transition-colors cursor-pointer disabled:opacity-30 ${isDark ? "hover:bg-white/10 text-slate-300" : "hover:bg-black/10 text-slate-700"}`}
                title="بعدی"
              >
                <ChevronDown size={14} />
              </button>
              <button 
                onClick={() => { setSearchQuery(""); setActiveIndex(0); }} 
                className={`rounded p-1 transition-colors cursor-pointer ${isDark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-black/10 text-slate-500 hover:text-black"}`}
                title="پاک کردن"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* لیست کارت‌ها با زبانه فولدر */}
      {filteredProjects.length === 0 ? (
        <div className={`flex flex-col items-center justify-center p-8 border border-dashed rounded-2xl text-center ${
          isDark ? "bg-white/5 border-white/10 text-slate-400" : "bg-white/40 border-slate-300 text-slate-600"
        }`}>
          <Folder className="w-10 h-10 text-amber-500 mb-2 opacity-70" />
          <p className="text-xs font-bold">هیچ پروژه‌ای با عبارت مورد نظر یافت نشد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {filteredProjects.map((proj, index) => {
            const isThisCopied = copiedId === proj.id;
            const isHighlighted = searchQuery.trim() !== "" && index === (activeIndex % filteredProjects.length);

            return (
              <div 
                key={proj.id}
                className={`relative flex flex-col pt-9 group transition-all duration-300 ${
                  isHighlighted ? "ring-4 ring-amber-500 shadow-2xl scale-[1.02] rounded-2xl" : ""
                }`}
              >
                {/* زبانه فولدر */}
                <div className={`absolute top-0 right-0 left-6 h-9 rounded-t-xl px-4 flex items-center justify-start gap-2.5 border-t border-x shadow-md transition-all duration-300 z-0 ${
                  isDark 
                    ? "bg-gradient-to-br from-white/10 via-white/5 to-white/0 border-white/15 text-white shadow-black/30" 
                    : "bg-gradient-to-br from-white/90 via-white/60 to-white/40 border-white/80 text-slate-900 shadow-slate-200"
                }`}>
                  <Folder className="w-4 h-4 text-amber-500 fill-amber-500/20 shrink-0" />
                  <h3 className="text-xs font-extrabold tracking-tight truncate flex-1 text-right" title={proj.name}>
                    {highlightText(proj.name, searchQuery, isDark)}
                  </h3>
                </div>

                {/* بدنه کارت */}
                <div className={`rounded-2xl rounded-tr-none p-5 pt-6 border shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between gap-6 min-h-[220px] transition-all duration-300 z-10 ${
                  isDark 
                    ? "bg-gradient-to-br from-white/10 via-white/5 to-white/0 border-white/15 text-white shadow-black/40" 
                    : "bg-gradient-to-br from-white/80 via-white/50 to-white/30 border-white/80 text-slate-900 shadow-slate-200"
                }`}>
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="flex flex-col gap-3 z-10">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 border border-amber-500/40 text-amber-500 flex items-center gap-1 shadow-sm">
                        <Building className="w-2.5 h-2.5" />
                        {highlightText(proj.categoryLabel, searchQuery, isDark)}
                      </span>

                      <span className={`text-[10px] font-medium flex items-center gap-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        <Calendar className="w-3 h-3 text-amber-500" />
                        {proj.createdAt}
                      </span>
                    </div>

                    <p className={`text-[11px] leading-relaxed font-normal line-clamp-3 mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      {highlightText(proj.description, searchQuery, isDark)}
                    </p>
                  </div>

                  <div className={`pt-3 border-t flex items-center justify-between gap-2 z-10 ${
                    isDark ? "border-white/10" : "border-slate-900/10"
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePreview(proj.id)}
                        className="px-2.5 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-[10px] flex items-center gap-1 hover:bg-amber-400 transition-all shadow-sm cursor-pointer"
                        title="پیش‌نمایش تور ۳۶۰ درجه"
                      >
                        <Eye className="w-3 h-3" />
                        <span>پیش‌نمایش</span>
                      </button>

                      <button
                        onClick={() => alert("قابلیت ویرایش در حال توسعه است")}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isDark ? "bg-white/5 border-white/10 hover:bg-white/10 text-slate-200" : "bg-white/60 border-slate-200 hover:bg-white text-slate-800 shadow-sm"
                        }`}
                        title="ویرایش پروژه"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => handleDelete(proj.id, proj.name)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isDark ? "bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400" : "bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-600"
                        }`}
                        title="حذف پروژه"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div>
                      <button
                        onClick={() => handleCopyEmbedLink(proj.id)}
                        className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isThisCopied
                            ? "bg-emerald-500 border-emerald-500 text-slate-950 shadow"
                            : (isDark ? "bg-white/5 border-white/10 hover:bg-white/10 text-slate-200" : "bg-white/60 border-slate-200 hover:bg-white text-slate-800 shadow-sm")
                        }`}
                        title="کپی لینک اشتراک‌گذاری iframe"
                      >
                        {isThisCopied ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3 text-amber-500" />}
                        <span>{isThisCopied ? "کپی شد!" : "اشتراک‌گذاری"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};