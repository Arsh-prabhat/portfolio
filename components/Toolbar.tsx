"use client";

import React from "react";
import Link from "next/link";
import { Play, Share2, Plus, X, Search, FileText, Mail, Command } from "lucide-react";

interface ToolbarProps {
  name?: string;
  contextLabel?: string;
  onOpenResume: () => void;
  onOpenContact: () => void;
  onOpenPalette: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  name = "Arsh Prabhat",
  contextLabel = "Matrimonial Platform",
  onOpenResume,
  onOpenContact,
  onOpenPalette,
}) => {
  const tabs = [
    { title: "Matrimonial Platform", href: "/project/matrimonial-platform", active: contextLabel.includes("Matrimonial") },
    { title: "Kolam Vidya (SIH 2025)", href: "/project/kolam-vidya-sih", active: contextLabel.includes("Kolam") },
    { title: "Mockmate UX", href: "/project/mockmate-peer-learning", active: contextLabel.includes("Mockmate") },
    { title: "HoocAI UI Kit", href: "/project/hoocai-design-system", active: contextLabel.includes("HoocAI") },
  ];

  return (
    <header className="h-10 w-full bg-figma-sidebar border-b border-figma-border flex items-center justify-between px-2 text-xs select-none z-30 shrink-0">
      {/* Left: Horizontal Figma File Tabs Bar */}
      <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar max-w-[65%]">
        {/* Main Portfolio Home Tab */}
        <Link
          href="/"
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-t-md text-xs font-medium transition-colors border-t-2 ${
            contextLabel.includes("Home")
              ? "bg-[#2C2C2C] text-white border-figma-active"
              : "text-figma-textSecondary hover:text-white hover:bg-figma-hover border-transparent"
          }`}
        >
          <span className="truncate">{name} (Portfolio)</span>
        </Link>

        {/* Dynamic Project Tabs */}
        {tabs.map((tab) => (
          <Link
            key={tab.title}
            href={tab.href}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-t-md text-xs font-medium transition-colors border-t-2 ${
              tab.active
                ? "bg-[#2C2C2C] text-white border-figma-active"
                : "text-figma-textSecondary hover:text-white hover:bg-figma-hover border-transparent"
            }`}
          >
            <span className="truncate max-w-[140px] sm:max-w-[180px]">{tab.title}</span>
            {tab.active && <X className="w-3 h-3 text-figma-textMuted hover:text-white" />}
          </Link>
        ))}

        <button
          onClick={onOpenPalette}
          className="p-1 text-figma-textMuted hover:text-white hover:bg-figma-hover rounded"
          title="Open New Tab (Cmd+K)"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Candidate Controls (Present Mode, Share, Resume, Contact) */}
      <div className="flex items-center space-x-2 shrink-0">
        <button
          onClick={onOpenPalette}
          className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded bg-[#2C2C2C] border border-figma-border text-figma-textSecondary hover:text-white transition-colors text-[11px]"
        >
          <Command className="w-3 h-3" />
          <span>Cmd+K</span>
        </button>

        <button
          onClick={onOpenResume}
          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#2C2C2C] border border-figma-border text-white hover:bg-figma-hover transition-colors text-[11px] font-medium"
        >
          <FileText className="w-3.5 h-3.5 text-accent-indigo" />
          <span>Resume</span>
        </button>

        <button
          onClick={onOpenContact}
          className="flex items-center space-x-1 px-3 py-1 rounded bg-figma-active text-white text-[11px] font-semibold hover:bg-figma-active/90 transition-colors shadow-sm"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Share / Contact</span>
        </button>

        {/* Figma Present / Play Button */}
        <Link
          href="/"
          className="w-7 h-7 rounded-full bg-[#2C2C2C] hover:bg-figma-hover border border-figma-border flex items-center justify-center text-white transition-colors"
          title="Present Mode (▷)"
        >
          <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
        </Link>
      </div>
    </header>
  );
};
