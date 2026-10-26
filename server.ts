import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Resume Revision schema for Gemini
const revisionResponseSchema = {
  type: Type.OBJECT,
  properties: {
    atsScore: {
      type: Type.OBJECT,
      properties: {
        overallScore: { type: Type.INTEGER, description: 'ATS match score from 0 to 100' },
        keywordScore: { type: Type.INTEGER, description: 'Keyword matching score 0-100' },
        skillsScore: { type: Type.INTEGER, description: 'Skillset alignment score 0-100' },
        experienceScore: { type: Type.INTEGER, description: 'Experience relevance score 0-100' },
        summaryFeedback: { type: Type.STRING, description: 'Key critique and summary of adaptations made' },
      },
      required: ['overallScore', 'keywordScore', 'skillsScore', 'experienceScore', 'summaryFeedback'],
    },
    keywordAnalysis: {
      type: Type.OBJECT,
      properties: {
        matchedKeywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Skills and keywords successfully aligned with the JD',
        },
        missingOrSuggestedKeywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Keywords from JD that candidate can adopt or prepare for',
        },
        transferableSkillsHighlighted: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Existing candidate skills reframed to match JD priorities',
        },
      },
      required: ['matchedKeywords', 'missingOrSuggestedKeywords', 'transferableSkillsHighlighted'],
    },
    strategyHighlights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3-5 key strategic changes made to tailor the resume to this specific job',
    },
    resume: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        professionalTitle: { type: Type.STRING, description: 'Target job title aligned with the JD' },
        contact: {
          type: Type.OBJECT,
          properties: {
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            portfolio: { type: Type.STRING },
            github: { type: Type.STRING },
          },
          required: ['email', 'phone', 'location'],
        },
        professionalSummary: {
          type: Type.STRING,
          description: 'High-impact 3-4 sentence professional summary tightly tailored to the target JD',
        },
        skills: {
          type: Type.OBJECT,
          properties: {
            coreCompetencies: { type: Type.ARRAY, items: { type: Type.STRING } },
            technicalSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            toolsAndPlatforms: { type: Type.ARRAY, items: { type: Type.STRING } },
            softSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['coreCompetencies', 'technicalSkills', 'toolsAndPlatforms'],
        },
        workExperience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              jobTitle: { type: Type.STRING },
              company: { type: Type.STRING },
              location: { type: Type.STRING },
              startDate: { type: Type.STRING },
              endDate: { type: Type.STRING },
              current: { type: Type.BOOLEAN },
              bulletPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Tailored action-oriented bullets with strong verbs, quantifiable results, and JD keywords',
              },
            },
            required: ['jobTitle', 'company', 'startDate', 'endDate', 'bulletPoints'],
          },
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              degree: { type: Type.STRING, description: 'Line 1: Degree title only, e.g. "Bachelor of Science in Information Technology (BSIT)"' },
              institution: { type: Type.STRING, description: 'Line 2: University / School name only, e.g. "AMA Computer Learning Center (ACLC)"' },
              location: { type: Type.STRING, description: 'Line 2: Place / City / Province only, e.g. "Gapan City, Nueva Ecija"' },
              graduationYear: { type: Type.STRING, description: 'Line 1: Graduation date or date range only, e.g. "March 2020"' },
              honorsOrDetails: { type: Type.STRING, description: 'Line 3: Relevant Coursework or honors only, e.g. "Relevant Coursework: Database Systems, Computer Science, Data Management, Systems Analysis"' },
            },
            required: ['degree', 'institution', 'graduationYear'],
          },
        },
        projects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              role: { type: Type.STRING },
              technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
              description: { type: Type.STRING },
              highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['title', 'description'],
          },
        },
        certifications: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              issuer: { type: Type.STRING },
              year: { type: Type.STRING },
            },
            required: ['name', 'issuer'],
          },
        },
        references: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Line 1: Full name of reference (e.g. John Tristan Lagasca)' },
              company: { type: Type.STRING, description: 'Line 2: Company or organization name (e.g. Telecommunications Service Cooperative)' },
              title: { type: Type.STRING, description: 'Line 3: Job position / designation (e.g. Branch Manager)' },
              phone: { type: Type.STRING, description: 'Line 4: Contact phone or mobile number from uploaded resume (e.g. 09770927233). MANDATORY: Extract verbatim from resume.' },
              email: { type: Type.STRING, description: 'Line 4: Contact email address if present in resume, or empty string "" if none' },
              contact: { type: Type.STRING, description: 'Any extra contact notes from resume' },
            },
            required: ['name', 'company', 'title', 'phone', 'email'],
          },
          description: 'MANDATORY: Return EVERY single reference from the uploaded resume. Resumes frequently have 2 or more references listed in columns or side-by-side. You MUST scan both columns and return ALL of them (e.g. 2 of 2). NEVER stop at just 1 reference.',
        },
      },
      required: ['fullName', 'professionalTitle', 'contact', 'professionalSummary', 'skills', 'workExperience'],
    },
    cv: {
      type: Type.OBJECT,
      properties: {
        academicAndCareerProfile: { type: Type.STRING, description: 'Comprehensive expanded biography and domain mastery statement' },
        coreAreasOfExpertise: { type: Type.ARRAY, items: { type: Type.STRING } },
        inDepthExperience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              organization: { type: Type.STRING },
              period: { type: Type.STRING },
              location: { type: Type.STRING },
              scopeAndResponsibilities: { type: Type.STRING },
              keyAchievements: { type: Type.ARRAY, items: { type: Type.STRING } },
              technologiesUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['role', 'organization', 'period', 'scopeAndResponsibilities', 'keyAchievements'],
          },
        },
        leadershipAndImpact: { type: Type.ARRAY, items: { type: Type.STRING } },
        methodologiesAndPractices: { type: Type.ARRAY, items: { type: Type.STRING } },
        languages: { type: Type.ARRAY, items: { type: Type.STRING } },
        references: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Line 1: Full name of reference' },
              company: { type: Type.STRING, description: 'Line 2: Company or organization name' },
              title: { type: Type.STRING, description: 'Line 3: Job position / designation' },
              phone: { type: Type.STRING, description: 'Line 4: Contact phone or mobile number from uploaded resume' },
              email: { type: Type.STRING, description: 'Line 4: Contact email address if present in resume, or empty string "" if none' },
              contact: { type: Type.STRING, description: 'Any extra contact notes from resume' },
            },
            required: ['name', 'company', 'title', 'phone', 'email'],
          },
          description: 'MANDATORY: Return EVERY single reference from the candidate resume. Scan all columns to extract all references (e.g. both reference 1 and reference 2).',
        },
      },
      required: ['academicAndCareerProfile', 'coreAreasOfExpertise', 'inDepthExperience'],
    },
    coverLetter: {
      type: Type.OBJECT,
      properties: {
        recipientTitle: { type: Type.STRING },
        companyName: { type: Type.STRING },
        jobTitle: { type: Type.STRING },
        salutation: { type: Type.STRING },
        openingParagraph: { type: Type.STRING },
        alignmentParagraph1: { type: Type.STRING },
        alignmentParagraph2: { type: Type.STRING },
        closingParagraph: { type: Type.STRING },
        signOff: { type: Type.STRING },
      },
      required: ['jobTitle', 'salutation', 'openingParagraph', 'alignmentParagraph1', 'closingParagraph', 'signOff'],
    },
  },
  required: ['atsScore', 'keywordAnalysis', 'strategyHighlights', 'resume', 'cv', 'coverLetter'],
};

