"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { LayersPanel, SectionNavItem } from "@/components/LayersPanel";
import { Canvas } from "@/components/Canvas";
import { InspectorPanel } from "@/components/InspectorPanel";
import { SectionBlock } from "@/components/SectionBlock";
import { PrototypeEmbed } from "@/components/PrototypeEmbed";
import { getProjectBySlug } from "@/lib/content";
import { ArrowLeft, Star, Hash } from "lucide-react";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return notFound();
  }

  // Section nav items
  const sectionsNav: SectionNavItem[] = [
    { id: "sec-problem", label: "Problem Statement" },
    ...(project.sections.process ? [{ id: "sec-process", label: "Process & Insights" }] : []),
    { id: "sec-screens", label: "Visual Design & Screens" },
    ...(project.hasPrototype && project.prototype ? [{ id: "sec-prototype", label: "Interactive Prototype" }] : []),
    { id: "sec-outcome", label: "Outcome & Shipped Impact" },
    { id: "sec-learnings", label: "Reflective Learnings" },
  ];

  const [activeSectionId, setActiveSectionId] = useState<string>("sec-problem");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (let i = sectionsNav.length - 1; i >= 0; i--) {
        const elem = document.getElementById(sectionsNav[i].id);
        if (elem && elem.offsetTop <= scrollPos) {
          setActiveSectionId(sectionsNav[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionsNav]);

  const handleSelectSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AppShell contextLabel={`Frame / ${project.title}`}>
      {/* 2. Left Layers Panel (Section Jump Nav) */}
      <LayersPanel
        mode="sectionList"
        sections={sectionsNav}
        activeSectionId={activeSectionId}
        onSelectSection={handleSelectSection}
      />

      {/* 3. Central Scrolling Canvas */}
      <Canvas>
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-figma-textSecondary hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Canvas Overview</span>
          </Link>

          {/* Frame Header Card */}
          <header className="rounded-xl p-6 bg-[#2C2C2C] border border-figma-border space-y-4 shadow-figma-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-figma-active text-white font-semibold">
                  FRAME: {project.slug}
                </span>
                {project.featured && (
                  <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-semibold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>Featured Case Study</span>
                  </span>
                )}
              </div>
              <span className="font-mono text-xs text-figma-textMuted">
                {project.timeline}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>

            <p className="text-xs sm:text-sm text-figma-textSecondary font-medium leading-relaxed">
              {project.oneLineDescription}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-figma-border font-mono text-xs">
              <div className="space-y-1">
                <div className="text-figma-textMuted uppercase text-[10px]">My Role</div>
                <div className="text-white font-semibold">{project.role}</div>
              </div>
              <div className="space-y-1">
                <div className="text-figma-textMuted uppercase text-[10px]">Timeline</div>
                <div className="text-white font-semibold">{project.timeline}</div>
              </div>
              {project.team && (
                <div className="space-y-1">
                  <div className="text-figma-textMuted uppercase text-[10px]">Team / Recognition</div>
                  <div className="text-white font-semibold">{project.team}</div>
                </div>
              )}
            </div>
          </header>

          {/* Section 1: Problem */}
          <SectionBlock id="sec-problem" title="Problem & Context" badge="01">
            <p className="text-figma-textSecondary leading-relaxed text-xs sm:text-sm">
              {project.sections.problem}
            </p>
          </SectionBlock>

          {/* Section 2: Process */}
          {project.sections.process && (
            <SectionBlock id="sec-process" title="Process & Insights" badge="02">
              <p className="text-figma-textSecondary leading-relaxed text-xs sm:text-sm">
                {project.sections.process}
              </p>
            </SectionBlock>
          )}

          {/* Section 3: Visual Design & Screens */}
          <SectionBlock id="sec-screens" title="Final Visual Design & Screens" badge="03">
            <div className="space-y-6">
              {project.sections.screens.map((media, idx) => (
                <figure
                  key={idx}
                  className="rounded-xl overflow-hidden bg-[#181818] border border-figma-border p-3 space-y-2"
                >
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-black">
                    <Image
                      src={media.src}
                      alt={media.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {media.caption && (
                    <figcaption className="text-xs text-figma-textMuted italic px-1 pt-1 font-sans">
                      {media.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </SectionBlock>

          {/* Section 4: Prototype */}
          {project.hasPrototype && project.prototype && (
            <SectionBlock id="sec-prototype" title="Interactive Prototype Embed" badge="04">
              <PrototypeEmbed prototype={project.prototype} />
            </SectionBlock>
          )}

          {/* Section 5: Outcome */}
          <SectionBlock id="sec-outcome" title="Outcome & Impact" badge="05">
            <p className="text-figma-textSecondary leading-relaxed text-xs sm:text-sm">
              {project.sections.outcome}
            </p>
          </SectionBlock>

          {/* Section 6: Learnings */}
          <SectionBlock id="sec-learnings" title="Reflective Learnings" badge="06">
            <p className="text-figma-textSecondary leading-relaxed text-xs sm:text-sm italic">
              "{project.sections.learnings}"
            </p>
          </SectionBlock>
        </div>
      </Canvas>

      {/* 4. Right Inspector Panel */}
      <InspectorPanel designDecisions={project.designDecisions} />
    </AppShell>
  );
}
