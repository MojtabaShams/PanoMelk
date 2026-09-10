// components/tabs/NewProjectTab.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  FolderPlus, 
  MapPin, 
  Upload, 
  FileText, 
  ChevronLeft, 
  Trash2, 
  Image as ImageIcon,
  Volume2,
  Sparkles,
  Layers,
  Save,
  Building2, 
  Factory, 
  Store, 
  Compass, 
  Car
} from "lucide-react";

interface Hotspot {
  id: string;
  title: string;
  x: number;
  y: number;
  panoImageName: string | null;
  audioName: string | null;
  description: string;
}

const PROJECT_CATEGORIES = [
  { id: "real-estate", label: "مسکونی و املاک", icon: Building2, desc: "آپارتمان، ویلا، زمین و برج" },
  { id: "industrial", label: "صنعتی و کارخانجات", icon: Factory, desc: "سوله، انبار، کارگاه و خط تولید" },
  { id: "commercial", label: "تجاری و اداری", icon: Store, desc: "فروشگاه، پاساژ، دفتر کار و نمایشگاه" },
  { id: "tourism", label: "گردشگری و هتل‌داری", icon: Compass, desc: "هتل، اقامتگاه، موزه و اماکن تاریخی" },
  { id: "automotive", label: "خودرو و وسایل نقلیه", icon: Car, desc: "نمایشگاه خودرو، نمای داخلی ماشین و قایق" },
  { id: "other", label: "سایر فضه‌ها", icon: Sparkles, desc: "رویدادها، غرفه‌های نمایشگاهی و..." },
];

