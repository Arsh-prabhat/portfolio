"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { LayersPanel } from "@/components/LayersPanel";
import { Canvas } from "@/components/Canvas";
import { InspectorPanel } from "@/components/InspectorPanel";
import { ProjectCard } from "@/components/ProjectCard";
import { getProfile, getAllProjects } from "@/lib/content";
import { Sparkles, Layers, ShieldCheck, User } from "lucide-react";

export default function HomePage() {
  const profile = getProfile();
  const projects = getAllProjects();

  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <AppShell contextLabel="Home — Page 1 Canvas">
      {/* 2. Left Layers Tree Panel */}
      <LayersPanel mode="projectList" projects={projects} />

      {/* 3. Central Dark Canvas Container */}
      <Canvas>
        <div className="space-y-8">
          {/* Candidate Hero Frame Card */}
          <header className="rounded-xl p-6 bg-[#2C2C2C] border border-figma-border space-y-4 shadow-figma-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Open for UI/UX Design Roles
                </span>
              </div>
              <span className="font-mono text-xs text-figma-textMuted">
                {profile.location}
              </span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {profile.name} — <span className="text-figma-active">{profile.title}</span>
              </h1>
              <p className="text-xs sm:text-sm text-figma-textSecondary font-medium max-w-3xl leading-relaxed">
                {profile.positioning}
              </p>
            </div>

            <p className="text-xs text-figma-textSecondary max-w-3xl leading-relaxed border-t border-figma-border pt-3">
              {profile.bio}
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
              <div className="flex items-center space-x-1.5 text-accent-indigo font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>HoocAI & Mockmate Internships</span>
              </div>
              <div className="flex items-center space-x-1.5 text-figma-active font-semibold">
                <Layers className="w-4 h-4" />
                <span>Smart India Hackathon 2025 Top 50</span>
              </div>
            </div>
          </header>

          {/* Featured Case Studies Grid (Group tag: user app) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-figma-border pb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Featured Case Studies (Strong Work)
                </h2>
              </div>
              <span className="text-xs text-figma-textMuted font-mono">
                {featuredProjects.length} Frames
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} groupLabel="user app" />
              ))}
            </div>
          </section>

          {/* Other Projects Grid (Group tag: components / logos) */}
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-figma-border pb-2">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-figma-active" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Systems & Core UI Work
                </h2>
              </div>
              <span className="text-xs text-figma-textMuted font-mono">
                {otherProjects.length} Frames
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {otherProjects.map((project, idx) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  groupLabel={idx === 0 ? "components" : "logos"}
                />
              ))}
            </div>
          </section>
        </div>
      </Canvas>

      {/* 4. Right Inspector Panel */}
      <InspectorPanel designDecisions={projects[0]?.designDecisions || []} />
    </AppShell>
  );
}
