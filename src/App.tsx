import React, { useState } from 'react';
import { CoverLetter, RevisionResponse, TailoredCV, TailoredResume } from './types/resume';
import { Navbar } from './components/Navbar';
import { InputWorkspace } from './components/InputWorkspace';
import { OutputStudio } from './components/OutputStudio';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [currentResume, setCurrentResume] = useState<string>('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [tone, setTone] = useState<string>('ats-optimized');
  const [focusNotes, setFocusNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [stageIndex, setStageIndex] = useState<number>(1);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [revisionResult, setRevisionResult] = useState<RevisionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRevise = async () => {
    if ((!currentResume.trim() && !pdfBase64) || !jobDescription.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setProgressPercent(5);
    setStageIndex(1);
    setLoadingStage('Scanning uploaded PDF & extracting career history, references, and education...');

    // Progress interval that smoothly advances the percentage and stages
    let currentPct = 5;
    const progressTimer = setInterval(() => {
      currentPct += Math.random() * 2 + 1;

      if (currentPct < 22) {
        setStageIndex(1);
        setLoadingStage('Scanning uploaded PDF & extracting career history, education, and all references...');
      } else if (currentPct < 48) {
        setStageIndex(2);
        setLoadingStage('Analyzing target Job Description & benchmarking high-priority ATS keywords...');
      } else if (currentPct < 72) {
        setStageIndex(3);
        setLoadingStage('Re-aligning bullet points with STAR impact while preserving genuine experience...');
      } else if (currentPct < 89) {
        setStageIndex(4);
        setLoadingStage('Formatting 3-line Education & verbatim Reference contact phone numbers...');
      } else if (currentPct < 97) {
        setStageIndex(5);
        setLoadingStage('Compiling tailored Resume, comprehensive CV, and Cover Letter...');
      }

      if (currentPct > 97) {
        currentPct = 97; // Pause at 97% until backend finishes
      }
      setProgressPercent(Math.floor(currentPct));
    }, 280);

    try {
      const response = await fetch('/api/revise-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentResume,
          pdfBase64,
          jobDescription,
          tone,
          focusNotes,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        clearInterval(progressTimer);
        const text = await response.text();
        if (text.includes('<!DOCTYPE') || response.status === 404) {
          throw new Error(
            'Cannot reach the Node.js backend server (/api/revise-resume). If running locally, make sure to run "npm run dev". If deployed on GitHub Pages, please note that GitHub Pages only hosts static files and cannot run the Node.js backend. Deploy to a full-stack host such as Render, Railway, or Vercel.'
          );
        }
        throw new Error(`Server returned unexpected response (${response.status}).`);
      }

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to complete resume revision.');
      }

      // Finish progress smoothly to 100%
      clearInterval(progressTimer);
      setProgressPercent(100);
      setStageIndex(5);
      setLoadingStage('Tailoring complete! Rendering tailored documents...');

      // Short delay so the user sees 100% completion
      setTimeout(() => {
        setRevisionResult(json.data);
        setIsLoading(false);
        setProgressPercent(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    } catch (err: any) {
      clearInterval(progressTimer);
      setIsLoading(false);
      setProgressPercent(0);
      console.error(err);
      setErrorMessage(
        err.message || 'An error occurred while revising your resume. Please try again.'
      );
    }
  };

  const handleResetSession = () => {
    if (window.confirm('Start a new resume revision session? Any unsaved edits will be cleared.')) {
      setRevisionResult(null);
      setCurrentResume('');
      setPdfFile(null);
      setPdfBase64(null);
      setJobDescription('');
      setFocusNotes('');
    }
  };

  const handleUpdateResume = (updated: TailoredResume) => {
    if (!revisionResult) return;
    setRevisionResult({ ...revisionResult, resume: updated });
  };

  const handleUpdateCV = (updated: TailoredCV) => {
    if (!revisionResult) return;
    setRevisionResult({ ...revisionResult, cv: updated });
  };

  const handleUpdateCoverLetter = (updated: CoverLetter) => {
    if (!revisionResult) return;
    setRevisionResult({ ...revisionResult, coverLetter: updated });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar onReset={handleResetSession} hasData={Boolean(revisionResult)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {errorMessage && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl flex items-start gap-3 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-semibold">Processing Error:</strong>
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white text-base leading-none"
            >
              ×
            </button>
          </div>
        )}

        {revisionResult ? (
          <OutputStudio
            data={revisionResult}
            onUpdateResume={handleUpdateResume}
            onUpdateCV={handleUpdateCV}
            onUpdateCoverLetter={handleUpdateCoverLetter}
            onBackToInputs={() => setRevisionResult(null)}
            jobDescription={jobDescription}
          />
        ) : (
          <InputWorkspace
            currentResume={currentResume}
            setCurrentResume={setCurrentResume}
            pdfFile={pdfFile}
            setPdfFile={setPdfFile}
            pdfBase64={pdfBase64}
            setPdfBase64={setPdfBase64}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            tone={tone}
            setTone={setTone}
            focusNotes={focusNotes}
            setFocusNotes={setFocusNotes}
            onSubmit={handleRevise}
            isLoading={isLoading}
            loadingStage={loadingStage}
            progressPercent={progressPercent}
            stageIndex={stageIndex}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>AI Resume & CV Reviser • ATS Optimization, Skillset Adaptation & Instant PDF Generation</p>
      </footer>
    </div>
  );
}