export const NewProjectTab = (props: any) => {
  // استفاده از state داخلی برای واکنش به تغییرات تم به صورت آنی
  const [isDark, setIsDark] = useState<boolean>(props?.params?.isDark ?? true);

  useEffect(() => {
    if (props?.params?.isDark !== undefined) {
      setIsDark(props.params.isDark);
    }
  }, [props?.params?.isDark]);

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [projectName, setProjectName] = useState("");
  const [projectCategory, setProjectCategory] = useState("real-estate");
  const [projectDesc, setProjectDesc] = useState("");

  const [mapImage, setMapImage] = useState<string | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);

  const handleMapUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMapImage(url);
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapImage || !mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newHotspot: Hotspot = {
      id: `hs-${Date.now()}`,
      title: `نقطه ${hotspots.length + 1}`,
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      panoImageName: null,
      audioName: null,
      description: "",
    };

    setHotspots([...hotspots, newHotspot]);
    setSelectedHotspotId(newHotspot.id);
  };

  const selectedHotspot = hotspots.find((h) => h.id === selectedHotspotId);

  const updateSelectedHotspot = (fields: Partial<Hotspot>) => {
    if (!selectedHotspotId) return;
    setHotspots((prev) =>
      prev.map((h) => (h.id === selectedHotspotId ? { ...h, ...fields } : h))
    );
  };

  const removeHotspot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHotspots(hotspots.filter((h) => h.id !== id));
    if (selectedHotspotId === id) setSelectedHotspotId(null);
  };

  const handleFinishProject = () => {
    alert(`پروژه "${projectName}" با موفقیت ذخیره و ایجاد شد!`);
  };

  return (
    <div className={`p-6 h-full flex flex-col gap-6 overflow-y-auto custom-sidebar-scroll transition-colors duration-300 ${
      isDark ? "text-slate-100" : "text-slate-900"
    }`}>
      
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 ${
        isDark ? "border-white/10" : "border-slate-900/10"
      }`}>
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <FolderPlus className="w-6 h-6 text-amber-500" />
            استودیوی ساخت پروژه و تور ۳۶۰ درجه
          </h2>
          <p className={`text-xs mt-1 font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            مشخصات پروژه، نقشه ساختمانی و نقاط پانورامای همراه با صدا و متن را پیکربندی کنید.
          </p>
        </div>

        <div className={`flex items-center gap-2 p-1.5 rounded-2xl border self-start md:self-auto backdrop-blur-md ${
          isDark ? "bg-white/5 border-white/10" : "bg-white/40 border-white/60 shadow-sm"
        }`}>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            step === 1 ? "bg-amber-500 text-slate-950 shadow" : (isDark ? "opacity-60" : "text-slate-600")
          }`}>
            <span>۱. اطلاعات پایه</span>
          </div>
          <ChevronLeft className={`w-3.5 h-3.5 ${isDark ? "opacity-40" : "text-slate-400"}`} />
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            step === 2 ? "bg-amber-500 text-slate-950 shadow" : (isDark ? "opacity-60" : "text-slate-600")
          }`}>
            <span>۲. جانمایی و پوینترها</span>
          </div>
          <ChevronLeft className={`w-3.5 h-3.5 ${isDark ? "opacity-40" : "text-slate-400"}`} />
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            step === 3 ? "bg-amber-500 text-slate-950 shadow" : (isDark ? "opacity-60" : "text-slate-600")
          }`}>
            <span>۳. پیش‌نمایش و ثبت</span>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <label className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-800"}`}>نام پروژه / فضا</label>
            <input
              type="text"
              placeholder="مثال: سوله صنعتی ۵۰۰ متری / آپارتمان مدرن نیاوران"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className={`w-full backdrop-blur-md border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                isDark 
                  ? "bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-amber-500" 
                  : "bg-white/60 border-white/80 text-slate-900 placeholder:text-slate-500 focus:border-amber-500 shadow-sm"
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-800"}`}>دسته‌بندی و نوع کاربری فضا</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PROJECT_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = projectCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setProjectCategory(cat.id)}
                    className={`p-4 rounded-2xl text-right transition-all flex flex-col gap-1.5 cursor-pointer relative backdrop-blur-md border shadow-sm ${
                      isSelected 
                        ? (isDark ? "border-amber-500 bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/40" : "border-amber-500 bg-amber-500/20 text-slate-950 ring-2 ring-amber-500/40")
                        : (isDark ? "border-white/10 bg-white/5 hover:bg-white/10 text-white" : "border-white/60 bg-white/40 hover:bg-white/60 text-slate-800")
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${
                        isSelected 
                          ? "bg-amber-500 text-slate-950" 
                          : (isDark ? "bg-white/10 text-slate-200" : "bg-white/60 text-slate-700")
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{cat.label}</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed pr-1 font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {cat.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-800"}`}>توضیحات کلی</label>
            <textarea
              rows={4}
              placeholder="توضیحات مربوط به ملک، مشخصات فنی سوله، شرایط فروش یا جزئیات تور..."
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className={`w-full backdrop-blur-md border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all resize-none ${
                isDark 
                  ? "bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-amber-500" 
                  : "bg-white/60 border-white/80 text-slate-900 placeholder:text-slate-500 focus:border-amber-500 shadow-sm"
              }`}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              disabled={!projectName.trim()}
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-amber-500 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400 transition-colors shadow-md cursor-pointer"
            >
              <span>گام بعدی: جانمایی روی نقشه</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[450px]">
          
          <div className={`lg:col-span-8 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden border shadow-sm ${
            isDark ? "bg-white/5 border-white/10" : "bg-white/30 border-white/60"
          }`}>
            {!mapImage ? (
              <div className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center ${
                isDark ? "border-white/20 bg-black/20" : "border-white/60 bg-white/30"
              }`}>
                <Upload className="w-12 h-12 text-amber-500 mb-3 animate-bounce" />
                <h3 className={`font-bold text-sm mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>آپلود نقشه دو بعدی / پلان ساختمان یا فضا</h3>
                <p className={`text-xs mb-4 font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>تصویر JPG یا PNG نقشه ملک یا پلان سوله خود را انتخاب کنید.</p>
                <label className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer hover:bg-amber-400 transition-colors shadow">
                  انتخاب تصویر نقشه
                  <input type="file" accept="image/*" className="hidden" onChange={handleMapUpload} />
                </label>
              </div>
            ) : (
              <div className="relative flex-1 flex items-center justify-center overflow-auto custom-sidebar-scroll">
                <div 
                  ref={mapRef}
                  onClick={handleMapClick}
                  className="relative inline-block cursor-crosshair max-w-full"
                >
                  <img src={mapImage} alt="Plan Map" className="w-full h-auto object-contain rounded-lg select-none shadow" />
                  
                  {hotspots.map((hs) => (
                    <button
                      key={hs.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHotspotId(hs.id);
                      }}
                      style={{ top: `${hs.y}%`, left: `${hs.x}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all z-20 cursor-pointer ${
                        selectedHotspotId === hs.id ? "scale-125 z-30" : "hover:scale-110"
                      }`}
                    >
                      <div className={`p-2 rounded-full shadow-lg border-2 flex items-center justify-center ${
                        selectedHotspotId === hs.id 
                          ? "bg-amber-500 border-white text-slate-950 ring-4 ring-amber-500/40" 
                          : "bg-slate-950 border-amber-400 text-amber-400"
                      }`}>
                        <MapPin className="w-4 h-4 fill-current" />
                      </div>
                      <span className="absolute top-full right-1/2 translate-x-1/2 mt-1 px-2.5 py-1 bg-slate-950 text-white border border-slate-700 text-[10px] font-bold rounded-md whitespace-nowrap shadow-md">
                        {hs.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mapImage && (
              <div className={`mt-3 flex items-center justify-between text-xs px-4 py-2 rounded-xl border font-medium ${
                isDark ? "text-slate-300 bg-black/40 border-white/10" : "text-slate-800 bg-white/60 border-white/60 shadow-sm"
              }`}>
                <span>راهنما: جهت افزودن نقطه جدید، روی محل مورد نظر در نقشه کلیک کنید.</span>
                <label className={`font-bold hover:underline cursor-pointer ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                  تغییر نقشه
                  <input type="file" accept="image/*" className="hidden" onChange={handleMapUpload} />
                </label>
              </div>
            )}
          </div>

          <div className={`lg:col-span-4 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between border shadow-sm ${
            isDark ? "bg-white/5 border-white/10" : "bg-white/40 border-white/60"
          }`}>
            {selectedHotspot ? (
              <div className="flex flex-col gap-4">
                <div className={`flex items-center justify-between border-b pb-3 ${isDark ? "border-white/10" : "border-white/40"}`}>
                  <span className={`text-xs font-extrabold flex items-center gap-1.5 ${isDark ? "text-amber-400" : "text-slate-900"}`}>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    تنظیمات پوینتر: {selectedHotspot.title}
                  </span>
                  <button 
                    onClick={(e) => removeHotspot(selectedHotspot.id, e)}
                    className="text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 p-2 rounded-xl transition-colors cursor-pointer"
                    title="حذف این پوینتر"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={`text-[11px] font-bold ${isDark ? "text-white" : "text-slate-800"}`}>عنوان نقطه (مثلاً: بخش انبار / آشپزخانه)</label>
                  <input
                    type="text"
                    value={selectedHotspot.title}
                    onChange={(e) => updateSelectedHotspot({ title: e.target.value })}
                    className={`border rounded-xl px-3 py-2 text-xs focus:outline-none font-medium ${
                      isDark ? "bg-white/5 border-white/10 text-white focus:border-amber-500" : "bg-white/50 border-white/80 text-slate-900 focus:border-amber-500 shadow-sm"
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={`text-[11px] font-bold flex items-center gap-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    تصویر ۳۶۰ درجه (Panorama)
                  </label>
                  <label className={`border border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${
                    isDark ? "border-white/20 bg-black/20 hover:border-amber-500" : "border-slate-400/60 bg-white/30 hover:border-amber-500"
                  }`}>
                    <span className={`text-[11px] font-medium block truncate ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      {selectedHotspot.panoImageName || "انتخاب فایل تصویر ۳۶۰ پانوراما..."}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => updateSelectedHotspot({ panoImageName: e.target.files?.[0]?.name || null })}
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={`text-[11px] font-bold flex items-center gap-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                    <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                    فایل صوتی / صدای مالک
                  </label>
                  <label className={`border border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${
                    isDark ? "border-white/20 bg-black/20 hover:border-amber-500" : "border-slate-400/60 bg-white/30 hover:border-amber-500"
                  }`}>
                    <span className={`text-[11px] font-medium block truncate ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      {selectedHotspot.audioName || "انتخاب ویس یا پادکست (MP3)..."}
                    </span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => updateSelectedHotspot({ audioName: e.target.files?.[0]?.name || null })}
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={`text-[11px] font-bold flex items-center gap-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                    <FileText className="w-3.5 h-3.5 text-amber-500" />
                    توضیحات متنی برای این نقطه
                  </label>
                  <textarea
                    rows={3}
                    value={selectedHotspot.description}
                    onChange={(e) => updateSelectedHotspot({ description: e.target.value })}
                    placeholder="توضیحات متنی درباره متریال، ابعاد، امکانات و..."
                    className={`border rounded-xl px-3 py-2 text-xs focus:outline-none resize-none font-medium ${
                      isDark ? "bg-white/5 border-white/10 text-white focus:border-amber-500" : "bg-white/50 border-white/80 text-slate-900 focus:border-amber-500 shadow-sm"
                    }`}
                  />
                </div>
              </div>
            ) : (
              <div className={`flex-1 flex flex-col items-center justify-center text-center p-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                <Layers className="w-10 h-10 mb-2 stroke-1" />
                <p className="text-xs font-medium">یک پوینتر روی نقشه انتخاب کنید یا روی نقشه کلیک کنید تا نقطه جدیدی اضافه شود.</p>
              </div>
            )}

            <div className={`flex items-center justify-between pt-4 border-t mt-4 ${isDark ? "border-white/10" : "border-white/40"}`}>
              <button
                onClick={() => setStep(1)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  isDark ? "bg-white/10 border border-white/10 text-white hover:bg-white/20" : "bg-white/50 border border-white/60 text-slate-900 hover:bg-white/80 shadow-sm"
                }`}
              >
                قبلی
              </button>
              <button
                disabled={hotspots.length === 0}
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400 cursor-pointer shadow-md"
              >
                <span>پیش‌نمایش</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {step === 3 && (
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 py-2">
          <div className={`backdrop-blur-md rounded-2xl p-6 flex flex-col gap-4 border shadow-sm ${
            isDark ? "bg-white/5 border-white/10" : "bg-white/40 border-white/60"
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? "border-white/10" : "border-white/40"}`}>
              <div>
                <h3 className={`font-extrabold text-base ${isDark ? "text-white" : "text-slate-900"}`}>{projectName}</h3>
                <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>تعداد نقاط ۳۶۰ درجه جانمایی شده: {hotspots.length} نقطه</span>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-500/20 text-slate-900 border border-amber-500/40">
                {PROJECT_CATEGORIES.find(c => c.id === projectCategory)?.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {hotspots.map((h, i) => (
                <div key={h.id} className={`p-4 rounded-xl border flex flex-col gap-1 shadow-sm ${
                  isDark ? "bg-white/5 border-white/10 text-white" : "bg-white/50 border-white/60 text-slate-900"
                }`}>
                  <span className={`font-bold text-sm ${isDark ? "text-amber-400" : "text-amber-600"}`}>{i + 1}. {h.title}</span>
                  <span className={`truncate font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>عکس ۳۶۰: {h.panoImageName || "ثبت نشده"}</span>
                  <span className={`truncate font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>فایل صوتی: {h.audioName || "ثبت نشده"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className={`px-6 py-3 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                isDark ? "bg-white/10 border border-white/10 text-white hover:bg-white/20" : "bg-white/50 border border-white/60 text-slate-900 hover:bg-white/80 shadow-sm"
              }`}
            >
              بازگشت به ویرایش نقاط
            </button>
            <button
              onClick={handleFinishProject}
              className="px-8 py-3 bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-md hover:bg-amber-400 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره و ایجاد نهایی تور ۳۶۰</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};