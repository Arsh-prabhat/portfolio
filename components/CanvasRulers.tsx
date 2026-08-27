"use client";

import React from "react";

export const HorizontalRuler: React.FC = () => {
  const points = [-2500, 0, 2500, 5000, 7500, 10000, 12500, 15000, 17500];

  return (
    <div className="h-6 w-full bg-figma-bg border-b border-figma-border flex items-center justify-between px-12 text-[10px] font-mono text-figma-textMuted select-none overflow-hidden shrink-0">
      {points.map((pt) => (
        <div key={pt} className="flex items-center space-x-1">
          <div className="h-2 w-px bg-figma-border"></div>
          <span>{pt}</span>
        </div>
      ))}
    </div>
  );
};

export const VerticalRuler: React.FC = () => {
  const points = [-2500, 0, 2500, 5000, 7500, 10000, 12500];

  return (
    <div className="w-6 h-full bg-figma-bg border-r border-figma-border flex flex-col justify-between py-12 text-[9px] font-mono text-figma-textMuted select-none overflow-hidden shrink-0">
      {points.map((pt) => (
        <div key={pt} className="flex items-center space-y-1 transform -rotate-90">
          <span>{pt}</span>
        </div>
      ))}
    </div>
  );
};
