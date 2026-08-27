"use client";

import React from "react";
import { Hash } from "lucide-react";

interface SectionBlockProps {
  id: string;
  title: string;
  badge?: string;
  children: React.ReactNode;
}

export const SectionBlock: React.FC<SectionBlockProps> = ({
  id,
  title,
  badge,
  children,
}) => {
  return (
    <section
      id={id}
      className="scroll-mt-16 rounded-xl p-5 sm:p-6 bg-[#2C2C2C] border border-figma-border space-y-4 shadow-figma-card"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-figma-border pb-3">
        <div className="flex items-center space-x-2">
          <a
            href={`#${id}`}
            className="text-figma-textMuted hover:text-figma-active transition-colors group"
            title="Section anchor"
          >
            <Hash className="w-4 h-4 text-figma-active" />
          </a>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {title}
          </h2>
        </div>

        {badge && (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-figma-active text-white font-semibold">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="text-xs sm:text-sm text-figma-textSecondary leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
};
