// components/tabs/TransactionsTab.tsx
"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  Check, 
  Zap, 
  Crown, 
  ShieldCheck, 
  Receipt, 
  ArrowUpRight, 
  Clock,
  Sparkles
} from "lucide-react";

export const TransactionsTab = (props: any) => {
  const [isDark, setIsDark] = useState<boolean>(props?.params?.isDark ?? true);

  useEffect(() => {
    if (props?.params?.isDark !== undefined) {
      setIsDark(props.params.isDark);
    }
  }, [props?.params?.isDark]);

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");

  // پلن‌های اشتراک سامانه تور ۳۶۰ درجه
  const plans = [
    {
      id: "starter",
      name: "پلن پایه (مشاوران املاک نوپا)",
      priceMonthly: "۴۹۰,۰۰۰",
      priceYearly: "۴,۷۰۰,۰۰۰",
      desc: "مناسب برای مشاوران املاکی که به تازگی تورهای مجازی را شروع کرده‌اند.",
      features: [
        "تا ۳ تور ۳۶۰ درجه فعال",
        "پشتیبانی از پوینترهای متنی",
        "کد اشتراک‌گذاری Embed پایه",
        "پشتیبانی ایمیلی"
      ],
      icon: ShieldCheck,
      popular: false,
    },
    {
      id: "pro",
      name: "پلن حرفه‌ای (مشاوران املاک پیشرو)",
      priceMonthly: "۱,۲۰۰,۰۰۰",
      priceYearly: "۱۱,۵۰۰,۰۰۰",
      desc: "پرطرفدارترین پلن برای آژانس‌های املاک و گردشگری حرفه‌ای با قابلیت صوت و آمار.",
      features: [
        "پروژه‌های نامحدود تور ۳۶۰ درجه",
        "پوینترهای صوتی و متن اختصاصی",
        "گزارش زنده بازدید و کلیک در سایت مشتری",
        "بدون واترمارک سامانه",
        "پشتیبانی تلفنی و تلگرامی اختصاصی"
      ],
      icon: Zap,
      popular: true,
    },
    {
      id: "enterprise",
      name: "پلن سازمانی (آژانس‌های بزرگ)",
      priceMonthly: "۲,۹۰۰,۰۰۰",
      priceYearly: "۲۸,۰۰۰,۰۰۰",
      desc: "ویژه هلدینگ‌های بزرگ مسکن، خودروسازی و شرکت‌های گردشگری بزرگ.",
      features: [
        "تمام امکانات پلن حرفه‌ای",
        "دامنه اختصاصی (White-label)",
        "سرعت بارگذاری فوق‌العاده بالا (CDN اختصاصی)",
        "مدیر حساب اختصاصی و آموزش تیم"
      ],
      icon: Crown,
      popular: false,
    },
  ];

  // سابقه تراکنش‌ها و فاکتورها
  const pastInvoices = [
    { id: "INV-8421", date: "۱۴۰۲/۰۶/۱۸", plan: "اشتراک حرفه‌ای - ماهانه", amount: "۱,۲۰۰,۰۰۰ تومان", status: "موفق" },
    { id: "INV-7910", date: "۱۴۰۲/۰۵/۱۸", plan: "اشتراک حرفه‌ای - ماهانه", amount: "۱,۲۰۰,۰۰۰ تومان", status: "موفق" },
    { id: "INV-6542", date: "۱۴۰۲/۰۴/۱۸", plan: "پلن پایه - ماهانه", amount: "۴۹۰,۰۰۰ تومان", status: "موفق" },
  ];

  const handleSubscribe = (planName: string) => {
    alert(`تایید اشتراک: شما پلن "${planName}" را انتخاب کردید. در حال انتقال به درگاه بانکی امن...`);
  };

  return (
    <div className={`p-4 sm:p-6 h-full flex flex-col gap-6 overflow-y-auto custom-sidebar-scroll transition-colors duration-300 ${
      isDark ? "text-slate-100" : "text-slate-900"
    }`}>
      
      {/* هدر بخش مالی */}
      <div className={`border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark ? "border-white/10" : "border-slate-900/10"
      }`}>
        <div>
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500" />
            مدیریت اشتراک و تراکنش‌های مالی
          </h2>
          <p className={`text-[11px] mt-0.5 font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            پلن اشتراک سامانه خود را ارتقا دهید و سابقه پرداخت‌ها و فاکتورهای مالی را مشاهده کنید
          </p>
        </div>

        {/* وضعیت اشتراک فعلی */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold backdrop-blur-md ${
          isDark ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-amber-500/10 border-amber-500/30 text-amber-700 shadow-sm"
        }`}>
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>اشتراک فعال: پلن حرفه‌ای (۱۵ روز باقی‌مانده)</span>
        </div>
      </div>

      {/* انتخاب دوره پرداخت (ماهانه / سالانه با تخفیف) */}
      <div className="flex flex-col items-center justify-center gap-2 pt-2">
        <div className={`flex items-center p-1 rounded-2xl border backdrop-blur-md ${
          isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-slate-200 shadow-sm"
        }`}>
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              billingCycle === "monthly" 
                ? "bg-amber-500 text-slate-950 shadow" 
                : (isDark ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-950")
            }`}
          >
            پرداخت ماهانه
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === "yearly" 
                ? "bg-amber-500 text-slate-950 shadow" 
                : (isDark ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-950")
            }`}
          >
            <span>پرداخت سالانه</span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold">۲۰٪ تخفیف</span>
          </button>
        </div>
      </div>

      {/* کارت‌های پلن‌های اشتراک */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;
          const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

          return (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`rounded-3xl border p-6 flex flex-col justify-between gap-6 backdrop-blur-xl relative overflow-hidden transition-all duration-300 cursor-pointer shadow-xl ${
                plan.popular 
                  ? (isDark ? "border-amber-500/80 bg-gradient-to-b from-amber-500/10 via-white/5 to-white/0 ring-2 ring-amber-500/40" : "border-amber-500 bg-gradient-to-b from-amber-500/15 via-white/80 to-white/60 ring-2 ring-amber-500/40 shadow-md")
                  : (isDark ? "bg-white/5 border-white/10 hover:border-white/20" : "bg-white/60 border-slate-200/80 hover:bg-white/90")
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black py-1 text-center tracking-wider shadow">
                  پیشنهاد ویژه مشاوران املاک و تورها
                </div>
              )}

              <div className={`flex flex-col gap-4 ${plan.popular ? "pt-3" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-2xl border ${
                    isDark ? "bg-white/5 border-white/10 text-amber-400" : "bg-white border-slate-200 text-amber-600 shadow-sm"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    isSelected ? "bg-amber-500 text-slate-950" : (isDark ? "bg-white/10 text-slate-300" : "bg-slate-200 text-slate-700")
                  }`}>
                    {isSelected ? "انتخاب شده" : "قابل انتخاب"}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold mb-1">{plan.name}</h3>
                  <p className={`text-[11px] font-medium leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {plan.desc}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 pt-2 border-t border-white/10">
                  <span className="text-2xl font-black tracking-tight">{price}</span>
                  <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    تومان / {billingCycle === "monthly" ? "ماهانه" : "سالیانه"}
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className={isDark ? "text-slate-200" : "text-slate-700"}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscribe(plan.name);
                }}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${
                  plan.popular 
                    ? "bg-amber-500 text-slate-950 hover:bg-amber-400" 
                    : (isDark ? "bg-white/10 hover:bg-white/20 text-white border border-white/10" : "bg-slate-900 hover:bg-slate-800 text-white")
                }`}
              >
                <span>خرید و فعال‌سازی اشتراک</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* سابقه پرداخت‌ها و فاکتورها */}
      <div className={`rounded-2xl p-5 border backdrop-blur-xl flex flex-col gap-4 shadow-lg mt-4 ${
        isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-slate-200/80 shadow-sm"
      }`}>
        <div className="flex items-center justify-between border-b pb-3 border-white/10">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-extrabold">سابقه تراکنش‌ها و فاکتورهای پرداخت شده</h3>
          </div>
          <span className={`text-[10px] font-medium flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            <Clock className="w-3 h-3" />
            نمایش همه فاکتورها
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className={`border-b font-bold ${isDark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-600"}`}>
                <th className="pb-3 pr-2">شماره فاکتور</th>
                <th className="pb-3">تاریخ پرداخت</th>
                <th className="pb-3">عنوان اشتراک</th>
                <th className="pb-3">مبلغ پرداختی</th>
                <th className="pb-3 text-left pl-2">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pastInvoices.map((inv, idx) => (
                <tr key={idx} className={`transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-slate-100/60"}`}>
                  <td className="py-3.5 pr-2 font-mono font-bold text-amber-500">
                    {inv.id}
                  </td>
                  <td className={`py-3.5 font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    {inv.date}
                  </td>
                  <td className={`py-3.5 font-bold ${isDark ? "text-slate-200" : "text-slate-900"}`}>
                    {inv.plan}
                  </td>
                  <td className="py-3.5 font-bold font-mono">
                    {inv.amount}
                  </td>
                  <td className="py-3.5 text-left pl-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {inv.status}
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