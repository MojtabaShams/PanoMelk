// components/tabs/ProfileTab.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  ShieldCheck, 
  CircleUserRound,
  CheckCircle2,
  Camera,
  Trash2
} from "lucide-react";

export const ProfileTab = (props: any) => {
  const [isDark, setIsDark] = useState<boolean>(props?.params?.isDark ?? true);

  useEffect(() => {
    if (props?.params?.isDark !== undefined) {
      setIsDark(props.params.isDark);
    }
  }, [props?.params?.isDark]);

  // اطلاعات نمونه کاربر (گرفته شده از فرم ثبت‌نام صفحه لاگین)
  const [fullName, setFullName] = useState("علی محمدی");
  const [username, setUsername] = useState("ali_mohammadi");
  const [phone, setPhone] = useState("09123456789");
  const [email, setEmail] = useState("ali@panomelk.com");
  
  // مدیریت عکس پروفایل
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // فیلدهای رمز عبور جدید (دوبار برای تایید)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  
  const [passError, setPassError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // هندلر انتخاب عکس جدید
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setSuccessMessage("");

    // بررسی تطابق رمز عبور جدید در صورت ورود
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setPassError("رمز عبور جدید و تکرار آن با یکدیگر مطابقت ندارند.");
        return;
      }
      if (newPassword.length < 4) {
        setPassError("رمز عبور باید حداقل ۴ کاراکتر باشد.");
        return;
      }
    }

    // شبیه‌سازی ذخیره موفقیت‌آمیز
    setSuccessMessage("اطلاعات کاربری با موفقیت به‌روزرسانی شد.");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  return (
    <div className={`p-4 sm:p-6 h-full flex flex-col gap-6 overflow-y-auto custom-sidebar-scroll transition-colors duration-300 ${
      isDark ? "text-slate-100" : "text-slate-900"
    }`}>
      
      {/* هدر بخش پروفایل */}
      <div className={`border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark ? "border-white/10" : "border-slate-900/10"
      }`}>
        <div>
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            پروفایل و اطلاعات حساب کاربری
          </h2>
          <p className={`text-[11px] mt-0.5 font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            مشاهده و ویرایش مشخصات ثبت‌نامی، شماره تماس، ایمیل و تغییر رمز عبور سامانه
          </p>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold backdrop-blur-md ${
          isDark ? "bg-white/5 border-white/10 text-amber-400" : "bg-white/60 border-slate-200 text-amber-600 shadow-sm"
        }`}>
          <ShieldCheck className="w-4 h-4" />
          <span>حساب کاربری تأیید شده</span>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* فرم ویرایش اطلاعات */}
      <form onSubmit={handleSaveChanges} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ستون راست: اطلاعات شناسایی و عکس پروفایل */}
        <div className={`lg:col-span-7 rounded-2xl p-5 border backdrop-blur-xl flex flex-col gap-5 shadow-lg ${
          isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-slate-200/80 shadow-sm"
        }`}>
          <h3 className="text-xs font-extrabold border-b pb-3 border-white/10 flex items-center gap-2">
            <CircleUserRound className="w-4 h-4 text-amber-500" />
            مشخصات فردی و حساب
          </h3>

          {/* بخش آپلود و مدیریت عکس پروفایل */}
          <div className="flex items-center gap-4 py-2">
            <div className="relative group">
              <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 flex items-center justify-center transition-all ${
                isDark ? "border-amber-500/50 bg-white/5 text-amber-400" : "border-amber-600/50 bg-white/80 text-amber-600 shadow-inner"
              }`}>
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <CircleUserRound className="w-9 h-9" />
                )}
              </div>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -left-1 p-1.5 rounded-xl bg-amber-500 text-slate-950 shadow-md hover:bg-amber-400 transition-all cursor-pointer"
                title="تغییر عکس پروفایل"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />

            <div className="flex flex-col gap-1">
              <span className={`text-xs font-bold ${isDark ? "text-slate-200" : "text-slate-900"}`}>تصویر پروفایل</span>
              <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>حداکثر حجم ۲ مگابایت (فرمت JPG یا PNG)</p>
              
              {avatar && (
                <button
                  type="button"
                  onClick={() => setAvatar(null)}
                  className="text-[11px] font-bold text-red-500 hover:text-red-400 flex items-center gap-1 mt-0.5 w-fit cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>حذف تصویر</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-900"}`}>نام و نام خانوادگی</label>
              <div className="relative">
                <CircleUserRound className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-700"}`} />
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  required 
                  className={`w-full border rounded-xl py-2.5 pr-10 pl-3 text-xs transition-all focus:outline-none focus:border-amber-500 ${
                    isDark ? "bg-white/5 border-white/10 text-slate-100" : "bg-white/50 border-white/60 text-slate-950 font-bold"
                  }`} 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-900"}`}>نام کاربری</label>
              <div className="relative">
                <User className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-700"}`} />
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  dir="ltr"
                  className={`w-full border rounded-xl py-2.5 pr-10 pl-3 text-xs text-right transition-all focus:outline-none focus:border-amber-500 ${
                    isDark ? "bg-white/5 border-white/10 text-slate-100" : "bg-white/50 border-white/60 text-slate-950 font-bold"
                  }`} 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-900"}`}>شماره همراه</label>
              <div className="relative">
                <Phone className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-700"}`} />
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                  dir="ltr"
                  className={`w-full border rounded-xl py-2.5 pr-10 pl-3 text-xs text-right transition-all focus:outline-none focus:border-amber-500 ${
                    isDark ? "bg-white/5 border-white/10 text-slate-100" : "bg-white/50 border-white/60 text-slate-950 font-bold"
                  }`} 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-900"}`}>آدرس ایمیل</label>
              <div className="relative">
                <Mail className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-700"}`} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  dir="ltr"
                  className={`w-full border rounded-xl py-2.5 pr-10 pl-3 text-xs text-right transition-all focus:outline-none focus:border-amber-500 ${
                    isDark ? "bg-white/5 border-white/10 text-slate-100" : "bg-white/50 border-white/60 text-slate-950 font-bold"
                  }`} 
                />
              </div>
            </div>
          </div>         
        </div>

        {/* ستون چپ: امنیت و تغییر رمز عبور */}
        <div className={`lg:col-span-5 rounded-2xl p-5 border backdrop-blur-xl flex flex-col justify-between gap-4 shadow-lg ${
          isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-slate-200/80 shadow-sm"
        }`}>
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-extrabold border-b pb-3 border-white/10 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" />
              تغییر رمز عبور (اختیاری)
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-900"}`}>رمز عبور جدید</label>
              <div className="relative">
                <Lock className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-700"}`} />
                <input 
                  type={showPass1 ? "text" : "password"} 
                  value={newPassword} 
                  onChange={(e) => { setNewPassword(e.target.value); if (passError) setPassError(""); }} 
                  placeholder="رمز عبور جدید" 
                  className={`w-full border rounded-xl py-2.5 pr-10 pl-9 text-xs transition-all focus:outline-none focus:border-amber-500 ${
                    isDark ? "bg-white/5 border-white/10 text-slate-100 placeholder-slate-500" : "bg-white/50 border-white/60 text-slate-950 font-bold placeholder-slate-400"
                  }`} 
                />
                <button type="button" onClick={() => setShowPass1(!showPass1)} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400 hover:text-white" : "text-slate-700"}`}>
                  {showPass1 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-900"}`}>تکرار رمز عبور جدید</label>
              <div className="relative">
                <Lock className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-700"}`} />
                <input 
                  type={showPass2 ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={(e) => { setConfirmPassword(e.target.value); if (passError) setPassError(""); }} 
                  placeholder="تکرار رمز عبور جدید" 
                  className={`w-full border rounded-xl py-2.5 pr-10 pl-9 text-xs transition-all focus:outline-none focus:border-amber-500 ${
                    isDark ? "bg-white/5 border-white/10 text-slate-100 placeholder-slate-500" : "bg-white/50 border-white/60 text-slate-950 font-bold placeholder-slate-400"
                  }`} 
                />
                <button type="button" onClick={() => setShowPass2(!showPass2)} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400 hover:text-white" : "text-slate-700"}`}>
                  {showPass2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {passError && (
              <span className="text-[11px] font-bold text-red-500 pr-1">{passError}</span>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/20 transition-all text-xs cursor-pointer mt-4"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره تغییرات پروفایل</span>
          </button>
        </div>

      </form>

    </div>
  );
};