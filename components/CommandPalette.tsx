"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/types";
import { Search, FileText, Mail, ArrowRight, X, Command } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onOpenResume: () => void;
  onOpenContact: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  projects,
  onOpenResume,
  onOpenContact,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Build items list
  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.oneLineDescription.toLowerCase().includes(query.toLowerCase())
  );

  const actions = [
    {
      id: "action-resume",
      type: "action",
      title: "View & Download Resume",
      subtitle: "Open resume viewer modal",
      handler: () => {
        onClose();
        onOpenResume();
      },
    },
    {
      id: "action-contact",
      type: "action",
      title: "Contact Candidate",
      subtitle: "Email & LinkedIn links",
      handler: () => {
        onClose();
        onOpenContact();
      },
    },
  ];

  const allItems = [
    ...filteredProjects.map((p) => ({
      id: p.slug,
      type: "project",
      title: p.title,
      subtitle: p.oneLineDescription,
      handler: () => {
        onClose();
        router.push(`/project/${p.slug}`);
      },
    })),
    ...actions.filter((a) =>
      a.title.toLowerCase().includes(query.toLowerCase())
    ),
  ];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard Navigation Listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, allItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + allItems.length) % Math.max(1, allItems.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          allItems[selectedIndex].handler();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, allItems, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      {/* Dialog Window */}
      <div className="w-full max-w-xl glass-chrome rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-white/10 space-x-3 bg-chrome-bg">
          <Search className="w-4 h-4 text-accent-blue" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search projects, resume, or contact..."
            className="flex-1 bg-transparent border-0 outline-none text-sm text-gray-100 placeholder-gray-500 font-sans"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-200 rounded hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {allItems.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400 font-mono">
              No matching projects or actions found for "{query}"
            </div>
          ) : (
            allItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.handler}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                    isSelected
                      ? "bg-accent-blue/20 border border-accent-blue/40 text-white"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    {item.type === "project" ? (
                      <FileText className="w-4 h-4 text-accent-blue shrink-0" />
                    ) : (
                      <Command className="w-4 h-4 text-accent-indigo shrink-0" />
                    )}
                    <div className="truncate">
                      <div className="text-xs font-semibold text-gray-200">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "text-accent-blue" : "opacity-0"}`} />
                </button>
              );
            })
          )}
        </div>

        {/* Dialog Footer */}
        <div className="px-4 py-2 bg-chrome-bg/90 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="text-accent-blue">Quick Command Palette</span>
        </div>
      </div>
    </div>
  );
};
