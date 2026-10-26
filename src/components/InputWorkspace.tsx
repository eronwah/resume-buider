import React, { useState, useRef } from 'react';
import { SAMPLE_PRESETS, SamplePreset } from '../data/samplePresets';
import {
  FileUp,
  Briefcase,
  Sparkles,
  ArrowRight,
  Loader2,
  Wand2,
  CheckCircle2,
  Trash2,
  FileText,
  Sliders,
  AlertCircle,
} from 'lucide-react';

interface InputWorkspaceProps {
  currentResume: string;
  setCurrentResume: (val: string) => void;
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  pdfBase64: string | null;
  setPdfBase64: (base64: string | null) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
  tone: string;
  setTone: (val: string) => void;
  focusNotes: string;
  setFocusNotes: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  loadingStage: string;
  progressPercent?: number;
  stageIndex?: number;
}

export const InputWorkspace: React.FC<InputWorkspaceProps> = ({
  currentResume,
  setCurrentResume,
  pdfFile,
  setPdfFile,
  pdfBase64,
  setPdfBase64,
  jobDescription,
  setJobDescription,
  tone,
  setTone,
  focusNotes,
  setFocusNotes,
  onSubmit,
  isLoading,
  loadingStage,
  progressPercent = 0,
  stageIndex = 1,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [inputMode, setInputMode] = useState<'pdf' | 'text'>('pdf');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApplyPreset = (preset: SamplePreset) => {
    setSelectedPresetId(preset.id);
    setCurrentResume(preset.currentResume);
    setPdfFile(null);
    setPdfBase64(null);
    setInputMode('text');
    setJobDescription(preset.jobDescription);
  };

  const processSelectedFile = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please upload a valid PDF file (.pdf)');
      return;
    }

    setPdfFile(file);
    setSelectedPresetId('');

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPdfBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
    setPdfBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isReadyToSubmit = (Boolean(pdfBase64) || Boolean(currentResume.trim())) && Boolean(jobDescription.trim());

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* 1. COMPACT HERO BANNER (Significantly reduced in height as requested) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/90 rounded-xl px-5 py-3.5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Tailor Your Resume & CV to Any Job Description
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 text-[10px] font-semibold">
              <Sparkles className="w-3 h-3" /> ATS Engine
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">
            Upload your PDF resume, paste the target Job Description, and generate tailored PDF documents.
          </p>
        </div>

        {/* 1-Click Sample Presets */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Wand2 className="w-3 h-3 text-amber-400" /> Presets:
          </span>
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className={`text-[11px] px-2.5 py-1 rounded-md border font-medium transition-all ${
                selectedPresetId === preset.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. GENERATE BUTTON & LIVE PROGRESS BAR WITH PERCENTAGE */}
      <div className="flex flex-col items-center justify-center pt-1 pb-1 w-full">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !isReadyToSubmit}
          className="w-full sm:w-auto min-w-[360px] bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>Tailoring Documents... {progressPercent}%</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>Revise Resume & Generate PDF Documents</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {!isLoading && !isReadyToSubmit && (
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            Please provide both your Resume (PDF or text) and the target Job Description below.
          </p>
        )}

        {/* INTERACTIVE PROGRESS BAR WITH PERCENTAGE & LIVE STAGES */}
        {isLoading && (
          <div className="w-full max-w-2xl mt-4 bg-slate-900/95 border border-indigo-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-indigo-950/70 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            {/* Header: Status and Percentage */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Tailoring & Generation In Progress
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-emerald-300 font-mono tracking-tight">
                  {progressPercent}%
                </span>
              </div>
            </div>

            {/* Glowing Smooth Progress Bar */}
            <div className="relative w-full h-3.5 sm:h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/80 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300 ease-out relative"
                style={{ width: `${Math.max(progressPercent, 5)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>

            {/* Stage Title & Details */}
            <div className="mt-3 flex items-start gap-2.5">
              <div className="p-1.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shrink-0 mt-0.5">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-100">
                  {loadingStage || 'Analyzing target job description and revising experience...'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Step {stageIndex} of 5 • Preserving all work dates, genuine company names, and 2 reference contact numbers.
                </p>
              </div>
            </div>

            {/* 5-Stage Checklist Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mt-3.5 pt-3 border-t border-slate-800/90 text-[10px] text-center font-medium">
              <div className={`p-1.5 rounded-lg border transition-all ${stageIndex >= 1 ? 'bg-indigo-950/70 border-indigo-500/60 text-indigo-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                <span className="block font-semibold">1. PDF Scan</span>
                <span className="text-[9px] opacity-80">Career & Refs</span>
              </div>
              <div className={`p-1.5 rounded-lg border transition-all ${stageIndex >= 2 ? 'bg-indigo-950/70 border-indigo-500/60 text-indigo-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                <span className="block font-semibold">2. JD Match</span>
                <span className="text-[9px] opacity-80">ATS Keywords</span>
              </div>
              <div className={`p-1.5 rounded-lg border transition-all ${stageIndex >= 3 ? 'bg-indigo-950/70 border-indigo-500/60 text-indigo-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                <span className="block font-semibold">3. Bullets</span>
                <span className="text-[9px] opacity-80">STAR Impact</span>
              </div>
              <div className={`p-1.5 rounded-lg border transition-all ${stageIndex >= 4 ? 'bg-indigo-950/70 border-indigo-500/60 text-indigo-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                <span className="block font-semibold">4. Refs & Edu</span>
                <span className="text-[9px] opacity-80">Verbatim Contacts</span>
              </div>
              <div className={`col-span-2 sm:col-span-1 p-1.5 rounded-lg border transition-all ${stageIndex >= 5 ? 'bg-indigo-950/70 border-indigo-500/60 text-indigo-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                <span className="block font-semibold">5. Generate</span>
                <span className="text-[9px] opacity-80">Resume + CV</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. TAILORING PREFERENCES & STRATEGY (MOVED DIRECTLY BELOW GENERATE BUTTON) */}
      <div className="bg-slate-900/85 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Tailoring Preferences & Strategy
          </h3>
          <span className="text-[10px] text-slate-500">Configures AI revision tone and ATS focus</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Tone Selector */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              ATS Strategy & Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ats-optimized">ATS High-Impact & Direct (Optimized for Automated Screeners)</option>
              <option value="executive">Executive & Strategic (Leadership, High ROI, Scale & Governance)</option>
              <option value="technical">Technical Specialist (Architecture, Frameworks, Systems & Metrics)</option>
              <option value="modern-growth">High-Growth Startup (Speed, Agility, Autonomy & Impact)</option>
            </select>
          </div>

          {/* Focus Notes */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Custom Focus Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Emphasize TypeScript, Next.js, and remote team leadership"
              value={focusNotes}
              onChange={(e) => setFocusNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* 4. DUAL WORKSPACE COLUMNS (BOX 1 AND BOX 2 BELOW THE STRATEGY & BUTTON) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
        {/* COLUMN 1: CURRENT RESUME (PDF FILE UPLOAD OR TEXT) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                  <FileUp className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    1. Your Current Resume (.PDF)
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Upload your existing resume PDF file
                  </p>
                </div>
              </div>

              {/* Mode Toggle: PDF File vs Raw Text */}
              <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setInputMode('pdf')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    inputMode === 'pdf'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  PDF File
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('text')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    inputMode === 'text'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {inputMode === 'pdf' ? (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {pdfFile ? (
                  /* Uploaded PDF State Card */
                  <div className="bg-slate-950 border border-indigo-500/40 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden min-h-[310px]">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-inner">
                      <FileText className="w-7 h-7" />
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                        <CheckCircle2 className="w-4 h-4" /> Ready for AI Analysis
                      </div>
                      <h4 className="font-bold text-sm text-white max-w-xs truncate mx-auto">
                        {pdfFile.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {(pdfFile.size / 1024).toFixed(1)} KB • PDF Document
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                      >
                        Change PDF
                      </button>
                      <button
                        type="button"
                        onClick={handleRemovePdf}
                        className="text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/30 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Drag and Drop Zone */
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[310px] ${
                      isDragging
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-700 hover:border-slate-500 bg-slate-950/60 hover:bg-slate-950'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2.5">
                      <FileUp className="w-6 h-6" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white mb-1">
                      Click to upload or drag & drop your PDF Resume
                    </h3>
                    <p className="text-[11px] text-slate-400 max-w-xs mb-3">
                      Standard PDF documents are supported. Gemini reads the exact structure, experience, and contact details.
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg font-medium">
                      Select .PDF file
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Raw Text Area fallback */
              <textarea
                value={currentResume}
                onChange={(e) => {
                  setCurrentResume(e.target.value);
                  setSelectedPresetId('');
                }}
                rows={13}
                placeholder="Paste your existing resume text, work experience, list of skills, and education here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono transition-all resize-y leading-relaxed min-h-[310px]"
              />
            )}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
            <span>
              {pdfFile
                ? `Attached: ${pdfFile.name}`
                : currentResume
                ? `${currentResume.trim().split(/\s+/).length} words entered`
                : 'No resume attached yet'}
            </span>
            {inputMode === 'text' && currentResume && (
              <button
                type="button"
                onClick={() => setCurrentResume('')}
                className="text-slate-400 hover:text-rose-400 transition-colors"
              >
                Clear text
              </button>
            )}
          </div>
        </div>

        {/* COLUMN 2: TARGET JOB DESCRIPTION TEXT BOX */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    2. Target Job Description (JD)
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Paste the full job posting from LinkedIn, Indeed, JobStreet, or company site
                  </p>
                </div>
              </div>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setSelectedPresetId('');
              }}
              rows={13}
              placeholder="Paste the target Job Description here...

Example:
Job Title: Senior Full-Stack Engineer / Operations Lead
Company: Acme Corporation

Key Responsibilities:
- Architect and develop modern scalable web applications
- Collaborate closely with product and design teams
- Write automated tests and participate in code reviews
- Drive CI/CD and deployment standards..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-all resize-y leading-relaxed min-h-[310px]"
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
            <span>
              {jobDescription
                ? `${jobDescription.trim().split(/\s+/).length} words in Job Description`
                : 'Job Description is required'}
            </span>
            {jobDescription && (
              <button
                type="button"
                onClick={() => setJobDescription('')}
                className="text-slate-400 hover:text-rose-400 transition-colors"
              >
                Clear text
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
