import React, { useState } from 'react';
import { Sparkles, HelpCircle, X, FileText, Download, Target, CheckCircle } from 'lucide-react';

interface NavbarProps {
  onReset?: () => void;
  hasData?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, hasData }) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
      <header className="no-print border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white tracking-tight text-base sm:text-lg">
                  Resume & CV Reviser
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI ATS Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Adapts your authentic skillsets to match target Job Descriptions and generates PDF resumes
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowGuide(true)}
              className="text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">How It Works</span>
            </button>

            {hasData && (
              <button
                type="button"
                onClick={onReset}
                className="text-xs text-slate-400 hover:text-rose-300 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                New Session
              </button>
            )}
          </div>
        </div>
      </header>

      {/* QUICK GUIDE MODAL */}
      {showGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-indigo-400 mb-3">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">How Does the Resume Reviser Work?</h3>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Designed to help you pass Applicant Tracking Systems (ATS) and impress hiring managers by tailoring your actual experience to the employer’s exact requirements:
            </p>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Upload Current PDF Resume</strong>
                  Upload your existing PDF resume (or paste text). The AI reads your career history, achievements, and technical skills.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="w-6 h-6 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Paste Target Job Description (JD)</strong>
                  Paste the full job posting from LinkedIn, Indeed, or company careers page to extract essential keywords, competencies, and deliverables.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="w-6 h-6 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Intelligent Skillset Re-alignment</strong>
                  Bullet points are restructured using the STAR method (Action + Context + Quantifiable Result) with natural keyword integration.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="w-6 h-6 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0">
                  4
                </span>
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Download Professional PDF Documents</strong>
                  Get a tailored 1-2 page Resume, a Comprehensive Curriculum Vitae (CV), and a matching Cover Letter ready for instant PDF export.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors"
            >
              Got it, let’s start!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
