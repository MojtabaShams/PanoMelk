// app/dashboard/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import localFont from "next/font/local";
import {
  Home,
  BarChart3,
  MessageSquare,
  CreditCard,
  X
} from "lucide-react";

import {
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelHeaderProps,
  IDockviewHeaderActionsProps,
  themeAbyssSpaced,
  themeLightSpaced,
} from 'dockview-react';

import 'dockview/dist/styles/dockview.css';

import { Sidebar, MenuItem } from "@/components/Sidebar/Sidebar";
import { tabComponentsList } from "@/components/DashboardTabs/DashboardTabs";

const iranSans = localFont({
  src: [
    { path: "../../public/fonts/IRANSansWeb(FaNum).woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/IRANSansWeb(FaNum).woff", weight: "400", style: "normal" },
  ],
  variable: "--font-iransans",
});

const bgImageDark = "/back-dark-dash.svg";
const bgImageLight = "/back-white-dash.jpg";

const tabHeaderComponents = {
  default: (props: IDockviewPanelHeaderProps) => {
    const isHome = props.api.id === 'home';

    const handleClose = (e: React.MouseEvent) => {
      e.stopPropagation();
      props.api.close();
    };

    return (
      <div className="px-3 py-1.5 text-xs select-none flex items-center justify-between gap-2.5 h-full w-full">
        <span className="dockview-tab-title font-medium">
          {props.api.title}
        </span>

        {!isHome && (
          <button
            onClick={handleClose}
            className="dockview-tab-close-btn p-0.5 rounded-md transition-colors cursor-pointer"
            title="بستن تب"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  },
};

export default function DashboardPage() {
  const [isDark, setIsDark] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const dockviewApiRef = useRef<any>(null);

  useEffect(() => {
    const api = dockviewApiRef.current;
    if (!api) return;

    api.panels.forEach((panel: any) => {
      panel.update({
        params: { ...panel.params, isDark }
      });
    });
  }, [isDark]);

  // app/dashboard/page.tsx (بخش مدیریت انقضای نشست)
useEffect(() => {
  let inactivityTimer: NodeJS.Timeout;
  let sessionCheckTimer: NodeJS.Timeout;
  let lastSessionCheck = 0;

  const resetInactivityTimer = async () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      // هدایت به لاگین بعد از ۱۰ دقیقه بی‌توبودن/کار نکردن
      window.location.href = "/login?expired=true";
    }, 10 * 60 * 1000); // 10 دقیقه

    if (Date.now() - lastSessionCheck > 30000) {
      lastSessionCheck = Date.now();
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const session = await response.json();
        if (!session?.user) {
          window.location.href = "/login?expired=true";
        }
      } catch {
        // A temporary network failure should not log the user out.
      }
    }
  };

  window.addEventListener("mousemove", resetInactivityTimer);
  window.addEventListener("keypress", resetInactivityTimer);
  window.addEventListener("click", resetInactivityTimer);
  window.addEventListener("scroll", resetInactivityTimer);

  resetInactivityTimer();
  sessionCheckTimer = setInterval(() => {
    void resetInactivityTimer();
  }, 30000);

  return () => {
    clearTimeout(inactivityTimer);
    clearInterval(sessionCheckTimer);
    window.removeEventListener("mousemove", resetInactivityTimer);
    window.removeEventListener("keypress", resetInactivityTimer);
    window.removeEventListener("click", resetInactivityTimer);
    window.removeEventListener("scroll", resetInactivityTimer);
  };
}, []);

  useEffect(() => {
    const handleOpenTabEvent = (e: any) => {
      const { id, title, component, params } = e.detail;
      const api = dockviewApiRef.current;
      if (!api) return;

      const existingPanel = api.getPanel(id);
      if (existingPanel) {
        existingPanel.api.setActive();
      } else {
        const mainPanel = api.getPanel('home');
        api.addPanel({
          id,
          component,
          title,
          tabComponent: 'default',
          params: { isDark },
          position: { referenceGroup: mainPanel?.group }
        });
      }
    };

    window.addEventListener("open-dashboard-tab", handleOpenTabEvent);
    return () => window.removeEventListener("open-dashboard-tab", handleOpenTabEvent);
  }, [isDark]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const menuItems: MenuItem[] = [
    { id: "home", label: "صفحه اصلی", icon: Home, component: "home" },
    { id: "reports", label: "گزارشات", icon: BarChart3, component: "reports" },
    { id: "messages", label: "پیام‌ها", icon: MessageSquare, component: "messages" },
    { id: "transactions", label: "تراکنش‌ها", icon: CreditCard, component: "transactions" },
  ];

  const openTab = (id: string, title: string, component: string) => {
    const api = dockviewApiRef.current;
    if (!api) return;

    setActiveTab(id);

    const existingPanel = api.getPanel(id);
    if (existingPanel) {
      existingPanel.api.setActive();
    } else {
      const mainPanel = api.getPanel('home');
      api.addPanel({
        id,
        component,
        title,
        tabComponent: 'default',
        params: { isDark },
        position: { referenceGroup: mainPanel?.group }
      });
    }
  };

  return (
    <div className={`${iranSans.className} min-h-screen w-full relative overflow-hidden transition-colors duration-500 ${isDark ? "bg-[#07080C] text-slate-100" : "bg-slate-100 text-slate-900"}`} dir="rtl">

      <style jsx global>{`
        .custom-sidebar-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb {
          background: ${isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)"};
          border-radius: 20px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? "rgba(245, 158, 11, 0.5)" : "rgba(217, 119, 6, 0.5)"};
        }
      `}</style>

      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 transition-all duration-700"
        style={{ backgroundImage: `url('${isDark ? bgImageDark : bgImageLight}')` }}
      >
        <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? "bg-[#07080C]/40 backdrop-blur-[2px]" : "bg-white/10 backdrop-blur-[2px]"}`} />
      </div>

      <div className="relative z-10 flex min-h-screen p-3 gap-3">

        <Sidebar
          isDark={isDark}
          setIsDark={setIsDark}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          menuItems={menuItems}
          activeTab={activeTab}
          onOpenTab={openTab}
        />

        <main className={`flex-1 rounded-3xl border backdrop-blur-md overflow-hidden transition-all relative ${isDark
            ? "bg-slate-950/20 border-white/10 text-slate-100"
            : "bg-white/20 border-white/40 text-slate-900"
          }`}>
          <div style={{ height: '100%', width: '100%' }} dir="rtl">
            <DockviewReact
              components={tabComponentsList}
              tabComponents={tabHeaderComponents}
              theme={isDark ? themeAbyssSpaced : themeLightSpaced}
              onReady={(event: DockviewReadyEvent) => {
                dockviewApiRef.current = event.api;

                event.api.addPanel({
                  id: 'home',
                  component: 'home',
                  tabComponent: 'default',
                  params: { isDark },
                  title: "صفحه اصلی"
                });
              }}
            />
          </div>
        </main>

      </div>
    </div>
  );
}