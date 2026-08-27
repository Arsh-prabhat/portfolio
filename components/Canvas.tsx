"use client";

import React from "react";

interface CanvasProps {
  children: React.ReactNode;
}

export const Canvas: React.FC<CanvasProps> = ({ children }) => {
  return (
    <main className="relative flex-1 h-full bg-figma-bg overflow-y-auto px-4 md:px-8 py-6">
      {/* Canvas Frame Group Labels Container */}
      <div className="max-w-6xl mx-auto pb-24">
        {children}
      </div>
    </main>
  );
};
