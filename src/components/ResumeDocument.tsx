import React from 'react';
import { ColorTheme, FontSizeMode, TailoredResume, TemplateStyle } from '../types/resume';
import { getFontFamilyClass, getFontSizeClasses, getThemeAccentColors } from '../utils/themeClasses';
import { Mail, Phone, MapPin, Linkedin, Globe, Github, Plus, Trash2 } from 'lucide-react';
import { formatEducationItem, formatReferenceItem } from '../utils/documentFormatters';

interface ResumeDocumentProps {
  resume: TailoredResume;
  onUpdateResume?: (updated: TailoredResume) => void;
  isEditing?: boolean;
  templateStyle?: TemplateStyle;
  colorTheme?: ColorTheme;
  fontSizeMode?: FontSizeMode;
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({
  resume,
  onUpdateResume,
  isEditing = false,
  templateStyle = 'modern-executive',
  colorTheme = 'slate',
  fontSizeMode = 'standard',
}) => {
  const colors = getThemeAccentColors(colorTheme);
  const fontClass = getFontFamilyClass(templateStyle);
  const sizeClasses = getFontSizeClasses(fontSizeMode);

  // Helper for updating fields if editing
  const updateField = (path: string[], value: any) => {
    if (!onUpdateResume) return;
    const cloned = JSON.parse(JSON.stringify(resume));
    let cur = cloned;
    for (let i = 0; i < path.length - 1; i++) {
      cur = cur[path[i]];
    }
    cur[path[path.length - 1]] = value;
    onUpdateResume(cloned);
  };

  const updateBulletPoint = (expIndex: number, bulletIndex: number, text: string) => {
    if (!onUpdateResume) return;
    const cloned = JSON.parse(JSON.stringify(resume));
    cloned.workExperience[expIndex].bulletPoints[bulletIndex] = text;
    onUpdateResume(cloned);
  };

  const addBulletPoint = (expIndex: number) => {
    if (!onUpdateResume) return;
    const cloned = JSON.parse(JSON.stringify(resume));
    cloned.workExperience[expIndex].bulletPoints.push('New accomplishment with quantifiable metric and action verb.');
    onUpdateResume(cloned);
  };

  const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
    if (!onUpdateResume) return;
    const cloned = JSON.parse(JSON.stringify(resume));
    cloned.workExperience[expIndex].bulletPoints.splice(bulletIndex, 1);
    onUpdateResume(cloned);
  };

  const updateEducation = (eduIdx: number, field: string, val: string) => {
    if (!onUpdateResume) return;
    const cloned = JSON.parse(JSON.stringify(resume));
    if (!cloned.education) cloned.education = [];
    cloned.education[eduIdx][field] = val;
    onUpdateResume(cloned);
  };

  const addEducation = () => {
    if (!onUpdateResume) return;
    const cloned = JSON.parse(JSON.stringify(resume));
    if (!cloned.education) cloned.education = [];
    cloned.education.push({
      degree: 'Bachelor of Science in Information Technology',
      institution: 'University Name',
      graduationYear: '2020',
      honorsOrDetails: '',
    });
    onUpdateResume(cloned);
  };

  const removeEducation = (eduIdx: number) => {
    if (!onUpdateResume) return;
    const cloned = JSON.parse(JSON.stringify(resume));
    if (cloned.education) {
      cloned.education.splice(eduIdx, 1);
      onUpdateResume(cloned);
    }
  };

  const updateReference = (refIdx: number, field: string, val: string) => {
    if (!onUpdateResume) return;
    const cloned = JSON.parse(JSON.stringify(resume));
    if (!cloned.references) cloned.references = [];
    cloned.references[refIdx][field] = val;
    onUpdateResume(cloned);
  };

