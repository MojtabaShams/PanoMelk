"use client";

import React, { useEffect, useRef, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { useParams } from "next/navigation";
import { MapPin, Volume2, ArrowRight } from "lucide-react";

export default function ProjectPreviewPage() {
  const params = useParams();
  const projectId = params?.id;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ۱. راه‌اندازی ویور Photo Sphere
    const viewer = new Viewer({
      container: containerRef.current,
      // در پروژه واقعی، عکس پانورامای مرتبط با projectId را از دیتابیس یا آرایه می‌خوانید
      panorama: "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg", 
      loadingImg: "https://photo-sphere-viewer-data.netlify.app/assets/loader.gif",
      touchmoveTwoFingers: true,
      mousewheel: true,
      plugins: [
        [
          MarkersPlugin,
          {
            markers: [
              {
                id: "spot-1",
                position: { yaw: 0.5, pitch: 0.1 },
                html: `<div class="bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-full shadow-lg border border-white text-xs flex items-center gap-1 cursor-pointer">📍 اتاق پذیرایی</div>`,
                anchor: "bottom center",
                tooltip: "سالن پذیرایی اصلی",
              },
              {
                id: "spot-2",
                position: { yaw: -1.2, pitch: -0.05 },
                html: `<div class="bg-blue-600 text-white font-bold px-3 py-1 rounded-full shadow-lg border border-white text-xs flex items-center gap-1 cursor-pointer">🔊 راهنمای صوتی</div>`,
                anchor: "bottom center",
                tooltip: "پخش ویس توضیحات",
              },
            ],
          },
        ],
      ],
    });

    viewerRef.current = viewer;

    // ۲. مدیریت کلیک روی پوینترها (Hotspots)
    const markersPlugin = viewer.getPlugin(MarkersPlugin) as MarkersPlugin;
    if (markersPlugin) {
      markersPlugin.addEventListener("select-marker", ({ marker }) => {
        setActiveHotspot(marker.id);
        if (marker.id === "spot-2") {
          // اینجا می‌توانید فایل صوتی مرتبط را پخش کنید
          const audio = new Audio("https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg");
          audio.play();
          alert("فایل صوتی راهنما در حال پخش است...");
        }
      });
    }

    // پاکسازی هنگام بستن صفحه
    return () => {
      viewer.destroy();
    };
  }, [projectId]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col">
      
      {/* هدر بالای صفحه پیش‌نمایش */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-auto">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.close()} 
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بستن پیش‌نمایش</span>
          </button>
          <h1 className="text-sm font-extrabold text-amber-400">
            پیش‌نمایش تور ۳۶۰ درجه (شناسه پروژه: {projectId})
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs bg-black/40 backdrop-medium px-3 py-1.5 rounded-xl border border-white/10">
          <MapPin className="w-3.5 h-3.5 text-amber-500" />
          <span>پوینتر فعال: {activeHotspot || "روی نقاط کلیک کنید"}</span>
        </div>
      </header>

      {/* محفظه اصلی نمایش عکس پانوراما */}
      <div ref={containerRef} className="w-full h-full" />

      {/* نقشه دو‌بعدی یا پنل پلن طبقات در پایین صفحه (گوشه) */}
      <div className="absolute bottom-6 left-6 z-20 w-64 p-3 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-bold border-b border-white/10 pb-2">
          <span className="text-amber-400">نقشه دوبعدی پلان</span>
          <span className="text-[10px] text-slate-400">طبقه اول</span>
        </div>
        <div className="w-full h-28 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-center relative overflow-hidden group">
          {/* اینجا می‌توانید عکس نقشه ۲D خود را قرار دهید */}
          <span className="text-[11px] text-slate-400 font-medium">موقعیت‌نما روی پلان</span>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"></div>
        </div>
      </div>

    </main>
  );
}