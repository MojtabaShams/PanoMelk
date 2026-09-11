// app/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Sun, Moon, User, Phone, CircleUserRound, X } from "lucide-react";
import localFont from "next/font/local";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const iranSans = localFont({
  src: [
    { path: "../public/fonts/IRANSansWeb(FaNum).woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/IRANSansWeb(FaNum).woff", weight: "400", style: "normal" },
  ],
  variable: "--font-iransans",
});

const bgImageDark = "/back-dark.jpg";
const bgImageLight = "/back-white.jpg";

type AuthStep = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<AuthStep>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isDark, setIsDark] = useState(true);

  // استیت برای کنترل باز و بسته شدن مودال قوانین
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // فیلدهای فرم
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // ارورهای اعتبارسنجی
  const [emailError, setEmailError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [registerEmailError, setRegisterEmailError] = useState("");
  const [termsError, setTermsError] = useState("");

  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      toast("نشست شما منقضی شده است، لطفاً دوباره وارد شوید.", {
        icon: '⚠️',
        className: "bg-amber-500 text-slate-950 font-bold text-xs rounded-xl",
      });
    }
  }, [searchParams]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!email.trim()) {
      setEmailError("لطفاً آدرس ایمیل خود را وارد کنید");
      hasError = true;
    }

    if (!password) {
      setPasswordError("لطفاً رمز عبور را وارد کنید");
      hasError = true;
    }

    if (hasError) {
      toast.error("لطفاً فیلدهای خالی را پر کنید.", {
        className: "bg-red-500 text-white font-bold text-xs rounded-xl",
      });
      return;
    }

    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);
    if (result?.error) {
      toast.error(result.error || "خطا در ورود به حساب کاربری", {
        className: "bg-red-500 text-white font-bold text-xs rounded-xl",
      });
    } else {
      toast.success("ورود با موفقیت انجام شد!", {
        className: "bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl",
      });
      router.push("/dashboard");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!fullName.trim()) {
      setFullNameError("لطفاً نام و نام خانوادگی خود را وارد کنید");
      hasError = true;
    } else {
      setFullNameError("");
    }

    if (!username.trim()) {
      setUsernameError("لطفاً نام کاربری خود را وارد کنید");
      hasError = true;
    } else {
      setUsernameError("");
    }

    if (!phone.trim()) {
      setPhoneError("لطفاً شماره همراه خود را وارد کنید");
      hasError = true;
    } else {
      setPhoneError("");
    }

    if (!email.trim()) {
      setRegisterEmailError("لطفاً آدرس ایمیل خود را وارد کنید");
      hasError = true;
    } else {
      setRegisterEmailError("");
    }

    if (password.length < 8) {
      setPasswordError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (!acceptTerms) {
      setTermsError("لطفاً قوانین و مقررات سایت را بپذیرید");
      hasError = true;
    } else {
      setTermsError("");
    }

    if (hasError) {
      toast.error("لطفاً خطاهای فرم ثبت‌نام را برطرف کنید.", {
        className: "bg-red-500 text-white font-bold text-xs rounded-xl",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, username, phone, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطا در ثبت‌نام کاربر.", {
          className: "bg-red-500 text-white font-bold text-xs rounded-xl",
        });
        return;
      }

      toast.success("ثبت‌نام با موفقیت انجام شد. اکنون می‌توانید وارد شوید.", {
        className: "bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl",
      });

      setPassword("");
      setStep("login");
    } catch (err) {
      toast.error("خطا در ارتباط با سرور.", {
        className: "bg-red-500 text-white font-bold text-xs rounded-xl",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getHeaderTitle = () => {
    switch (step) {
      case "login": return "خوش آمدید";
      case "register": return "ایجاد حساب کاربری";
    }
  };

  return (
    <div className={`${iranSans.className} min-h-screen h-screen w-full flex items-start justify-center md:justify-end p-4 relative overflow-y-auto overflow-x-hidden transition-colors duration-500 ${isDark ? "bg-[#07080C]" : "bg-slate-200"}`}>
      <Toaster position="top-center" />

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url('${isDark ? bgImageDark : bgImageLight}')` }}
      >
        <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? "bg-[#07080C]/50 backdrop-blur-[2px]" : "bg-slate-900/10 backdrop-blur-sm"}`} />
      </div>

      <div className="relative w-full max-w-[380px] min-h-[calc(100vh-2rem)] h-auto z-10 md:mr-10">
        <div
          dir="rtl"
          className={`w-full min-h-[calc(100vh-2rem)] h-auto flex flex-col justify-between border rounded-3xl p-5 shadow-2xl backdrop-blur-2xl transition-all duration-500 overflow-visible ${isDark
            ? "bg-slate-950/40 border-white/10 text-slate-100 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]"
            : "bg-white/30 border-white/50 text-slate-900 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]"
            }`}
        >

          {/* هدر */}
          <div className="relative flex flex-col items-center pt-1">
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className={`absolute top-0 right-0 p-1.5 rounded-full transition-colors cursor-pointer ${isDark ? "text-slate-300 hover:text-amber-400 hover:bg-white/10" : "text-slate-800 hover:text-amber-600 hover:bg-white/40"}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {step !== "login" && (
              <button
                type="button"
                onClick={() => setStep("login")}
                className={`absolute top-0 left-0 p-1.5 rounded-full transition-colors cursor-pointer ${isDark ? "text-slate-300 hover:text-amber-400 hover:bg-white/10" : "text-slate-800 hover:text-amber-600 hover:bg-white/40"}`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <div className="relative w-16 h-16 mb-1 flex items-center justify-center">
              <svg className={`absolute inset-0 w-full h-full transition-all duration-300 ${isDark ? "drop-shadow-[0_0_12px_rgba(245,158,11,0.65)]" : "drop-shadow-[0_4px_12px_rgba(217,119,6,0.35)]"}`} viewBox="0 0 100 100">
                <path d="M 44 13 Q 50 9, 56 13 L 83 28 Q 89 31, 89 38 L 89 62 Q 89 69, 83 72 L 56 87 Q 50 91, 44 87 L 17 72 Q 11 69, 11 62 L 11 38 Q 11 31, 17 28 Z" className={isDark ? "fill-amber-500/10 stroke-amber-400" : "fill-amber-600 stroke-amber-700"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className={`relative z-10 w-8 h-8 flex items-center justify-center ${isDark ? "drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]" : "drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"}`}>
                <Image src="/logo-white.png" alt="PanoMelk Logo" width={30} height={30} className={`object-contain ${isDark ? "filter brightness-125 sepia-[1] hue-rotate-[-10deg] saturate-[8]" : "brightness-0 invert"}`} priority />
              </div>
            </div>

            <h1 className={`text-lg font-bold tracking-wide ${isDark ? "text-white" : "text-slate-950"}`}>
              {getHeaderTitle()}
            </h1>
          </div>

          {/* فرم ورود */}
          {step === "login" && (
            <form onSubmit={handleLoginSubmit} noValidate className="space-y-3 flex-grow flex flex-col justify-center my-1">
              <div className="flex flex-col">
                <label className={`text-xs font-bold mb-1 pr-1 ${isDark ? "text-slate-300" : "text-slate-900"}`}>آدرس ایمیل</label>
                <div className="relative">
                  <Mail className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-700"}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder="name@example.com"
                    dir="ltr"
                    className={`w-full border rounded-xl py-2 pr-9 pl-3 text-xs text-right transition-all focus:outline-none ${emailError ? "border-red-500" : "focus:border-amber-500 " + (isDark ? "bg-white/5 border-white/10 text-slate-100 placeholder-slate-400" : "bg-white/50 border-white/60 text-slate-950 font-bold")}`}
                  />
                </div>
                {emailError && <span className="text-[10px] font-bold text-red-500 mt-1 pr-1">{emailError}</span>}
              </div>

              <div className="flex flex-col">
                <label className={`text-xs font-bold mb-1 pr-1 ${isDark ? "text-slate-300" : "text-slate-900"}`}>رمز عبور</label>
                <div className="relative">
                  <Lock className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-700"}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    placeholder="رمز عبور خود را وارد کنید"
                    className={`w-full border rounded-xl py-2 pr-9 pl-9 text-xs transition-all focus:outline-none ${passwordError ? "border-red-500" : "focus:border-amber-500 " + (isDark ? "bg-white/5 border-white/10 text-slate-100 placeholder-slate-400" : "bg-white/50 border-white/60 text-slate-950 font-bold")}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer ${isDark ? "text-slate-400 hover:text-white" : "text-slate-700 hover:text-slate-950"}`}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && <span className="text-[10px] font-bold text-red-500 mt-1 pr-1">{passwordError}</span>}
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-amber-500/20 transition-all text-xs cursor-pointer disabled:opacity-60 disabled:cursor-wait">
                <span>{isLoading ? "لطفاً شکیبا باشید..." : "ورود به حساب"}</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </form>
          )}

          {/* فرم ثبت نام */}
          {step === "register" && (
            <form onSubmit={handleRegisterSubmit} noValidate className="space-y-2 flex-grow flex flex-col justify-center my-1">
              <div className="flex flex-col">
                <label className={`text-[11px] font-bold mb-1 pr-1 ${isDark ? "text-slate-300" : "text-slate-900"}`}>نام و نام خانوادگی</label>
                <div className="relative">
                  <CircleUserRound className={`absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? "text-slate-400" : "text-slate-700"}`} />
                  <input 
                    type="text" 
                    value={fullName} 
                    onChange={(e) => { setFullName(e.target.value); if (fullNameError) setFullNameError(""); }} 
                    placeholder="علی محمدی" 
                    className={`w-full border rounded-xl py-2 pr-8 pl-3 text-xs transition-all focus:outline-none ${fullNameError ? "border-red-500" : "focus:border-amber-500 " + (isDark ? "bg-white/5 border-white/10 text-slate-100" : "bg-white/50 border-white/60 text-slate-950 font-bold")}`} 
                  />
                </div>
                {fullNameError && <span className="text-[10px] font-bold text-red-500 mt-0.5 pr-1">{fullNameError}</span>}
              </div>

              <div className="flex flex-col">
                <label className={`text-[11px] font-bold mb-1 pr-1 ${isDark ? "text-slate-300" : "text-slate-900"}`}>نام کاربری</label>
                <div className="relative">
                  <User className={`absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? "text-slate-400" : "text-slate-700"}`} />
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => { setUsername(e.target.value); if (usernameError) setUsernameError(""); }} 
                    placeholder="ali_mohammadi" 
                    dir="ltr" 
                    className={`w-full border rounded-xl py-2 pr-8 pl-3 text-xs text-right transition-all focus:outline-none ${usernameError ? "border-red-500" : "focus:border-amber-500 " + (isDark ? "bg-white/5 border-white/10 text-slate-100" : "bg-white/50 border-white/60 text-slate-950 font-bold")}`} 
                  />
                </div>
                {usernameError && <span className="text-[10px] font-bold text-red-500 mt-0.5 pr-1">{usernameError}</span>}
              </div>

              <div className="flex flex-col">
                <label className={`text-[11px] font-bold mb-1 pr-1 ${isDark ? "text-slate-300" : "text-slate-900"}`}>شماره همراه</label>
                <div className="relative">
                  <Phone className={`absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? "text-slate-400" : "text-slate-700"}`} />
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => { setPhone(e.target.value); if (phoneError) setPhoneError(""); }} 
                    placeholder="09123456789" 
                    dir="ltr" 
                    className={`w-full border rounded-xl py-2 pr-8 pl-3 text-xs text-right transition-all focus:outline-none ${phoneError ? "border-red-500" : "focus:border-amber-500 " + (isDark ? "bg-white/5 border-white/10 text-slate-100" : "bg-white/50 border-white/60 text-slate-950 font-bold")}`} 
                  />
                </div>
                {phoneError && <span className="text-[10px] font-bold text-red-500 mt-0.5 pr-1">{phoneError}</span>}
              </div>

              <div className="flex flex-col">
                <label className={`text-[11px] font-bold mb-1 pr-1 ${isDark ? "text-slate-300" : "text-slate-900"}`}>آدرس ایمیل</label>
                <div className="relative">
                  <Mail className={`absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? "text-slate-400" : "text-slate-700"}`} />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => { setEmail(e.target.value); if (registerEmailError) setRegisterEmailError(""); }} 
                    placeholder="name@example.com" 
                    dir="ltr" 
                    className={`w-full border rounded-xl py-2 pr-8 pl-3 text-xs text-right transition-all focus:outline-none ${registerEmailError ? "border-red-500" : "focus:border-amber-500 " + (isDark ? "bg-white/5 border-white/10 text-slate-100" : "bg-white/50 border-white/60 text-slate-950 font-bold")}`} 
                  />
                </div>
                {registerEmailError && <span className="text-[10px] font-bold text-red-500 mt-0.5 pr-1">{registerEmailError}</span>}
              </div>

              <div className="flex flex-col">
                <label className={`text-[11px] font-bold mb-1 pr-1 ${isDark ? "text-slate-300" : "text-slate-900"}`}>رمز عبور</label>
                <div className="relative">
                  <Lock className={`absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? "text-slate-400" : "text-slate-700"}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(""); }}
                    placeholder="حداقل ۸ کاراکتر"
                    className={`w-full border rounded-xl py-2 pr-8 pl-3 text-xs focus:outline-none ${passwordError ? "border-red-500" : "focus:border-amber-500 " + (isDark ? "bg-white/5 border-white/10 text-slate-100" : "bg-white/50 border-white/60 text-slate-950")}`}
                  />
                </div>
                {passwordError && <span className="text-[10px] font-bold text-red-500 mt-0.5 pr-1">{passwordError}</span>}
              </div>

              <div className="flex flex-col pt-1">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={acceptTerms} 
                    onChange={(e) => { setAcceptTerms(e.target.checked); if (termsError) setTermsError(""); }} 
                    className="rounded accent-amber-500 w-3.5 h-3.5 cursor-pointer" 
                  />
                  <label htmlFor="terms" className={`text-[10px] font-bold cursor-pointer ${isDark ? "text-slate-300" : "text-slate-900"}`}>
                    <button 
                      type="button" 
                      onClick={() => setIsTermsOpen(true)} 
                      className="text-amber-500 underline ml-1 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      قوانین و مقررات سایت
                    </button> 
                    را می‌پذیرم.
                  </label>
                </div>
                {termsError && <span className="text-[10px] font-bold text-red-500 mt-1 pr-1">{termsError}</span>}
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-amber-500/20 transition-all text-xs cursor-pointer mt-1 disabled:opacity-60 disabled:cursor-wait">
                <span>{isLoading ? "لطفاً شکیبا باشید..." : "ثبت‌نام"}</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </form>
          )}

          {/* فوتر سوئیچ بین حالت‌ها */}
          {step === "login" ? (
            <div className="space-y-2 pb-1">
              <div className={`text-center text-xs ${isDark ? "text-slate-300" : "text-slate-900 font-bold"}`}>
                حساب کاربری ندارید؟{" "}
                <button type="button" onClick={() => setStep("register")} className={`font-bold cursor-pointer ${isDark ? "text-amber-500 hover:text-amber-400" : "text-amber-600 hover:text-amber-700"}`}>
                  ثبت‌نام کنید
                </button>
              </div>
            </div>
          ) : step === "register" ? (
            <div className={`text-center text-xs ${isDark ? "text-slate-300" : "text-slate-900 font-bold"}`}>
              قبلاً ثبت‌نام کرده‌اید؟{" "}
              <button type="button" onClick={() => setStep("login")} className={`font-bold cursor-pointer ${isDark ? "text-amber-500 hover:text-amber-400" : "text-amber-600 hover:text-amber-700"}`}>
                وارد شوید
              </button>
            </div>
          ) : (
            <div className={`text-center text-xs font-bold ${isDark ? "text-slate-400" : "text-slate-900"}`}>
              پشتیبانی پانوملک
            </div>
          )}

        </div>
      </div>

      {/* --- مودال قوانین و مقررات با Tailwind CSS --- */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" dir="rtl">
          <div className={`relative w-full max-w-lg max-h-[80vh] flex flex-col rounded-3xl border shadow-2xl p-6 overflow-hidden transition-all ${isDark ? "bg-slate-900 border-white/15 text-slate-100" : "bg-white border-slate-300 text-slate-900"}`}>
            
            {/* هدر مودال */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/30">
              <h2 className="text-base font-bold text-amber-500">قوانین و مقررات استفاده از خدمات پانوملک</h2>
              <button 
                type="button" 
                onClick={() => setIsTermsOpen(false)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${isDark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-600 hover:text-slate-950"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* محتوای قوانین */}
            <div className="flex-grow overflow-y-auto py-4 space-y-4 text-xs leading-relaxed pl-2 custom-scrollbar">
              <div className="space-y-1">
                <h3 className="font-bold text-amber-500">۱. کلیات و پذیرش قوانین</h3>
                <p className={isDark ? "text-slate-300" : "text-slate-700"}>
                  استفاده از پلتفرم پانوملک به معنای آگاهی کامل و پذیرش تمامی شرایط و قوانین مندرج در این صفحه است. این قوانین ممکن است در طول زمان به‌روزرسانی شوند و استفاده مستمر شما به منزله پذیرش تغییرات است.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-amber-500">۲. سیاست عودت وجه و استرداد (غیرقابل بازگشت بودن وجه)</h3>
                <p className={isDark ? "text-slate-300" : "text-slate-700"}>
                  تمامی تراکنش‌ها، پرداخت‌ها، هزینه‌های اشتراک و خریدهای انجام‌شده از طریق درگاه‌های پرداخت سایت پانوملک، <strong>قطعی و نهایی بوده و به هیچ عنوان وجه پرداخت‌شده قابل استرداد، برگشت یا انتقال به حساب دیگر نمی‌باشد.</strong> لطفا پیش از نهایی کردن هرگونه خرید یا پرداخت، دقت لازم را مبذول فرمایید.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-amber-500">۳. حساب کاربری و امنیت اطلاعات</h3>
                <p className={isDark ? "text-slate-300" : "text-slate-700"}>
                  کاربر موظف است در هنگام ثبت‌نام اطلاعات صحیح، معتبر و متعلق به خود را وارد نماید. مسئولیت حفظ رمز عبور و امنیت حساب کاربری کاملاً بر عهده خود کاربر است و پانوملک هیچ‌گونه مسئولیتی در قبال سوءاستفاده‌های احتمالی ناشی از بی‌احتیاطی کاربر ندارد.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-amber-500">۴. مالکیت معنوی و حقوق محتوا</h3>
                <p className={isDark ? "text-slate-300" : "text-slate-700"}>
                  کلیه حقوق مادی و معنوی محتوا، طراحی، لوگو، کدهای برنامه‌نویسی و ساختار پلتفرم پانوملک متعلق به شرکت بوده و هرگونه کپی‌برداری، بازنشر یا سوءاستفاده تجاری پیگرد قانونی دارد.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-amber-500">۵. حریم خصوصی کاربران</h3>
                <p className={isDark ? "text-slate-300" : "text-slate-700"}>
                  پانوملک متعهد می‌شود که از اطلاعات شخصی و حریم خصوصی کاربران محافظت نموده و این اطلاعات را به اشخاص ثالث واگذار نکند، مگر با حکم مراجع قانونی ذی‌صلاح.
                </p>
              </div>
            </div>

            {/* فوتر مودال */}
            <div className="pt-4 border-t border-amber-500/30 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setAcceptTerms(true);
                  setIsTermsOpen(false);
                }}
                className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold py-2 px-6 rounded-xl text-xs shadow-md hover:shadow-amber-500/20 transition-all cursor-pointer"
              >
                متوجه شدم و می‌پذیرم
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}