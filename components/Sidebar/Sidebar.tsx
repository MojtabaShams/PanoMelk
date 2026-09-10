// components/Sidebar.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Power,
  Sun,
  Moon,
  Maximize,
  Minimize,
  Plus,
  ChevronRight,
  ChevronLeft,
  User,
  Settings,
  LucideIcon
} from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  component: string;
}

interface SidebarProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  menuItems: MenuItem[];
  activeTab: string;
  onOpenTab: (id: string, label: string, component: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isDark,
  setIsDark,
  isCollapsed,
  setIsCollapsed,
  isFullscreen,
  toggleFullscreen,
  menuItems,
  activeTab,
  onOpenTab,
}) => {
  const [showToolsMenu, setShowToolsMenu] = useState(false);

  return (
    <aside
      className={`h-[calc(100vh-1.5rem)] border rounded-3xl p-3 shadow-2xl backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between overflow-visible z-20 shrink-0 ${isCollapsed ? "w-20 px-2.5" : "w-56"
        } ${isDark
          ? "bg-slate-950/40 border-white/10 text-slate-100 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]"
          : "bg-white/20 border-white/40 text-slate-900 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]"
        }`}
    >
      {/* لوگو */}
      <div className="flex flex-col items-center relative pt-1 shrink-0">
        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
          <svg
            className={`absolute inset-0 w-full h-full transition-all duration-300 ${isDark ? "drop-shadow-[0_0_10px_rgba(245,158,11,0.65)]" : "drop-shadow-[0_2px_8px_rgba(217,119,6,0.35)]"
              }`}
            viewBox="0 0 100 100"
          >
            <path
              d="M 44 13 Q 50 9, 56 13 L 83 28 Q 89 31, 89 38 L 89 62 Q 89 69, 83 72 L 56 87 Q 50 91, 44 87 L 17 72 Q 11 69, 11 62 L 11 38 Q 11 31, 17 28 Z"
              className={isDark ? "fill-amber-500/10 stroke-amber-400" : "fill-amber-600 stroke-amber-700"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className={`relative z-10 w-6 h-6 flex items-center justify-center ${isDark ? "drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]" : "drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
            }`}>
            <Image
              src="/logo-white.png"
              alt="PanoMelk Logo"
              width={30}
              height={30}
              className={`object-contain ${isDark ? "filter brightness-125 sepia-[1] hue-rotate-[-10deg] saturate-[8]" : "brightness-0 invert"}`}
              priority
            />
          </div>
        </div>
      </div>

      {/* نوار ابزار */}
      {isCollapsed ? (
        <div className="mt-3 mb-2 flex flex-col items-center gap-2 relative shrink-0">
          <div
            className="relative"
            onMouseEnter={() => setShowToolsMenu(true)}
            onMouseLeave={() => setShowToolsMenu(false)}
          >
            <button
              onClick={() => setShowToolsMenu((prev) => !prev)}
              className={`p-2.5 rounded-2xl transition-all duration-300 cursor-pointer ${isDark
                  ? "bg-white/5 border border-white/10 text-slate-300 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/30"
                  : "bg-white/40 border border-white/60 text-slate-700 hover:bg-amber-500/20 hover:text-amber-800 hover:border-amber-500/40"
                }`}
              title="ابزارها و تنظیمات"
            >
              <Settings className="w-4 h-4 transition-transform duration-500 hover:rotate-90" />
            </button>

            {showToolsMenu && (
              <div className="absolute right-full top-0 pr-2 z-50">
                <div
                  className={`p-1.5 rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-col gap-1 min-w-[150px] animate-in fade-in zoom-in-95 duration-200 ${isDark
                      ? "bg-slate-900/95 border-white/15 text-slate-100 shadow-black/60"
                      : "bg-white/95 border-white/80 text-slate-900 shadow-slate-400/30"
                    }`}
                >
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className={`p-2 rounded-xl flex items-center gap-2 text-xs transition-colors whitespace-nowrap cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                      }`}
                  >
                    {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                    <span>{isDark ? "تم روشن" : "تم تاریک"}</span>
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className={`p-2 rounded-xl flex items-center gap-2 text-xs transition-colors whitespace-nowrap cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                      }`}
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    <span>{isFullscreen ? "خروج از تمام‌صفحه" : "تمام صفحه"}</span>
                  </button>

                  <div className={`h-[1px] my-0.5 ${isDark ? "bg-white/10" : "bg-black/10"}`} />

                  <Link
                    href="/login"
                    className="p-2 rounded-xl flex items-center gap-2 text-xs transition-colors text-rose-500 hover:bg-rose-500/10 whitespace-nowrap cursor-pointer"
                  >
                    <Power className="w-4 h-4" />
                    <span>خروج</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(false)}
            className={`p-2.5 rounded-2xl transition-all cursor-pointer ${isDark
                ? "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                : "bg-white/40 border border-white/60 text-slate-700 hover:bg-white/60 hover:text-black"
              }`}
            title="باز کردن سایدبار"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className={`mt-4 mb-3 transition-all -mx-3 px-3 py-2 flex items-center justify-around shrink-0 ${isDark ? "bg-white/5 border-y border-white/5" : "bg-white/20 border-y border-white/30"
          }`}>
          <Link
            href="/login"
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${isDark ? "hover:bg-white/10 text-slate-300 hover:text-white" : "hover:bg-black/10 text-slate-700 hover:text-black"
              }`}
            title="خروج از حساب"
          >
            <Power className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${isDark ? "hover:bg-white/10 text-slate-300 hover:text-white" : "hover:bg-black/10 text-slate-700 hover:text-black"
              }`}
            title="تغییر تم"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${isDark ? "hover:bg-white/10 text-slate-300 hover:text-white" : "hover:bg-black/10 text-slate-700 hover:text-black"
              }`}
            title="تمام صفحه"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsCollapsed(true)}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${isDark ? "hover:bg-white/10 text-slate-300 hover:text-white" : "hover:bg-black/10 text-slate-700 hover:text-black"
              }`}
            title="جمع کردن"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* منوی اصلی */}
      <div className="flex-1 flex flex-col gap-2 pt-4 pb-1 overflow-y-auto pl-1 custom-sidebar-scroll">
        <button
          onClick={() => onOpenTab("newProject", "ایجاد پروژه جدید", "newProject")}
          className={`w-full rounded-2xl py-2.5 flex items-center justify-center gap-2 font-bold transition-all shadow-md group relative overflow-hidden shrink-0 cursor-pointer ${isCollapsed ? "px-0" : "px-3"
            } ${isDark
              ? "bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950"
              : "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950"
            }`}
        >
          <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
          {!isCollapsed && <span className="text-xs font-bold whitespace-nowrap">ایجاد پروژه جدید</span>}
        </button>

        <nav className="flex flex-col gap-1 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onOpenTab(item.id, item.label, item.component)}
                className={`w-full flex items-center gap-2.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${isCollapsed ? "justify-center px-0" : "justify-start px-3"
                  } ${isActive
                    ? (isDark ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold" : "bg-amber-500/25 text-slate-950 border border-amber-500/50 font-black")
                    : (isDark ? "text-slate-300 hover:bg-white/5 hover:text-slate-100" : "text-slate-700 hover:bg-white/20 hover:text-slate-900")
                  }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? (isDark ? "text-amber-400" : "text-slate-950") : ""}`} />
                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* کارت کاربر */}
      <div
        onClick={() => onOpenTab("profile", "پروفایل کاربری", "profile")}
        className={`mt-auto transition-all flex items-center shrink-0 cursor-pointer group ${isCollapsed
            ? "justify-center p-0 border-0 bg-transparent"
            : "justify-between p-2 rounded-2xl border " + (isDark ? "bg-white/5 border-white/10 hover:border-amber-500/40" : "bg-white/30 border-white/40 hover:border-amber-500/50")
          }`}
        title="مشاهده و ویرایش پروفایل"
      >
        <div className={`flex items-center gap-2 overflow-hidden ${isCollapsed ? "justify-center w-full" : ""}`}>
          <div className={`rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 transition-all group-hover:scale-105 ${isCollapsed ? "w-10 h-10" : "w-8 h-8"
            }`}>
            <User className={`w-4 h-4 ${isDark ? "text-amber-400" : "text-amber-600"}`} />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden text-right">
              <span className={`text-xs font-bold truncate group-hover:text-amber-500 transition-colors ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                علی محمدی
              </span>
              <span className={`text-[10px] truncate dir-ltr text-right ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                ali@panomelk.com
              </span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            className={`p-1 rounded-lg transition-colors shrink-0 cursor-pointer ${isDark ? "hover:bg-white/10 text-slate-300 group-hover:text-amber-400" : "hover:bg-black/10 text-slate-700 group-hover:text-amber-600"
              }`}
            title="تنظیمات کاربر"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </button>
        )}
      </div>

    </aside>
  );
};