  const addReference = () => {
    if (!onUpdateResume) return;
    const cloned = JSON.parse(JSON.stringify(resume));
    if (!cloned.references) cloned.references = [];
    cloned.references.push({
      name: 'Full Name',
      company: 'Company / Organization',
      title: 'Branch Manager',
      phone: '12358698',
      email: '',
    });
    onUpdateResume(cloned);
  };

  const removeReference = (refIdx: number) => {
    if (!onUpdateResume) return;
    const cloned = JSON.parse(JSON.stringify(resume));
    if (cloned.references) {
      cloned.references.splice(refIdx, 1);
      onUpdateResume(cloned);
    }
  };

  return (
    <div
      id="resume-pdf-sheet"
      className={`document-sheet w-full max-w-[794px] mx-auto bg-white text-slate-800 shadow-2xl rounded-sm overflow-hidden transition-all ${fontClass}`}
      style={{ minHeight: '1050px', boxSizing: 'border-box' }}
    >
      {/* HEADER SECTION FOR MODERN EXECUTIVE */}
      {templateStyle === 'modern-executive' && (
        <div className={`w-full p-7 sm:p-9 ${colors.headerBg}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <input
                  type="text"
                  value={resume.fullName}
                  onChange={(e) => updateField(['fullName'], e.target.value)}
                  className="bg-white/10 text-white font-bold text-2xl sm:text-3xl px-2 py-1 rounded w-full border border-white/20"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
                  {resume.fullName}
                </h1>
              )}
              {isEditing ? (
                <input
                  type="text"
                  value={resume.professionalTitle}
                  onChange={(e) => updateField(['professionalTitle'], e.target.value)}
                  className="bg-white/10 text-indigo-200 font-medium text-sm sm:text-base px-2 py-1 rounded w-full mt-1 border border-white/20"
                />
              ) : (
                <p className="text-white/90 text-sm sm:text-base font-medium tracking-wide mt-1">
                  {resume.professionalTitle}
                </p>
              )}
            </div>

            {/* Contacts in Header */}
            <div className="flex flex-col sm:items-end gap-1.5 text-xs text-white/85 shrink-0">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 opacity-80" /> {resume.contact.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 opacity-80" /> {resume.contact.phone}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 opacity-80" /> {resume.contact.location}
              </span>
              {resume.contact.linkedin && (
                <span className="inline-flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 opacity-80" /> {resume.contact.linkedin}
                </span>
              )}
              {resume.contact.github && (
                <span className="inline-flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 opacity-80" /> {resume.contact.github}
                </span>
              )}
              {resume.contact.portfolio && (
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 opacity-80" /> {resume.contact.portfolio}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT BODY CONTAINER */}
      <div className="p-7 sm:p-9 space-y-4">
        {/* HEADER FOR CLASSIC SERIF */}
        {templateStyle === 'classic-serif' && (
          <div className="text-center border-b-2 border-slate-900 pb-5 mb-5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 uppercase">
              {resume.fullName}
            </h1>
            <p className="text-sm font-semibold tracking-wider text-slate-700 mt-1 uppercase">
              {resume.professionalTitle}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-3 font-sans">
              <span>{resume.contact.email}</span>
              <span>•</span>
              <span>{resume.contact.phone}</span>
              <span>•</span>
              <span>{resume.contact.location}</span>
              {resume.contact.linkedin && (
                <>
                  <span>•</span>
                  <span>{resume.contact.linkedin}</span>
                </>
              )}
              {resume.contact.github && (
                <>
                  <span>•</span>
                  <span>{resume.contact.github}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* HEADER FOR ATS CLEAN & TECH LEAD */}
        {(templateStyle === 'ats-clean' || templateStyle === 'tech-lead') && (
          <div className="border-b border-slate-300 pb-4 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight uppercase">
                  {resume.fullName}
                </h1>
                <p className={`text-sm sm:text-base font-semibold ${colors.primary} mt-0.5`}>
                  {resume.professionalTitle}
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-1 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> {resume.contact.email}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> {resume.contact.phone}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {resume.contact.location}
                </span>
                {resume.contact.linkedin && <span>{resume.contact.linkedin}</span>}
                {resume.contact.github && <span>{resume.contact.github}</span>}
              </div>
            </div>
          </div>
        )}

        {/* PROFESSIONAL SUMMARY */}
        <section className={`${sizeClasses.sectionGap}`}>
          <h2 className={`${sizeClasses.heading2} ${colors.primary} border-b ${colors.borderLight} pb-1 mb-2 font-bold flex items-center justify-between`}>
            <span>Professional Summary</span>
            <span className="text-[10px] text-slate-400 font-normal normal-case tracking-normal">Target Job Aligned</span>
          </h2>
          {isEditing ? (
            <textarea
              value={resume.professionalSummary}
              onChange={(e) => updateField(['professionalSummary'], e.target.value)}
              rows={3}
              className={`w-full p-2 border border-slate-300 rounded font-normal text-slate-800 ${sizeClasses.body}`}
            />
          ) : (
            <p className={`${sizeClasses.body} text-slate-700 leading-relaxed text-justify`}>
              {resume.professionalSummary}
            </p>
          )}
        </section>

        {/* SKILLS & CORE COMPETENCIES */}
        <section className={`${sizeClasses.sectionGap}`}>
          <h2 className={`${sizeClasses.heading2} ${colors.primary} border-b ${colors.borderLight} pb-1 mb-2 font-bold`}>
            Skills & Technical Expertise
          </h2>
          <div className={`bg-slate-50 border border-slate-200/80 rounded p-3 ${sizeClasses.body} space-y-2`}>
            {resume.skills.coreCompetencies?.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <span className="font-semibold text-slate-900 shrink-0 w-36">Core Competencies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.coreCompetencies.map((item, idx) => (
                    <span
                      key={idx}
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${colors.badge}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {resume.skills.technicalSkills?.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <span className="font-semibold text-slate-900 shrink-0 w-36">Technical Skills:</span>
                <span className="text-slate-700">{resume.skills.technicalSkills.join(' • ')}</span>
              </div>
            )}

            {resume.skills.toolsAndPlatforms?.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <span className="font-semibold text-slate-900 shrink-0 w-36">Tools & Platforms:</span>
                <span className="text-slate-700">{resume.skills.toolsAndPlatforms.join(' • ')}</span>
              </div>
            )}

            {resume.skills.softSkills && resume.skills.softSkills.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <span className="font-semibold text-slate-900 shrink-0 w-36">Methodologies & Soft Skills:</span>
                <span className="text-slate-700">{resume.skills.softSkills.join(' • ')}</span>
              </div>
            )}
          </div>
        </section>

        {/* WORK EXPERIENCE */}
        <section className={`${sizeClasses.sectionGap}`}>
          <h2 className={`${sizeClasses.heading2} ${colors.primary} border-b ${colors.borderLight} pb-1 mb-3 font-bold`}>
            Work Experience
          </h2>
          <div className={sizeClasses.spacing}>
            {resume.workExperience.map((exp, expIdx) => (
              <div key={expIdx} className="job-entry page-break-avoid">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-[13px]">{exp.jobTitle}</span>
                    <span className="text-slate-500 mx-1.5">•</span>
                    <span className="font-semibold text-slate-700 text-[13px]">{exp.company}</span>
                    {exp.location && (
                      <span className="text-slate-500 text-xs ml-1.5">({exp.location})</span>
                    )}
                  </div>
                  <div className={`${sizeClasses.meta} font-medium text-slate-500 sm:text-right shrink-0 mt-0.5 sm:mt-0`}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>

                {/* Bullet Points */}
                <ul className="mt-1.5 space-y-1 text-slate-700">
                  {exp.bulletPoints.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} className="flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.bulletDot} mt-1.5 shrink-0`} />
                      {isEditing ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => updateBulletPoint(expIdx, bulletIdx, e.target.value)}
                            className={`flex-1 p-1 border border-slate-300 rounded ${sizeClasses.bullet}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeBulletPoint(expIdx, bulletIdx)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                            title="Remove bullet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className={`${sizeClasses.bullet} leading-normal`}>{bullet}</span>
                      )}
                    </li>
                  ))}
                </ul>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => addBulletPoint(expIdx)}
                    className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    <Plus className="w-3 h-3" /> Add bullet point
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS (IF ANY) */}
        {resume.projects && resume.projects.length > 0 && (
          <section className={`${sizeClasses.sectionGap}`}>
            <h2 className={`${sizeClasses.heading2} ${colors.primary} border-b ${colors.borderLight} pb-1 mb-2 font-bold`}>
              Key Projects & Implementations
            </h2>
            <div className={sizeClasses.spacing}>
              {resume.projects.map((proj, pIdx) => (
                <div key={pIdx} className="project-entry page-break-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <div className="font-semibold text-slate-900 text-xs">
                      {proj.title}
                      {proj.role && <span className="text-slate-500 font-normal ml-1">({proj.role})</span>}
                    </div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="text-[11px] text-slate-500 font-mono">
                        {proj.technologies.join(', ')}
                      </div>
                    )}
                  </div>
                  <p className={`${sizeClasses.body} text-slate-700 mt-0.5`}>{proj.description}</p>
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {proj.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                          <span className={`w-1 h-1 rounded-full ${colors.bulletDot} mt-1.5 shrink-0`} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        <section className={`${sizeClasses.sectionGap}`}>
          <div className="flex items-center justify-between border-b pb-1 mb-2">
            <h2 className={`${sizeClasses.heading2} ${colors.primary} font-bold`}>
              Education
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={addEducation}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
              >
                <Plus className="w-3 h-3" /> Add Education
              </button>
            )}
          </div>
          <div className="space-y-2.5">
            {resume.education.map((rawEdu, eduIdx) => {
              const edu = formatEducationItem(rawEdu);
              return (
                <div key={eduIdx} className="edu-entry page-break-avoid">
                  {isEditing ? (
                    <div className="space-y-1.5 bg-slate-50 border border-slate-200/80 rounded p-2 text-xs">
                      <div className="flex items-center justify-between gap-1">
                        <input
                          type="text"
                          placeholder="Line 1: Degree (e.g. Bachelor of Science in Information Technology (BSIT))"
                          value={rawEdu.degree}
                          onChange={(e) => updateEducation(eduIdx, 'degree', e.target.value)}
                          className="font-bold text-slate-900 border border-slate-300 rounded px-1.5 py-0.5 w-full text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeEducation(eduIdx)}
                          className="text-rose-500 hover:text-rose-700 p-0.5 shrink-0"
                          title="Remove education"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                        <input
                          type="text"
                          placeholder="Line 2: University / Institution"
                          value={rawEdu.institution}
                          onChange={(e) => updateEducation(eduIdx, 'institution', e.target.value)}
                          className="border border-slate-300 rounded px-1.5 py-0.5 text-[11px]"
                        />
                        <input
                          type="text"
                          placeholder="Line 2: Place / Location"
                          value={rawEdu.location || ''}
                          onChange={(e) => updateEducation(eduIdx, 'location', e.target.value)}
                          className="border border-slate-300 rounded px-1.5 py-0.5 text-[11px]"
                        />
                        <input
                          type="text"
                          placeholder="Line 1: Date Range"
                          value={rawEdu.graduationYear}
                          onChange={(e) => updateEducation(eduIdx, 'graduationYear', e.target.value)}
                          className="border border-slate-300 rounded px-1.5 py-0.5 text-[11px] font-mono text-right"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Line 3: Relevant Coursework"
                        value={rawEdu.honorsOrDetails || ''}
                        onChange={(e) => updateEducation(eduIdx, 'honorsOrDetails', e.target.value)}
                        className="border border-slate-300 rounded px-1.5 py-0.5 text-[11px] w-full"
                      />
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {/* Line 1 : Degree (Left) | Date Range (Right alignment) */}
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-bold text-slate-900 text-xs tracking-tight">
                          {edu.degree}
                        </span>
                        <span className={`${sizeClasses.meta} font-medium text-slate-500 text-right shrink-0 font-mono`}>
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
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CERTIFICATIONS (IF ANY) */}
        {resume.certifications && resume.certifications.length > 0 && (
          <section className={`${sizeClasses.sectionGap}`}>
            <h2 className={`${sizeClasses.heading2} ${colors.primary} border-b ${colors.borderLight} pb-1 mb-2 font-bold`}>
              Certifications & Training
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700">
              {resume.certifications.map((cert, cIdx) => (
                <span key={cIdx} className="inline-flex items-center gap-1.5">
                  <span className="font-semibold text-slate-900">{cert.name}</span>
                  <span className="text-slate-500">({cert.issuer}{cert.year ? ` - ${cert.year}` : ''})</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* PROFESSIONAL REFERENCES */}
        {((resume.references && resume.references.length > 0) || isEditing) && (
          <section className={`references-block ${sizeClasses.sectionGap}`}>
            <div className="flex items-center justify-between border-b pb-1 mb-2">
              <div className="flex items-center gap-2">
                <h2 className={`${sizeClasses.heading2} ${colors.primary} font-bold`}>
                  References
                </h2>
                {resume.references && resume.references.length > 0 && (
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({resume.references.length} {resume.references.length === 1 ? 'reference' : 'references'})
                  </span>
                )}
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={addReference}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
                >
                  <Plus className="w-3 h-3" /> Add Reference
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              {resume.references?.map((rawRef, rIdx) => {
                const ref = formatReferenceItem(rawRef);

                return (
                  <div key={rIdx} className="bg-slate-50 border border-slate-200/80 rounded p-2.5 space-y-0.5 relative page-break-avoid">
                    {isEditing ? (
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-1">
                          <input
                            type="text"
                            placeholder="Line 1: Full Name (e.g. Juan Dela Cruz)"
                            value={rawRef.name}
                            onChange={(e) => updateReference(rIdx, 'name', e.target.value)}
                            className="font-bold text-slate-900 border border-slate-300 rounded px-1.5 py-0.5 w-full text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => removeReference(rIdx)}
                            className="text-rose-500 hover:text-rose-700 p-0.5 shrink-0"
                            title="Remove reference"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Line 2: Company (e.g. Telecommunication Service Cooperative)"
                          value={rawRef.company || ''}
                          onChange={(e) => updateReference(rIdx, 'company', e.target.value)}
                          className="border border-slate-300 rounded px-1.5 py-0.5 text-[11px] w-full"
                        />
                        <input
                          type="text"
                          placeholder="Line 3: Position (e.g. Branch Manager)"
                          value={rawRef.title || ''}
                          onChange={(e) => updateReference(rIdx, 'title', e.target.value)}
                          className="border border-slate-300 rounded px-1.5 py-0.5 text-[11px] w-full"
                        />
                        <div className="flex gap-1">
                          <input
                            type="text"
                            placeholder="Line 4: Phone (e.g. 12358698)"
                            value={rawRef.phone || ''}
                            onChange={(e) => updateReference(rIdx, 'phone', e.target.value)}
                            className="border border-slate-300 rounded px-1.5 py-0.5 text-[11px] w-1/2 font-mono"
                          />
                          <input
                            type="text"
                            placeholder="Line 4: Email (optional, blank if none)"
                            value={rawRef.email || ''}
                            onChange={(e) => updateReference(rIdx, 'email', e.target.value)}
                            className="border border-slate-300 rounded px-1.5 py-0.5 text-[11px] w-1/2 font-mono"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
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
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
