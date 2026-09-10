// components/DashboardTabs.tsx
"use client";

import React from "react";
import { HomeTab } from "../tabs/HomeTab";
import { ReportsTab } from "../tabs/ReportsTab";
import { MessagesTab } from "../tabs/MessagesTab";
import { TransactionsTab } from "../tabs/TransactionsTab";
import { NewProjectTab } from "../tabs/NewProjectTab";
import { ProfileTab } from "../tabs/ProfileTab"; // اضافه شد

export function highlightText(text: string, query: string, isDark: boolean) {
  if (!query || !query.trim()) return text;

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

export const tabComponentsList = {
  home: HomeTab,
  reports: ReportsTab,
  messages: MessagesTab,
  transactions: TransactionsTab,
  newProject: NewProjectTab,
  profile: ProfileTab, // اضافه شد
};