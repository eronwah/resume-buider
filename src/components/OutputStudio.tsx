import React, { useState } from 'react';
import {
  ActiveDocumentView,
  ColorTheme,
  CoverLetter,
  FontSizeMode,
  RevisionResponse,
  TailoredCV,
  TailoredResume,
  TemplateStyle,
} from '../types/resume';
import { ResumeDocument } from './ResumeDocument';
import { CVDocument } from './CVDocument';
import { CoverLetterDocument } from './CoverLetterDocument';
import { AtsInsightsView } from './AtsInsightsView';
import { exportElementToPdf, triggerBrowserPrint } from '../utils/pdfGenerator';
import {
  FileText,
  FileCheck,
  Mail,
  Target,
  Download,
  Printer,
  Edit3,
  ArrowLeft,
  Loader2,
  Palette,
  Sliders,
} from 'lucide-react';

interface OutputStudioProps {
  data: RevisionResponse;
  onUpdateResume: (updated: TailoredResume) => void;
  onUpdateCV: (updated: TailoredCV) => void;
  onUpdateCoverLetter: (updated: CoverLetter) => void;
  onBackToInputs: () => void;
  jobDescription?: string;
}

export const OutputStudio: React.FC<OutputStudioProps> = ({
  data,
  onUpdateResume,
  onUpdateCV,
  onUpdateCoverLetter,
  onBackToInputs,
  jobDescription,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveDocumentView>('resume');
  const [isEditing, setIsEditing] = useState(false);
  const [templateStyle, setTemplateStyle] = useState<TemplateStyle>('modern-executive');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('indigo');
  const [fontSizeMode, setFontSizeMode] = useState<FontSizeMode>('standard');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfProgressText, setPdfProgressText] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownloadPdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);

    try {
      const sanitizedName = data.resume.fullName.replace(/\s+/g, '_') || 'Applicant';

      if (activeTab === 'resume') {
        await exportElementToPdf({
          elementId: 'resume-pdf-sheet',
          filename: `${sanitizedName}_Resume_Tailored.pdf`,
          onProgress: (stage) => setPdfProgressText(stage),
        });
        showNotification('✅ Resume PDF downloaded successfully!');
      } else if (activeTab === 'cv') {
        await exportElementToPdf({
          elementId: 'cv-pdf-sheet',
          filename: `${sanitizedName}_CV_Comprehensive.pdf`,
          onProgress: (stage) => setPdfProgressText(stage),
        });
        showNotification('✅ CV PDF downloaded successfully!');
      } else if (activeTab === 'cover-letter') {
        await exportElementToPdf({
          elementId: 'coverletter-pdf-sheet',
          filename: `${sanitizedName}_Cover_Letter.pdf`,
          onProgress: (stage) => setPdfProgressText(stage),
        });
        showNotification('✅ Cover Letter PDF downloaded successfully!');
      } else {
        await exportElementToPdf({
          elementId: 'resume-pdf-sheet',
          filename: `${sanitizedName}_Resume_Tailored.pdf`,
          onProgress: (stage) => setPdfProgressText(stage),
        });
        showNotification('✅ Resume PDF downloaded successfully!');
      }
    } catch (err: any) {
      console.error(err);
      showNotification('PDF export encountered an issue. You can also use the Print / System PDF button.');
    } finally {
      setIsExportingPdf(false);
      setPdfProgressText('');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/50 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span>{notification}</span>
        </div>
      )}

      {/* TOP STUDIO TOOLBAR */}
      <div className="no-print bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl sticky top-3 z-40 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Back button and title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToInputs}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0"
              title="Return to input files and job description"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Inputs</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {data.resume.fullName}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                  {data.atsScore.overallScore}% ATS Match
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">{data.resume.professionalTitle}</p>
            </div>
          </div>

          {/* DOCUMENT NAVIGATION TABS */}
          <div className="flex flex-wrap items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('resume')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'resume'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tailored Resume</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'cv'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Tailored CV (Comprehensive)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cover-letter')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'cover-letter'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Cover Letter</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ats-insights')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ats-insights'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-emerald-300" />
              <span>ATS Score & Keywords</span>
            </button>
          </div>

          {/* ACTION BUTTONS (DOWNLOAD PDF & PRINT) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Inline Edit Toggle */}
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${
                isEditing
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Click to directly edit text on document"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Done Editing' : 'Edit Text'}</span>
            </button>

            {/* Print / Save as PDF */}
            <button
              type="button"
              onClick={triggerBrowserPrint}
              className="flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl transition-all"
              title="Print directly or use browser Save as PDF dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / System PDF</span>
            </button>

            {/* Download PDF button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 transition-all shrink-0"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{pdfProgressText || 'Downloading...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    Download{' '}
                    {activeTab === 'cv'
                      ? 'CV PDF'
                      : activeTab === 'cover-letter'
                      ? 'Cover Letter PDF'
                      : 'Resume PDF'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CUSTOMIZATION BAR FOR DESIGN & TEMPLATES */}
        {activeTab !== 'ats-insights' && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Template selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-indigo-400" /> Template:
              </span>
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    ['modern-executive', 'Modern Executive'],
                    ['ats-clean', 'ATS Clean Single-Col'],
                    ['tech-lead', 'Tech Lead'],
                    ['classic-serif', 'Classic Serif'],
                  ] as [TemplateStyle, string][]
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTemplateStyle(id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      templateStyle === id
                        ? 'bg-slate-700 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Picker */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Accent:</span>
              <div className="flex items-center gap-1.5">
                {(
                  [
                    ['indigo', 'bg-indigo-600'],
                    ['emerald', 'bg-emerald-600'],
                    ['navy', 'bg-sky-700'],
                    ['slate', 'bg-slate-700'],
                    ['crimson', 'bg-rose-700'],
                    ['amber', 'bg-amber-600'],
                  ] as [ColorTheme, string][]
                ).map(([themeName, bgClass]) => (
                  <button
                    key={themeName}
                    type="button"
                    onClick={() => setColorTheme(themeName)}
                    className={`w-4 h-4 rounded-full ${bgClass} transition-transform ${
                      colorTheme === themeName ? 'ring-2 ring-white scale-125' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={themeName}
                  />
                ))}
              </div>
            </div>

            {/* Font Mode / Spacing */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" /> Spacing:
              </span>
              <div className="flex gap-1">
                {(
                  [
                    ['compact', 'Compact (1 Page)'],
                    ['standard', 'Standard'],
                    ['relaxed', 'Relaxed'],
                  ] as [FontSizeMode, string][]
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFontSizeMode(mode)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                      fontSizeMode === mode
                        ? 'bg-slate-700 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DOCUMENT RENDER AREA */}
      <div className="relative pb-16">
        <div className={activeTab === 'resume' ? 'block' : 'hidden'}>
          <ResumeDocument
            resume={data.resume}
            onUpdateResume={onUpdateResume}
            isEditing={isEditing}
            templateStyle={templateStyle}
            colorTheme={colorTheme}
            fontSizeMode={fontSizeMode}
          />
        </div>

        <div className={activeTab === 'cv' ? 'block' : 'hidden'}>
          <CVDocument
            cv={data.cv}
            resume={data.resume}
            onUpdateCV={onUpdateCV}
            isEditing={isEditing}
            templateStyle={templateStyle}
            colorTheme={colorTheme}
            fontSizeMode={fontSizeMode}
          />
        </div>

        <div className={activeTab === 'cover-letter' ? 'block' : 'hidden'}>
          <CoverLetterDocument
            coverLetter={data.coverLetter}
            resume={data.resume}
            onUpdateCoverLetter={onUpdateCoverLetter}
            isEditing={isEditing}
            templateStyle={templateStyle}
            colorTheme={colorTheme}
            fontSizeMode={fontSizeMode}
          />
        </div>

        {activeTab === 'ats-insights' && (
          <AtsInsightsView
            atsScore={data.atsScore}
            keywordAnalysis={data.keywordAnalysis}
            strategyHighlights={data.strategyHighlights}
            targetRole={data.resume.professionalTitle}
            jobDescription={jobDescription}
          />
        )}
      </div>
    </div>
  );
};
