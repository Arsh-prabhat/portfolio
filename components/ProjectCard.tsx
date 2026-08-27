"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/types";
import { ArrowUpRight, Sparkles, Hash } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  groupLabel?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  groupLabel = "user app",
}) => {
  const isFeatured = project.featured;

  return (
    <div className="space-y-1.5">
      {/* Figma Frame Group Label Tag (matches top of frames in screenshot) */}
      <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-[#2C2C2C] border border-figma-border text-[11px] font-mono text-white select-none">
        <Hash className="w-3 h-3 text-figma-active" />
        <span>{groupLabel}</span>
      </div>

      <Link href={`/project/${project.slug}`} className="block group focus:outline-none">
        <article
          className={`figma-selection-box rounded-xl overflow-hidden transition-all duration-150 bg-[#2C2C2C] border ${
            isFeatured
              ? "border-figma-active shadow-figma-card"
              : "border-figma-border hover:border-figma-active"
          }`}
        >
          {/* Thumbnail Container */}
          <div className="relative aspect-[16/9] w-full bg-[#181818] border-b border-figma-border overflow-hidden">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200 ease-out"
            />

            {isFeatured && (
              <div className="absolute top-2.5 right-2.5 flex items-center space-x-1 px-2 py-0.5 rounded bg-figma-active text-white text-[10px] font-bold tracking-wide uppercase shadow">
                <Sparkles className="w-3 h-3" />
                <span>Featured</span>
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-figma-textMuted uppercase">
                {project.timeline}
              </span>
              <div className="flex items-center space-x-1 text-figma-textSecondary group-hover:text-figma-active transition-colors">
                <span className="text-xs font-semibold">Inspect</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-figma-active transition-colors leading-snug">
              {project.title}
            </h3>

            <p className="text-xs text-figma-textSecondary line-clamp-2 leading-relaxed">
              {project.oneLineDescription}
            </p>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-1 pt-1 border-t border-figma-border">
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1E1E1E] text-figma-textSecondary border border-figma-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
};
