export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
  github?: string;
}

export interface WorkExperienceItem {
  id?: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  bulletPoints: string[];
}

export interface EducationItem {
  id?: string;
  degree: string;
  institution: string;
  location?: string;
  graduationYear: string;
  honorsOrDetails?: string;
}

export interface ProjectItem {
  id?: string;
  title: string;
  role?: string;
  technologies?: string[];
  description: string;
  highlights?: string[];
}

export interface CertificationItem {
  id?: string;
  name: string;
  issuer: string;
  year?: string;
}

export interface ResumeSkills {
  coreCompetencies: string[];
  technicalSkills: string[];
  toolsAndPlatforms: string[];
  softSkills?: string[];
}

export interface ReferenceItem {
  id?: string;
  name: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  contact?: string;
  relationship?: string;
}

export interface TailoredResume {
  fullName: string;
  professionalTitle: string;
  contact: ContactInfo;
  professionalSummary: string;
  skills: ResumeSkills;
  workExperience: WorkExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications?: CertificationItem[];
  references?: ReferenceItem[];
}

export interface CVExperienceItem {
  role: string;
  organization: string;
  period: string;
  location?: string;
  scopeAndResponsibilities: string;
  keyAchievements: string[];
  technologiesUsed?: string[];
}

export interface TailoredCV {
  academicAndCareerProfile: string;
  coreAreasOfExpertise: string[];
  inDepthExperience: CVExperienceItem[];
  leadershipAndImpact?: string[];
  methodologiesAndPractices?: string[];
  languages?: string[];
  references?: ReferenceItem[];
}

export interface CoverLetter {
  recipientTitle?: string;
  companyName?: string;
  jobTitle: string;
  salutation: string;
  openingParagraph: string;
  alignmentParagraph1: string;
  alignmentParagraph2?: string;
  closingParagraph: string;
  signOff: string;
}

export interface AtsScoreData {
  overallScore: number;
  keywordScore: number;
  skillsScore: number;
  experienceScore: number;
  summaryFeedback: string;
}

export interface KeywordAnalysisData {
  matchedKeywords: string[];
  missingOrSuggestedKeywords: string[];
  transferableSkillsHighlighted: string[];
}

export interface RevisionResponse {
  atsScore: AtsScoreData;
  keywordAnalysis: KeywordAnalysisData;
  strategyHighlights: string[];
  resume: TailoredResume;
  cv: TailoredCV;
  coverLetter: CoverLetter;
}

export type TemplateStyle = 'modern-executive' | 'ats-clean' | 'tech-lead' | 'classic-serif';
export type ColorTheme = 'slate' | 'indigo' | 'emerald' | 'navy' | 'crimson' | 'amber';
export type FontSizeMode = 'compact' | 'standard' | 'relaxed';
export type ActiveDocumentView = 'resume' | 'cv' | 'cover-letter' | 'ats-insights';
