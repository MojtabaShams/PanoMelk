// components/searchbox/SearchBox.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';

export function SearchBox({ isDark }: { isDark: boolean }) {
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState({ current: 0, total: 0 });

  useEffect(() => {
    const handleSearchResults = (e: any) => {
      // فقط آمار تب فعال را دریافت و ثبت می‌کنیم
      setStats({ current: e.detail.current, total: e.detail.total });
    };
    window.addEventListener('graph-search-stats', handleSearchResults);
    return () => window.removeEventListener('graph-search-stats', handleSearchResults);
  }, []);

  const dispatchSearch = (text: string, direction?: 'next' | 'prev') => {
    window.dispatchEvent(new CustomEvent('graph-search-trigger', {
      detail: { query: text, direction }
    }));
  };

  const handleInputChange = (val: string) => {
    setQuery(val);
    dispatchSearch(val);
  };

  const clearSearch = () => {
    setQuery("");
    dispatchSearch("");
  };

  return (
    <div 
      className={`flex items-center h-9 rounded-full px-3.5 border transition-all duration-300 gap-2 my-auto backdrop-blur-md shadow-lg ${
        isDark 
          ? "bg-slate-900/40 border-white/10 text-slate-100 hover:bg-slate-900/60 focus-within:border-amber-500/50 focus-within:ring-2 focus-within:ring-amber-500/20" 
          : "bg-white/40 border-white/60 text-slate-900 hover:bg-white/60 focus-within:border-amber-500/50 focus-within:ring-2 focus-within:ring-amber-500/20 shadow-sm"
      }`}
    >
      <Search size={15} className={isDark ? "text-slate-400 shrink-0" : "text-slate-500 shrink-0"} />
      
      <input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="جستجو در تب فعال..."
        style={{ fontFamily: 'var(--font-iransans), sans-serif' }}
        className="bg-transparent text-xs focus:outline-none w-32 sm:w-44 placeholder:text-slate-400 font-medium"
      />

      {query && (
        <div className="flex items-center gap-1.5 shrink-0">
          <span 
            style={{ fontFamily: 'var(--font-iransans), sans-serif' }}
            className={`text-[10px] px-1.5 select-none shrink-0 rounded ${isDark ? "bg-white/5 text-slate-300" : "bg-black/5 text-slate-700"}`}
          >
            {stats.total > 0 ? `${stats.current}/${stats.total}` : '0/0'}
          </span>
          <button 
            onClick={() => dispatchSearch(query, 'prev')} 
            disabled={stats.total === 0} 
            className={`rounded p-1 transition-colors cursor-pointer disabled:opacity-30 ${isDark ? "hover:bg-white/10 text-slate-300" : "hover:bg-black/10 text-slate-700"}`}
            title="قبلی"
          >
            <ChevronUp size={14} />
          </button>
          <button 
            onClick={() => dispatchSearch(query, 'next')} 
            disabled={stats.total === 0} 
            className={`rounded p-1 transition-colors cursor-pointer disabled:opacity-30 ${isDark ? "hover:bg-white/10 text-slate-300" : "hover:bg-black/10 text-slate-700"}`}
            title="بعدی"
          >
            <ChevronDown size={14} />
          </button>
          <button 
            onClick={clearSearch} 
            className={`rounded p-1 transition-colors cursor-pointer ${isDark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-black/10 text-slate-500 hover:text-black"}`}
            title="پاک کردن"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}