"use client";

import React from "react";
import { X, Download, FileText, Briefcase, GraduationCap, Award, Github, Linkedin, Phone, Mail, MapPin } from "lucide-react";
import { ProfileMetadata } from "@/lib/types";

interface ResumeViewerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileMetadata;
}

export const ResumeViewer: React.FC<ResumeViewerProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl glass-chrome rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-chrome-bg">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-accent-indigo" />
            <h3 className="text-sm font-bold text-gray-100">
              Resume — {profile.name} ({profile.title})
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-gray-300">
          {/* Candidate Info Header */}
          <div className="space-y-2 pb-4 border-b border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100">{profile.name}</h2>
            <p className="text-accent-blue font-semibold">{profile.title}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 font-mono">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-gray-500" />
                <span>{profile.location}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Mail className="w-3 h-3 text-gray-500" />
                <span>{profile.email}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Phone className="w-3 h-3 text-gray-500" />
                <span>+91 8791364253</span>
              </span>
            </div>
            <div className="flex items-center space-x-3 pt-1">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-accent-blue hover:underline"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>linkedin.com/in/arsh-prabhat</span>
              </a>
              <a
                href="https://github.com/Arsh-prabhat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-gray-300 hover:text-white hover:underline"
              >
                <Github className="w-3.5 h-3.5" />
                <span>github.com/Arsh-prabhat</span>
              </a>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs uppercase tracking-wider text-accent-indigo font-bold flex items-center space-x-1.5">
              <span>Core Skills & Tools</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-panel-card border border-white/5 space-y-1">
                <div className="text-accent-blue font-semibold">UI/UX Design</div>
                <div className="text-gray-400">Wireframing, Prototyping, User Research, Usability Testing, Design Systems</div>
              </div>
              <div className="p-2.5 rounded bg-panel-card border border-white/5 space-y-1">
                <div className="text-accent-indigo font-semibold">Tools & Tech</div>
                <div className="text-gray-400">Figma, Framer, Adobe XD, Canva, Notion, GitHub, Python, SQL</div>
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="space-y-3 pt-2">
            <h4 className="font-mono text-xs uppercase tracking-wider text-accent-indigo font-bold flex items-center space-x-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Internship Experience</span>
            </h4>
            
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-panel-card border border-white/5 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-gray-100">UX Design Intern</h5>
                    <p className="text-accent-blue text-xs font-mono">HoocAI Technologies</p>
                  </div>
                  <span className="figma-badge text-gray-400 font-mono">Jan 2026 – Present</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-300">
                  <li>Designed user experiences for 8+ client products across healthcare, e-commerce, wellness, and service domains.</li>
                  <li>Created user flows, wireframes, prototypes, and high-fidelity interfaces while collaborating with cross-functional teams.</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-panel-card border border-white/5 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-gray-100">UI/UX Design Intern</h5>
                    <p className="text-accent-blue text-xs font-mono">Mockmate</p>
                  </div>
                  <span className="figma-badge text-gray-400 font-mono">Aug 2025 – Oct 2025</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-300">
                  <li>Designed user experiences for a peer-learning platform connecting students with interview partners and study mates.</li>
                  <li>Created wireframes, prototypes, and high-fidelity designs collaborating with developers to enhance engagement.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Projects & Hackathons */}
          <div className="space-y-3 pt-2">
            <h4 className="font-mono text-xs uppercase tracking-wider text-accent-indigo font-bold flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Projects & Hackathons</span>
            </h4>
            
            <div className="p-4 rounded-lg bg-panel-card border border-white/5 space-y-2">
              <div className="flex justify-between items-start">
                <h5 className="font-bold text-gray-100">Kolam Vidya — Smart India Hackathon 2025</h5>
                <span className="figma-badge text-amber-400 border-amber-400/30">Top 50 Nationwide</span>
              </div>
              <p className="text-xs text-gray-300">
                Secured 2nd position in college round of Smart India Hackathon 2025. Contributed UI/UX design and computer vision analyzer module for digitizing cultural Kolam patterns.
              </p>
            </div>
          </div>

          {/* Leadership & Education */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <h4 className="font-mono text-xs uppercase tracking-wider text-accent-indigo font-bold flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Leadership</span>
              </h4>
              <div className="p-3 rounded-lg bg-panel-card border border-white/5 space-y-1">
                <div className="font-bold text-gray-100 text-xs">General Secretary & UI/UX Lead</div>
                <div className="text-accent-blue font-mono text-[11px]">Kinesis Technical Society (2025–Present)</div>
                <p className="text-[11px] text-gray-400">Leading UI/UX initiatives and technical events across student teams.</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-mono text-xs uppercase tracking-wider text-accent-indigo font-bold flex items-center space-x-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Education</span>
              </h4>
              <div className="p-3 rounded-lg bg-panel-card border border-white/5 space-y-1">
                <div className="font-bold text-gray-100 text-xs">KIET Group of Institutions</div>
                <div className="text-gray-300 text-[11px]">B.Tech, Computer Science & IT (2023 – 2027)</div>
                <div className="text-gray-400 text-[10px] pt-1">K.L. International School: Class XII (89.6%) • Class X (93.5%)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-chrome-bg border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-400">
            PDF Version Ready
          </span>
          <a
            href={profile.resumeUrl}
            download
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-accent-blue text-white text-xs font-semibold hover:bg-accent-blue/90 transition-colors shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download Resume PDF</span>
          </a>
        </div>
      </div>
    </div>
  );
};
