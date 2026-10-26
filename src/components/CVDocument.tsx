import React from 'react';
import { ColorTheme, FontSizeMode, TailoredCV, TailoredResume, TemplateStyle } from '../types/resume';
import { getFontFamilyClass, getFontSizeClasses, getThemeAccentColors } from '../utils/themeClasses';
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react';
import { formatEducationItem, formatReferenceItem } from '../utils/documentFormatters';

interface CVDocumentProps {
  cv: TailoredCV;
  resume: TailoredResume; // For contact header and education
  onUpdateCV?: (updated: TailoredCV) => void;
  isEditing?: boolean;
  templateStyle?: TemplateStyle;
  colorTheme?: ColorTheme;
  fontSizeMode?: FontSizeMode;
}

export const CVDocument: React.FC<CVDocumentProps> = ({
  cv,
  resume,
  onUpdateCV,
  isEditing = false,
  templateStyle = 'modern-executive',
  colorTheme = 'slate',
  fontSizeMode = 'standard',
}) => {
  const colors = getThemeAccentColors(colorTheme);
  const fontClass = getFontFamilyClass(templateStyle);
  const sizeClasses = getFontSizeClasses(fontSizeMode);

  return (
    <div
      id="cv-pdf-sheet"
      className={`document-sheet w-full max-w-[794px] mx-auto bg-white text-slate-800 shadow-2xl rounded-sm p-7 sm:p-9 transition-all ${fontClass}`}
      style={{ minHeight: '1050px', boxSizing: 'border-box' }}
    >
      {/* CV HEADER */}
      <div className="border-b-2 border-slate-800 pb-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
              Curriculum Vitae (Comprehensive)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {resume.fullName}
            </h1>
            <p className={`text-sm sm:text-base font-semibold ${colors.primary} mt-0.5`}>
              {resume.professionalTitle}
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-1 text-xs text-slate-600 font-sans">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {resume.contact.email}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {resume.contact.phone}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {resume.contact.location}
            </span>
            {resume.contact.linkedin && <span>{resume.contact.linkedin}</span>}
          </div>
        </div>
      </div>

      {/* ACADEMIC & CAREER PROFILE */}
      <section className={`${sizeClasses.sectionGap}`}>
        <h2 className={`${sizeClasses.heading2} ${colors.primary} border-b ${colors.borderLight} pb-1 mb-2 font-bold`}>
          I. Comprehensive Career & Domain Profile
        </h2>
        {isEditing ? (
          <textarea
            value={cv.academicAndCareerProfile}
            onChange={(e) => {
              if (onUpdateCV) onUpdateCV({ ...cv, academicAndCareerProfile: e.target.value });
            }}
            rows={4}
            className={`w-full p-2 border border-slate-300 rounded font-normal text-slate-800 ${sizeClasses.body}`}
          />
        ) : (
          <p className={`${sizeClasses.body} text-slate-700 leading-relaxed text-justify`}>
            {cv.academicAndCareerProfile}
          </p>
        )}
      </section>

      {/* CORE AREAS OF EXPERTISE */}
      {cv.coreAreasOfExpertise && cv.coreAreasOfExpertise.length > 0 && (
        <section className={`${sizeClasses.sectionGap}`}>
          <h2 className={`${sizeClasses.heading2} ${colors.primary} border-b ${colors.borderLight} pb-1 mb-2 font-bold`}>
            II. Core Areas of Specialization & Mastery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 border border-slate-200 rounded p-3 text-xs">
            {cv.coreAreasOfExpertise.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-800">
                <span className={`w-1.5 h-1.5 rounded-full ${colors.bulletDot} shrink-0`} />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* IN-DEPTH PROFESSIONAL EXPERIENCE */}
      <section className={`${sizeClasses.sectionGap}`}>
        <h2 className={`${sizeClasses.heading2} ${colors.primary} border-b ${colors.borderLight} pb-1 mb-3 font-bold`}>
          III. In-Depth Career Track Record & Scope
        </h2>
        <div className="space-y-4">
          {cv.inDepthExperience.map((item, idx) => (
            <div key={idx} className="job-entry page-break-avoid border-l-2 border-slate-200 pl-4 py-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.role}</h3>
                  <div className="text-xs font-semibold text-slate-700">
                    {item.organization} {item.location ? `• ${item.location}` : ''}
                  </div>
                </div>
                <div className={`${sizeClasses.meta} text-slate-500 font-mono mt-0.5 sm:mt-0`}>
                  {item.period}
                </div>
              </div>

              {/* Scope & Responsibilities */}
              <p className={`${sizeClasses.body} text-slate-600 italic mt-1.5 text-justify`}>
                <strong className="not-italic text-slate-800 font-medium">Scope: </strong>
                {item.scopeAndResponsibilities}
              </p>

              {/* Key Achievements */}
              {item.keyAchievements && item.keyAchievements.length > 0 && (
                <div className="mt-2">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-1">
                    Key Milestones & Quantitative Results:
                  </span>
                  <ul className="space-y-1">
                    {item.keyAchievements.map((ach, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2 text-slate-700">
                        <span className={`w-1.5 h-1.5 rounded-full ${colors.bulletDot} mt-1.5 shrink-0`} />
                        <span className={`${sizeClasses.bullet} leading-normal`}>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies / Tools per role */}
              {item.technologiesUsed && item.technologiesUsed.length > 0 && (
                <div className="mt-2 text-[11px] text-slate-500 flex flex-wrap gap-1 items-center">
                  <span className="font-medium text-slate-700">Stack & Environment:</span>
                  {item.technologiesUsed.map((tech, tIdx) => (
                    <span key={tIdx} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* LEADERSHIP & IMPACT */}
      {cv.leadershipAndImpact && cv.leadershipAndImpact.length > 0 && (
        <section className={`${sizeClasses.sectionGap}`}>
          <h2 className={`${sizeClasses.heading2} ${colors.primary} border-b ${colors.borderLight} pb-1 mb-2 font-bold`}>
            IV. Leadership, Mentorship & Governance
          </h2>
          <ul className="space-y-1 text-slate-700">
            {cv.leadershipAndImpact.map((lead, lIdx) => (
              <li key={lIdx} className="flex items-start gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${colors.bulletDot} mt-1.5 shrink-0`} />
                <span className={`${sizeClasses.bullet}`}>{lead}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* METHODOLOGIES & PRACTICES */}
      {cv.methodologiesAndPractices && cv.methodologiesAndPractices.length > 0 && (
        <section className={`${sizeClasses.sectionGap}`}>
          <h2 className={`${sizeClasses.heading2} ${colors.primary} border-b ${colors.borderLight} pb-1 mb-2 font-bold`}>
            V. Methodologies, Architectural Standards & Practices
          </h2>
          <div className="flex flex-wrap gap-2 text-xs text-slate-700">
            {cv.methodologiesAndPractices.map((meth, mIdx) => (
              <span key={mIdx} className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded font-medium">
                {meth}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* FORMAL EDUCATION & CREDENTIALS */}
      <section className={`${sizeClasses.sectionGap}`}>
        <h2 className={`${sizeClasses.heading2} ${colors.primary} border-b ${colors.borderLight} pb-1 mb-2 font-bold`}>
          VI. Academic Background & Degrees
        </h2>
        <div className="space-y-2.5">
          {resume.education.map((rawEdu, eIdx) => {
            const edu = formatEducationItem(rawEdu);
            return (
              <div key={eIdx} className="edu-entry page-break-avoid space-y-0.5 text-xs">
                {/* Line 1 : Degree (Left) | Date Range (Right alignment) */}
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-bold text-slate-900 tracking-tight">{edu.degree}</span>
                  <span className="text-slate-500 font-mono text-[11px] text-right shrink-0">
                    {edu.displayYear}
                  </span>
                </div>

                {/* Line 2 : university | Place */}
                <div className="text-[11px] text-slate-700 font-medium">
                  {edu.universityAndPlace}
                </div>

                {/* Line 3 : Relevant Coursework */}
                {edu.cleanDetails && (
                  <div className="text-[11px] text-slate-600 leading-snug">
                    {edu.cleanDetails}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* PROFESSIONAL REFERENCES */}
      {((cv.references && cv.references.length > 0) || (resume.references && resume.references.length > 0)) && (
        <section className={`references-block ${sizeClasses.sectionGap}`}>
          <div className="flex items-center gap-2 border-b pb-1 mb-2">
            <h2 className={`${sizeClasses.heading2} ${colors.primary} font-bold`}>
              VII. Professional References
            </h2>
            {((cv.references?.length ?? 0) > 0 || (resume.references?.length ?? 0) > 0) && (
              <span className="text-[10px] text-slate-400 font-normal">
                ({(cv.references || resume.references || []).length} {((cv.references || resume.references || []).length === 1 ? 'reference' : 'references')})
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            {(cv.references || resume.references || []).map((rawRef, rIdx) => {
              const ref = formatReferenceItem(rawRef);

              return (
                <div key={rIdx} className="bg-slate-50 border border-slate-200/80 rounded p-2.5 space-y-0.5 relative page-break-avoid">
                  {/* Line 1: Name */}
                  <div className="font-bold text-slate-900 text-xs">
                    {ref.name}
                  </div>

                  {/* Line 2: Company */}
                  {ref.company && (
                    <div className="text-slate-800 font-medium text-[11px] leading-tight">
                      {ref.company}
                    </div>
                  )}

                  {/* Line 3: Position */}
                  {ref.title && (
                    <div className="text-slate-600 text-[11px] leading-tight">
                      {ref.title}
                    </div>
                  )}

                  {/* Line 4: Phone | Email(optional) */}
                  {ref.contactLine && (
                    <div className="text-[11px] text-slate-700 font-mono flex items-center gap-1.5 pt-0.5">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{ref.contactLine}</span>
                    </div>
                  )}

                  {ref.extraContact && (
                    <div className="text-[10px] text-slate-500 pt-0.5">
                      {ref.extraContact}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
