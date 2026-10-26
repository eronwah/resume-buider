import React from 'react';
import { ColorTheme, CoverLetter, FontSizeMode, TailoredResume, TemplateStyle } from '../types/resume';
import { getFontFamilyClass, getFontSizeClasses, getThemeAccentColors } from '../utils/themeClasses';
import { Mail, Phone, MapPin } from 'lucide-react';

interface CoverLetterDocumentProps {
  coverLetter: CoverLetter;
  resume: TailoredResume;
  onUpdateCoverLetter?: (updated: CoverLetter) => void;
  isEditing?: boolean;
  templateStyle?: TemplateStyle;
  colorTheme?: ColorTheme;
  fontSizeMode?: FontSizeMode;
}

export const CoverLetterDocument: React.FC<CoverLetterDocumentProps> = ({
  coverLetter,
  resume,
  onUpdateCoverLetter,
  isEditing = false,
  templateStyle = 'modern-executive',
  colorTheme = 'slate',
  fontSizeMode = 'standard',
}) => {
  const colors = getThemeAccentColors(colorTheme);
  const fontClass = getFontFamilyClass(templateStyle);
  const sizeClasses = getFontSizeClasses(fontSizeMode);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      id="coverletter-pdf-sheet"
      className={`document-sheet w-full max-w-[794px] mx-auto bg-white text-slate-800 shadow-2xl rounded-sm p-7 sm:p-10 transition-all ${fontClass}`}
      style={{ minHeight: '1050px', boxSizing: 'border-box' }}
    >
      {/* SENDER LETTERHEAD */}
      <div className="border-b-2 border-slate-900 pb-5 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          {resume.fullName}
        </h1>
        <p className={`text-sm font-semibold ${colors.primary} mt-0.5 tracking-wide`}>
          {resume.professionalTitle}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2 font-sans">
          <span className="inline-flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-400" /> {resume.contact.email}
          </span>
          <span className="inline-flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" /> {resume.contact.phone}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" /> {resume.contact.location}
          </span>
        </div>
      </div>

      {/* DATE */}
      <div className="text-xs text-slate-500 mb-6 font-mono">{currentDate}</div>

      {/* RECIPIENT */}
      <div className="text-xs text-slate-800 space-y-0.5 mb-8">
        <p className="font-bold">{coverLetter.recipientTitle || 'Hiring Team / Talent Acquisition'}</p>
        <p className="font-semibold text-slate-700">{coverLetter.companyName || 'Target Company'}</p>
        <p className="text-slate-500">Re: Application for {coverLetter.jobTitle}</p>
      </div>

      {/* SALUTATION */}
      <p className="text-sm font-bold text-slate-900 mb-4">{coverLetter.salutation},</p>

      {/* LETTER BODY */}
      <div className={`space-y-4 text-slate-700 ${sizeClasses.body} leading-relaxed text-justify`}>
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={coverLetter.openingParagraph}
              onChange={(e) =>
                onUpdateCoverLetter &&
                onUpdateCoverLetter({ ...coverLetter, openingParagraph: e.target.value })
              }
              rows={3}
              className="w-full p-2 border border-slate-300 rounded text-xs"
            />
            <textarea
              value={coverLetter.alignmentParagraph1}
              onChange={(e) =>
                onUpdateCoverLetter &&
                onUpdateCoverLetter({ ...coverLetter, alignmentParagraph1: e.target.value })
              }
              rows={4}
              className="w-full p-2 border border-slate-300 rounded text-xs"
            />
            {coverLetter.alignmentParagraph2 && (
              <textarea
                value={coverLetter.alignmentParagraph2}
                onChange={(e) =>
                  onUpdateCoverLetter &&
                  onUpdateCoverLetter({ ...coverLetter, alignmentParagraph2: e.target.value })
                }
                rows={4}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            )}
            <textarea
              value={coverLetter.closingParagraph}
              onChange={(e) =>
                onUpdateCoverLetter &&
                onUpdateCoverLetter({ ...coverLetter, closingParagraph: e.target.value })
              }
              rows={3}
              className="w-full p-2 border border-slate-300 rounded text-xs"
            />
          </div>
        ) : (
          <>
            <p>{coverLetter.openingParagraph}</p>
            <p>{coverLetter.alignmentParagraph1}</p>
            {coverLetter.alignmentParagraph2 && <p>{coverLetter.alignmentParagraph2}</p>}
            <p>{coverLetter.closingParagraph}</p>
          </>
        )}
      </div>

      {/* SIGN OFF */}
      <div className="mt-10 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-600 mb-6">{coverLetter.signOff || 'Sincerely,'}</p>
        <p className="text-base font-bold text-slate-950 font-serif">{resume.fullName}</p>
        <p className="text-xs text-slate-500 mt-0.5">{resume.professionalTitle}</p>
      </div>
    </div>
  );
};
