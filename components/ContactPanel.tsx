"use client";

import React, { useState } from "react";
import { X, Mail, Linkedin, Copy, Check, ExternalLink } from "lucide-react";
import { ProfileMetadata } from "@/lib/types";

interface ContactPanelProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileMetadata;
}

export const ContactPanel: React.FC<ContactPanelProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md glass-chrome rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-chrome-bg">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-accent-blue" />
            <h3 className="text-sm font-bold text-gray-100">
              Get in Touch — {profile.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-200 rounded hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs text-gray-300">
          <p className="text-gray-300 leading-relaxed">
            I am actively open for Jr. Product Designer / UI/UX Designer opportunities. Feel free to reach out via direct email or LinkedIn!
          </p>

          {/* Direct Email Card */}
          <div className="p-4 rounded-lg bg-panel-card border border-white/5 space-y-2">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
              Direct Email
            </span>
            <div className="flex items-center justify-between bg-black/40 p-2.5 rounded border border-white/5">
              <span className="font-mono text-gray-200 text-xs truncate">
                {profile.email}
              </span>
              <button
                onClick={handleCopyEmail}
                className="flex items-center space-x-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-200 text-[11px] transition-colors shrink-0"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* LinkedIn Link Card */}
          <div className="p-4 rounded-lg bg-panel-card border border-white/5 space-y-2">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
              Professional Profile
            </span>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-black/40 p-2.5 rounded border border-white/5 hover:border-accent-blue/40 group transition-colors"
            >
              <div className="flex items-center space-x-2 text-gray-200">
                <Linkedin className="w-4 h-4 text-accent-blue" />
                <span className="font-medium text-xs">LinkedIn Profile</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-accent-blue transition-colors" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-chrome-bg border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
