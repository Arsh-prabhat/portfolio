"use client";

import React, { useState } from "react";
import { PrototypeData } from "@/lib/types";
import { ExternalLink, Play, AlertCircle, Loader2 } from "lucide-react";

interface PrototypeEmbedProps {
  prototype: PrototypeData;
}

export const PrototypeEmbed: React.FC<PrototypeEmbedProps> = ({ prototype }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="space-y-3">
      {/* Device Frame Header */}
      <div className="flex items-center justify-between px-3 py-2 rounded-t-lg bg-chrome-bg border border-white/10 font-mono text-xs text-gray-400">
        <div className="flex items-center space-x-2">
          <Play className="w-3.5 h-3.5 text-accent-blue" />
          <span className="font-semibold text-gray-200">Figma Interactive Prototype</span>
        </div>
        <a
          href={prototype.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-accent-blue hover:underline text-[11px]"
        >
          <span>Open in New Tab</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Frame Container */}
      <div className="relative aspect-[16/10] w-full bg-black rounded-b-lg border border-t-0 border-white/10 overflow-hidden shadow-2xl">
        {/* Loading Spinner */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-canvas/90 space-y-3 text-gray-400">
            <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
            <span className="text-xs font-mono">Loading Figma Prototype Embed...</span>
          </div>
        )}

        {/* Error Fallback State */}
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-canvas p-6 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-400" />
            <p className="text-xs text-gray-300 max-w-md leading-relaxed">
              {prototype.fallbackDescription}
            </p>
            <a
              href={prototype.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded bg-accent-blue text-white text-xs font-medium hover:bg-accent-blue/90 transition-colors"
            >
              Direct Link to Figma Prototype →
            </a>
          </div>
        ) : (
          <iframe
            src={prototype.embedUrl}
            className="w-full h-full border-0"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            title="Interactive Figma Prototype"
          />
        )}
      </div>

      {/* Fallback Text Description */}
      <p className="text-xs text-gray-400 italic">
        {prototype.fallbackDescription}
      </p>
    </div>
  );
};
