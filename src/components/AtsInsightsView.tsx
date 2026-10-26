import React, { useState } from 'react';
import { AtsScoreData, KeywordAnalysisData } from '../types/resume';
import { CheckCircle2, AlertTriangle, Sparkles, Target, Zap, ArrowRight, Loader2, Copy, Check } from 'lucide-react';

interface AtsInsightsViewProps {
  atsScore: AtsScoreData;
  keywordAnalysis: KeywordAnalysisData;
  strategyHighlights: string[];
  targetRole?: string;
  jobDescription?: string;
}

export const AtsInsightsView: React.FC<AtsInsightsViewProps> = ({
  atsScore,
  keywordAnalysis,
  strategyHighlights,
  targetRole,
  jobDescription,
}) => {
  // Quick Bullet Polisher state
  const [customBullet, setCustomBullet] = useState('');
  const [variations, setVariations] = useState<string[]>([]);
  const [isPolishing, setIsPolishing] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500 bg-amber-500/10';
    return 'text-rose-400 border-rose-500 bg-rose-500/10';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const handlePolishBullet = async () => {
    if (!customBullet.trim() || isPolishing) return;
    setIsPolishing(true);
    setVariations([]);
    try {
      const res = await fetch('/api/rewrite-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletText: customBullet,
          targetRole,
          jobDescription,
        }),
      });
      const data = await res.json();
      if (data.variations) {
        setVariations(data.variations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPolishing(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-slate-200">
      {/* TOP SCORE OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Overall Score Card */}
        <div className="md:col-span-1 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-indigo-400" /> ATS Match Score
          </span>
          <div
            className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center ${getScoreColor(
              atsScore.overallScore
            )}`}
          >
            <span className="text-4xl font-black tracking-tight">{atsScore.overallScore}%</span>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Match Rate</span>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium">
            {atsScore.overallScore >= 85
              ? 'High ATS compatibility for automated screeners'
              : atsScore.overallScore >= 70
              ? 'Good match with minor keyword adjustments'
              : 'Requires further keyword integration'}
          </p>
        </div>

        {/* Detailed Breakdown */}
        <div className="md:col-span-3 bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400" /> Evaluation Metric Breakdown
            </h3>

            <div className="space-y-3.5">
              {/* Keyword Score */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">Keyword Density & JD Terms</span>
                  <span className="text-slate-100 font-bold">{atsScore.keywordScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getProgressBarColor(
                      atsScore.keywordScore
                    )}`}
                    style={{ width: `${atsScore.keywordScore}%` }}
                  />
                </div>
              </div>

              {/* Skills Score */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">Skillset & Tool Alignment</span>
                  <span className="text-slate-100 font-bold">{atsScore.skillsScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getProgressBarColor(
                      atsScore.skillsScore
                    )}`}
                    style={{ width: `${atsScore.skillsScore}%` }}
                  />
                </div>
              </div>

              {/* Experience Relevance */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">Experience Scope & Impact Relevance</span>
                  <span className="text-slate-100 font-bold">{atsScore.experienceScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getProgressBarColor(
                      atsScore.experienceScore
                    )}`}
                    style={{ width: `${atsScore.experienceScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 italic">
            💡 {atsScore.summaryFeedback}
          </div>
        </div>
      </div>

      {/* STRATEGIC REFRAMING HIGHLIGHTS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Strategic Adaptations Made by AI
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          How your existing skills and responsibilities were reframed to directly answer the job requirements:
        </p>
        <ul className="space-y-2">
          {strategyHighlights.map((highlight, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/70">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* KEYWORDS MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Matched Keywords */}
        <div className="bg-slate-900/90 border border-emerald-900/30 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Matched JD Keywords ({keywordAnalysis.matchedKeywords.length})</h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywordAnalysis.matchedKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 text-[11px] px-2 py-0.5 rounded-md font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Transferable Skills Highlighted */}
        <div className="bg-slate-900/90 border border-indigo-900/30 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-indigo-400">
            <Sparkles className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Reframed Transferable Skills ({keywordAnalysis.transferableSkillsHighlighted.length})</h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywordAnalysis.transferableSkillsHighlighted.map((skill, idx) => (
              <span
                key={idx}
                className="bg-indigo-950/60 text-indigo-300 border border-indigo-800/50 text-[11px] px-2 py-0.5 rounded-md font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing / Recommended Keywords */}
        <div className="bg-slate-900/90 border border-amber-900/30 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Suggested Additions / Prep ({keywordAnalysis.missingOrSuggestedKeywords.length})</h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywordAnalysis.missingOrSuggestedKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="bg-amber-950/60 text-amber-300 border border-amber-800/50 text-[11px] px-2 py-0.5 rounded-md font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK BULLET POINT POLISHER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Interactive Bullet Point Polisher
          </h3>
          <span className="text-[11px] text-slate-400">STAR Method & Metrics</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Want to strengthen a specific responsibility? Paste any draft bullet below and generate 3 punchy, ATS-aligned variations.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="e.g., Handled client emails and scheduled meetings for team"
            value={customBullet}
            onChange={(e) => setCustomBullet(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handlePolishBullet();
            }}
          />
          <button
            type="button"
            onClick={handlePolishBullet}
            disabled={isPolishing || !customBullet.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors shrink-0"
          >
            {isPolishing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Polishing...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" /> Polish Bullet
              </>
            )}
          </button>
        </div>

        {variations.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-slate-300">Generated High-Impact Variations:</p>
            {variations.map((v, i) => (
              <div
                key={i}
                className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 flex items-start justify-between gap-3 text-xs text-slate-200 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{v}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(v, i)}
                  className="shrink-0 p-1.5 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                  title="Copy bullet"
                >
                  {copiedIdx === i ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
