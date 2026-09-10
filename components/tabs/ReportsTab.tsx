// components/tabs/ReportsTab.tsx
"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Eye, 
  Folder, 
  MapPin, 
  Volume2, 
  Building2, 
  Compass, 
  Store, 
  Car,
  CheckCircle2,
  MousePointerClick,
  Globe,
  Share2,
  Calendar
} from "lucide-react";

export const ReportsTab = (props: any) => {
  const [isDark, setIsDark] = useState<boolean>(props?.params?.isDark ?? true);

  useEffect(() => {
    if (props?.params?.isDark !== undefined) {
      setIsDark(props.params.isDark);
    }
  }, [props?.params?.isDark]);

  // اضافه کردن فیلتر بازه زمانی هماهنگ با تحلیل‌های دیتابیس
  const [timeRange, setTimeRange] = useState<"daily" | "monthly" | "yearly" | "all">("monthly");

  // داده‌های آماری نمونه متناسب با بازه زمانی انتخابی
  const statsSummary = [
    { title: "کل پروژه‌های ثبت‌شده", value: "۱۲ پروژه", change: "+۳ پروژه جدید", icon: Folder, color: "text-amber-500" },
    { title: "مجموع نقاط (Hotspots)", value: "۹۸ نقطه", change: "میانگین ۸.۱ در هر پروژه", icon: MapPin, color: "text-blue-500" },
    { title: "فایل‌های صوتی بارگذاری شده", value: "۶۴ صوت", change: "۶۵٪ کل پوینترها", icon: Volume2, color: "text-emerald-500" },
    { 
      title: timeRange === "daily" ? "بازدید امروز" : timeRange === "monthly" ? "بازدید این ماه" : timeRange === "yearly" ? "بازدید امسال" : "بازدید کل", 
      value: timeRange === "daily" ? "۸۵ بار" : timeRange === "monthly" ? "۱,۴۲۵ بار" : "۱۲,۸۰۰ بار", 
      change: "+۱۸٪ رشد نسبت به دوره قبل", 
      icon: Eye, 
      color: "text-purple-500" 
    },
  ];

  const categoryStats = [
    { label: "مسکونی و املاک", count: 5, percentage: 40, icon: Building2 },
    { label: "گردشگری و هتل‌داری", count: 3, percentage: 25, icon: Compass },
    { label: "تجاری و اداری", count: 2, percentage: 20, icon: Store },
    { label: "خودرو و وسایل نقلیه", count: 2, percentage: 15, icon: Car },
  ];

  const embedTrafficStats = [
    { projectName: "تور ۳۶۰ درجه پنتهاوس زعفرانیه", clientSite: "zafaraniyeh-melk.ir", views: timeRange === "daily" ? 25 : 640, clicks: timeRange === "daily" ? 8 : 180, status: "فعال" },
    { projectName: "مجموعه گردشگری و ویلای جنگلی نمک‌آبرود", clientSite: "namakabroud-villas.com", views: timeRange === "daily" ? 15 : 420, clicks: timeRange === "daily" ? 4 : 95, status: "فعال" },
    { projectName: "مجتمع تجاری و تفریحی رویال مال", clientSite: "royalmall-complex.com", views: timeRange === "daily" ? 12 : 365, clicks: timeRange === "daily" ? 5 : 110, status: "فعال" },
  ];

  return (
    <div className={`p-4 sm:p-6 h-full flex flex-col gap-6 overflow-y-auto custom-sidebar-scroll transition-colors duration-300 ${
      isDark ? "text-slate-100" : "text-slate-900"
    }`}>
      
      {/* هدر صفحه گزارشات و فیلتر زمان */}
      <div className={`border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark ? "border-white/10" : "border-slate-900/10"
      }`}>
        <div>
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            گزارشات و تحلیل‌های سامانه تور ۳۶۰ درجه
          </h2>
          <p className={`text-[11px] mt-0.5 font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            آمار جامع عملکرد پروژه‌ها، وضعیت دسته‌بندی‌ها و میزان تعامل کاربران بر اساس بازه زمانی
          </p>
        </div>

        {/* دکمه‌های انتخاب بازه زمانی (روزانه، ماهانه، سالانه، کل) */}
        <div className={`flex items-center p-1 rounded-2xl border backdrop-blur-md ${
          isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-slate-200 shadow-sm"
        }`}>
          <button
            onClick={() => setTimeRange("daily")}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              timeRange === "daily" ? "bg-amber-500 text-slate-950 shadow" : (isDark ? "text-slate-300 hover:text-white" : "text-slate-700")
            }`}
          >
            روزانه
          </button>
          <button
            onClick={() => setTimeRange("monthly")}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              timeRange === "monthly" ? "bg-amber-500 text-slate-950 shadow" : (isDark ? "text-slate-300 hover:text-white" : "text-slate-700")
            }`}
          >
            ماهانه
          </button>
          <button
            onClick={() => setTimeRange("yearly")}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              timeRange === "yearly" ? "bg-amber-500 text-slate-950 shadow" : (isDark ? "text-slate-300 hover:text-white" : "text-slate-700")
            }`}
          >
            سالانه
          </button>
          <button
            onClick={() => setTimeRange("all")}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              timeRange === "all" ? "bg-amber-500 text-slate-950 shadow" : (isDark ? "text-slate-300 hover:text-white" : "text-slate-700")
            }`}
          >
            همه
          </button>
        </div>
      </div>

      {/* کارت‌های آماری کلیدی */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsSummary.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index}
              className={`rounded-2xl p-4 border backdrop-blur-xl flex flex-col justify-between gap-3 shadow-lg relative overflow-hidden transition-all duration-300 ${
                isDark ? "bg-white/5 border-white/10 hover:border-white/20" : "bg-white/60 border-slate-200/80 shadow-sm hover:bg-white/90"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  {item.title}
                </span>
                <div className={`p-2 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xl font-black tracking-tight">{item.value}</span>
                <span className={`text-[10px] font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {item.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* نمودارها و دسته‌بندی‌ها */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className={`lg:col-span-7 rounded-2xl p-5 border backdrop-blur-xl flex flex-col gap-4 shadow-lg ${
          isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-slate-200/80 shadow-sm"
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-white/10">
            <h3 className="text-xs font-extrabold flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-500" />
              توزیع پروژه‌ها بر اساس نوع کاربری
            </h3>
          </div>

          <div className="flex flex-col gap-3.5 pt-2">
            {categoryStats.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-amber-500" />
                      <span>{cat.label}</span>
                    </div>
                    <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                      {cat.count} پروژه ({cat.percentage}%)
                    </span>
                  </div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-200/80 border-slate-300"}`}>
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500" style={{ width: `${cat.percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`lg:col-span-5 rounded-2xl p-5 border backdrop-blur-xl flex flex-col justify-between gap-4 shadow-lg ${
          isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-slate-200/80 shadow-sm"
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-white/10">
            <h3 className="text-xs font-extrabold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
              کیفیت و تکمیل محتوای تورها
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${isDark ? "bg-white/5 border-white/10" : "bg-white/50 border-slate-200"}`}>
              <span className="font-medium">پروژه‌های دارای فایل صوتی فعال</span>
              <span className="font-bold text-emerald-400">۸۳٪</span>
            </div>
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${isDark ? "bg-white/5 border-white/10" : "bg-white/50 border-slate-200"}`}>
              <span className="font-medium">پروژه‌های دارای توضیحات متنی کامل</span>
              <span className="font-bold text-amber-400">۹۲٪</span>
            </div>
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${isDark ? "bg-white/5 border-white/10" : "bg-white/50 border-slate-200"}`}>
              <span className="font-medium">پشتیبانی از کدهای iframe اشتراکی</span>
              <span className="font-bold text-blue-400">فعال (۱۰۰٪)</span>
            </div>
          </div>
        </div>
      </div>

      {/* جدول آمار بازدید لینک‌های Embed بر اساس فیلتر زمانی */}
      <div className={`rounded-2xl p-5 border backdrop-blur-xl flex flex-col gap-4 shadow-lg ${
        isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-slate-200/80 shadow-sm"
      }`}>
        <div className="flex items-center justify-between border-b pb-3 border-white/10">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-extrabold">آمار بازدید و کلیک لینک‌های اشتراکی در سایت مشتریان (ترافیک {timeRange === "daily" ? "امروز" : timeRange === "monthly" ? "این ماه" : timeRange === "yearly" ? "امسال" : "کل"})</h3>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${isDark ? "bg-white/10 text-slate-300" : "bg-slate-200 text-slate-700"}`}>
            همگام با جدول Analytics
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className={`border-b font-bold ${isDark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-600"}`}>
                <th className="pb-3 pr-2">نام پروژه</th>
                <th className="pb-3">سایت میزبان</th>
                <th className="pb-3 text-center">مجموع بازدید (Views)</th>
                <th className="pb-3 text-center">تعداد کلیک روی پوینترها</th>
                <th className="pb-3 text-left pl-2">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {embedTrafficStats.map((item, idx) => (
                <tr key={idx} className={`transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-slate-100/60"}`}>
                  <td className="py-3.5 pr-2 font-bold flex items-center gap-1.5 truncate">
                    <Share2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{item.projectName}</span>
                  </td>
                  <td className={`py-3.5 font-mono text-[11px] ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {item.clientSite}
                  </td>
                  <td className="py-3.5 text-center font-bold">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {item.views} بار
                    </span>
                  </td>
                  <td className="py-3.5 text-center font-bold">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center gap-1 w-max mx-auto">
                      <MousePointerClick className="w-3 h-3" />
                      {item.clicks} کلیک
                    </span>
                  </td>
                  <td className="py-3.5 text-left pl-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};