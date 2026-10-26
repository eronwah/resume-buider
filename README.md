# AI Resume & CV Reviser (ATS Tailoring Engine)

An AI-powered web application that analyzes target Job Descriptions, adapts genuine candidate skillsets, optimizes ATS keywords and STAR bullet points, and generates downloadable high-definition PDF resumes, comprehensive CVs, and tailored cover letters.

![AI Resume Reviser](https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&auto=format&fit=crop&q=80)

---

## 🚀 Key Features

- **Native PDF Resume Upload**: Drag-and-drop or select your existing `.pdf` resume file. Gemini multimodal AI reads career history, structure, and dates directly without OCR errors.
- **Job Description Alignment**: Paste any job posting (LinkedIn, Indeed, JobStreet, company career pages) to extract high-priority keywords, required skills, and core deliverables.
- **Strict Experience & Date Preservation**: Preserves the exact chronological order of work experiences and locks in start/end dates, months, years, and employment arrangements (e.g. Freelance/Part-time). Only enhances descriptions and bullet points.
- **Reference Preservation**: Retains all professional reference contacts verbatim.
- **ATS Match Score & Gap Matrix**: Detailed match percentage breakdown (Overall, Keywords, Skills, Experience) with identified matching keywords and suggested prep terms.
- **3 Tailored Documents in 1 Click**:
  - **Tailored Resume (ATS Optimized)**: 1-2 page format with executive summary, skills taxonomy, and metric-driven accomplishments.
  - **Comprehensive CV (Curriculum Vitae)**: In-depth layout detailing scope of responsibilities, leadership, and architectural practices.
  - **Tailored Cover Letter**: Persuasive application letter targeted to the hiring team.
- **High-Definition PDF Export**:
  - Built with `html-to-image` and `jsPDF` for 2x DPI vector-like clarity.
  - Standard A4 formatting with zero margin clipping and clean page division.
  - 4 customizable templates: *Modern Executive*, *ATS Clean Single-Col*, *Tech Lead*, and *Classic Serif*.
  - Inline editing: Click and modify any word, date, or bullet point before downloading.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion
- **Backend**: Node.js, Express, TSX
- **AI Engine**: Google GenAI SDK (`@google/genai`) with `gemini-3.8-flash`
- **PDF Engine**: `html-to-image` & `jspdf`

---

## 📦 Getting Started Locally

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- Google Gemini API Key (from [Google AI Studio](https://aistudio.google.com/))

### 2. Clone and Install
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
cd YOUR_REPOSITORY_NAME
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Gemini API key in `.env`:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🌐 Bakit nagiging White Screen sa GitHub at Paano Ayusin (Fix for Blank White Screen)

Kung nag-push ka sa GitHub at sinubukan mong buksan gamit ang **GitHub Pages** pero **white screen / blank page** ang lumalabas:

### 🔍 Dahilan:
1. Ang Vite + React project ay gumagamit ng TypeScript (`src/main.tsx`). Hindi ito plain HTML/JS.
2. Kapag naka-set ang GitHub Pages sa **"Deploy from a branch (main/root)"**, sinusubukang i-load ng browser ang uncompiled `src/main.tsx`. Dahil hindi naiintindihan ng web browser ang hilaw na `.tsx` file, nagkakaroon ng error at nagiging **puti (white screen)** ang page.

### 🛠️ Solusyon (Pumili ng isa):

#### Option 1: Gamitin ang Automated GitHub Actions (Inirerekomenda)
Nakalagay na sa repository na ito ang `.github/workflows/deploy.yml`:
1. I-push ang iyong mga bagong pagbabago sa GitHub:
   ```bash
   git add .
   git commit -m "Fix GitHub Pages deployment and layout"
   git push origin main
   ```
2. Pumunta sa iyong GitHub Repository sa browser.
3. I-click ang **Settings** > **Pages** (nasa kaliwang menu).
4. Sa ilalim ng **"Build and deployment"** > **Source**, palitan ang *"Deploy from a branch"* at piliin ang **"GitHub Actions"**.
5. Kusa nang magpapatakbo ang GitHub ng automated build (`npm run build`) at ilalabas ang website nang walang white screen!

#### Option 2: Patakbuhin sa iyong Computer (Local Machine)
1. I-clone ang iyong repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   cd YOUR_REPOSITORY
   npm install
   ```
2. Gumawa ng `.env` file at ilagay ang iyong Gemini API Key:
   ```bash
   cp .env.example .env
   # I-edit ang .env at ilagay ang iyong GEMINI_API_KEY
   ```
3. Patakbuhin ang dev server:
   ```bash
   npm run dev
   ```
4. Buksan ang `http://localhost:3000` sa iyong browser.

---

## 📄 License
Apache-2.0