// API Route: Tailor Resume, CV, and Cover Letter
app.post('/api/revise-resume', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Missing GEMINI_API_KEY. Please create a .env file with your GEMINI_API_KEY or configure it in your hosting platform.',
      });
    }

    const { currentResume, pdfBase64, jobDescription, tone = 'ats-optimized', focusNotes = '' } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required.' });
    }

    if (!currentResume && !pdfBase64) {
      return res.status(400).json({ error: 'Please upload a PDF resume or provide resume text.' });
    }

    const systemInstruction = `You are a world-class Executive Resume Writer, Career Strategist, and Applicant Tracking System (ATS) Optimization Specialist.
Your mission is to take the candidate's existing resume (provided either as an attached PDF document or text) and revise/adapt their genuine skillsets, work history, and achievements so that they tightly align with the target Job Description (JD).

Core Rules & Standards:
1. TRUTHFUL REFRAMING: Do NOT invent fake degrees or false companies. Instead, rigorously highlight and reframe the candidate's real skillsets, technologies, and achievements using the terminology, priorities, and action keywords demanded by the Job Description.
2. ATS OPTIMIZATION: Extract the top hard skills, tools, and methodologies from the Job Description and embed them naturally in the Professional Summary, Core Competencies, and Work Experience bullet points.
3. QUANTIFIABLE RESULTS & STRONG ACTION VERBS: Transform passive bullet points into high-impact accomplishment statements (Action Verb + Context/Skill + Measurable Impact/Result).
4. TAILORED RESUME: Crisp, executive, 1-2 page format with punchy bullets and optimized keyword density.
5. TAILORED CV (Curriculum Vitae): Comprehensive, expanded in-depth layout that details technical depth, system architecture, leadership impact, methodologies, and full professional scope.
6. TAILORED COVER LETTER: Persuasive, authentic letter directly addressed to the hiring team explaining why the candidate's existing track record directly solves the challenges outlined in the Job Description.
7. ATS SCORE & GAP ANALYSIS: Provide realistic scores (0-100) comparing the original profile to the JD, list matched keywords, and recommend any minor skills/tools the candidate can quickly study.
8. ALL OUTPUT IN ENGLISH: The entire generated resume, CV, cover letter, and ATS analysis must be in high-standard, professional English.
9. STRICT WORK EXPERIENCE ARRANGEMENT & DATE PRESERVATION (CRITICAL):
   - You MUST keep the EXACT arrangement and order of work experiences as they appear in the candidate's uploaded PDF or resume text. Do NOT reverse, swap, omit, or rearrange the positions.
   - You MUST NOT modify ANY dates (start date, end date, months, years, "Present", or duration).
   - You MUST NOT alter company names or employment arrangements (e.g. "Freelance/part time - April 2025 to Oct 2026" must retain its exact dates and company name).
   - ONLY rewrite and adapt the description and bullet points for each experience to highlight the target Job Description competencies and quantifiable achievements.
10. STRICT PROFESSIONAL REFERENCES & COMPLETE ALL-REFERENCES EXTRACTION (CRITICAL MANDATORY REQUIREMENT):
   - You MUST scan the ENTIRE document for ALL professional references.
   - Resumes very commonly list references in TWO COLUMNS or SIDE-BY-SIDE (e.g. Reference 1 on the left column, Reference 2 on the right column, such as 'John Tristan Lagasca' and 'Annabelle Ramos').
   - If the candidate's resume contains 2 references, you MUST return an array containing BOTH references (all 2 of 2). DO NOT stop after extracting only 1 reference!
   - MANDATORY PHONE NUMBER CAPTURE: For EVERY reference in the candidate's resume, you MUST read the phone number or mobile digits (e.g. '09770927233', '12358698', etc.) located under or next to their name/title, and extract it verbatim into the 'phone' property. Under no circumstances should you omit the phone number if one is present on the resume!
   - For EVERY reference found, extract:
     * Line 1: name: Full Name of the reference (e.g., "John Tristan Lagasca" or "Annabelle Ramos")
     * Line 2: company: Company or organization name (e.g., "Telecommunications Service Cooperative" or "Philip Morris Fortune Tobacco Corp. (PMFTC)"). DO NOT OMIT THE COMPANY and do not merge it into position!
     * Line 3: title: Job position / designation (e.g., "Branch Manager" or "Modern Trade Field Executive"). DO NOT OMIT THE TITLE and do not merge company into position!
     * Line 4: phone: The exact contact phone number from the resume (e.g., "09770927233"). MANDATORY: DO NOT OMIT!
     * Line 4: email: The contact email address IF AND ONLY IF explicitly provided in the resume. If NO email was provided for this reference in the resume, leave email as "" (empty string). NEVER fabricate or guess placeholder emails!
   - Both resume.references and cv.references MUST contain all extracted references verbatim.
11. STRICT NO-HALLUCINATION OF SPECIFIC UNUSED TOOLS (CRITICAL):
   - Do NOT invent or inject specific brand-name software, tools, or applications that the candidate has NEVER mentioned in their uploaded resume or PDF (for example: NEVER say "Slack", "Microsoft Teams", "Zendesk", "Salesforce", "HubSpot", "Jira", "Asana", or specific time trackers unless that exact tool is explicitly present in the candidate's background).
   - If the Job Description highlights a tool the candidate didn't list, use honest, generalized professional phrasing instead, such as:
     * "company-provided communication channels and internal messaging platforms" (NEVER name Slack if not in candidate resume)
     * "company-designated time tracking and attendance systems"
     * "enterprise ticketing and inquiry management workflows"
     * "cloud-based spreadsheet architectures and collaboration tools"
   - Every tool mentioned must be authentic to what the candidate actually documented.
12. STRICT EDUCATION FORMATTING (EXACT 3-LINE SPECIFICATION):
   - For each education entry:
     * Line 1: degree: Degree title ONLY (e.g. "Bachelor of Science in Information Technology (BSIT)").
     * Line 1: graduationYear: The graduation date or date range only (e.g. "March 2020" or "June 2012 – March 2020").
     * Line 2: institution: University / School name ONLY (e.g. "AMA Computer Learning Center (ACLC)"). DO NOT put the city or graduation year into the institution name!
     * Line 2: location: Place / City / Province ONLY (e.g. "Gapan City, Nueva Ecija").
     * Line 3: honorsOrDetails: Relevant Coursework or honors (e.g. "Relevant Coursework: Database Systems, Computer Science, Data Management, Systems Analysis").
     * STRICT DEDUPLICATION: NEVER repeat attendance years (e.g., do NOT repeat "Attended June 2012 – March 2020" or "2020") inside 'honorsOrDetails' or 'degree' when graduationYear already contains the year! Keep it clean and readable without repeated words or years.`;

    const userTextPrompt = `
TARGET JOB DESCRIPTION:
${jobDescription}

${currentResume ? `CANDIDATE RESUME TEXT:\n${currentResume}\n` : ''}

USER REVISION PREFERENCES:
- Target Tone/Style: ${tone}
- Additional Focus / Candidate Notes: ${focusNotes || 'Focus on strongest transferable skills and high JD keyword alignment.'}

CRITICAL INSTRUCTIONS ON REFERENCES AND EDUCATION:
1. REFERENCES: Scan the entire uploaded resume carefully. Both Reference 1 and Reference 2 (and any additional references) MUST be returned with their Name, Company, Position, and Phone Number extracted verbatim (e.g. John Tristan Lagasca with phone and Annabelle Ramos with phone). Do NOT omit the contact phone numbers!
2. EDUCATION: Ensure Line 1 has the degree and date range, Line 2 has university and place, and Line 3 has relevant coursework without repeating dates.

Please analyze the candidate's background from the provided document/text against the Target Job Description and generate:
1. ATS score and Keyword Analysis.
2. Strategic revision highlights explaining what was reframed.
3. Fully revamped, ATS-friendly Tailored Resume.
4. Comprehensive, in-depth Tailored CV (Curriculum Vitae).
5. Compelling, tailored Cover Letter for this position.
Return the response strictly adhering to the JSON schema.`;

    // Build contents: if pdfBase64 is provided, attach it as an inlineData part!
    const contents: any[] = [];

    if (pdfBase64) {
      // Strip potential data URL prefix if present
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      contents.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: cleanBase64,
        },
      });
    }

    contents.push({
      text: userTextPrompt,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: revisionResponseSchema,
        temperature: 0.2,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('No response generated by Gemini model.');
    }

    const parsedData = JSON.parse(responseText);
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error revising resume:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process resume revision.',
    });
  }
});

// Quick polish / rewrite single bullet point endpoint
app.post('/api/rewrite-bullet', async (req, res) => {
  try {
    const { bulletText, targetRole, jobDescription } = req.body;
    if (!bulletText) {
      return res.status(400).json({ error: 'Bullet text is required.' });
    }

    const prompt = `Rewrite this resume bullet point into 3 high-impact, ATS-optimized variations in professional English using strong action verbs, quantifiable metrics, and alignment with the target role "${targetRole || 'Professional'}".
Job context: ${jobDescription?.slice(0, 500) || 'None provided'}
Original bullet: "${bulletText}"

Return JSON with format: { "variations": ["variation 1", "variation 2", "variation 3"] }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, variations: parsed.variations || [] });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Dev or Production Static Handler
async function setupServer() {
  if (process.env.VERCEL) {
    // Vercel handles static assets and routes /api calls to serverless functions
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

setupServer();

export default app;

