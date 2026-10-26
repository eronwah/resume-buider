export interface SamplePreset {
  id: string;
  label: string;
  role: string;
  description: string;
  currentResume: string;
  jobDescription: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'fullstack-dev',
    label: 'Web / Full-Stack Developer',
    role: 'Full-Stack Developer applying to Senior React & TypeScript Lead',
    description: 'Existing React/JavaScript dev tailoring for a high-paying Senior Full-Stack React/Next.js/Node role.',
    currentResume: `JUAN DELA CRUZ
Email: juan.delacruz@email.com | Phone: +63 917 123 4567 | Manila, Philippines
LinkedIn: linkedin.com/in/juandelacruz-dev | GitHub: github.com/juandc

PROFESSIONAL SUMMARY:
Web Developer with 4 years of experience building web applications using JavaScript, React, HTML, CSS, and Express. Created multiple customer portals, integrated REST APIs, and managed database tables in PostgreSQL. Eager to take on larger responsibilities and work on modern scalable web platforms.

SKILLS:
- Frontend: JavaScript (ES6+), React.js, HTML5, CSS3, Bootstrap, Tailwind CSS, Redux
- Backend: Node.js, Express.js, RESTful APIs, basic GraphQL
- Database & Tools: PostgreSQL, MySQL, Git, GitHub, Postman, Vite, Vercel

WORK EXPERIENCE:
Frontend Web Developer | Manila Tech Solutions
June 2022 - Present | Taguig City, PH
- Developed interactive web features using React and Tailwind CSS for client e-commerce platforms.
- Collaborated with UI/UX designers to convert Figma mockups into responsive web components.
- Integrated backend REST API endpoints with frontend state management, speeding up load times by 20%.
- Fixed UI bugs and resolved cross-browser compatibility issues across Chrome, Safari, and Firefox.
- Participated in weekly agile standups and code reviews with senior teammates.

Junior Software Engineer | CloudFirst PH Inc.
January 2021 - May 2022 | Makati City, PH
- Built CRUD endpoints using Node.js and Express for an internal inventory management system.
- Maintained PostgreSQL database tables, wrote basic queries, and created data migrations.
- Tested endpoints using Postman and implemented basic JWT authentication for user login.
- Documented API routes and drafted setup guides for onboarding new team members.

EDUCATION:
Bachelor of Science in Information Technology
Polytechnic University of the Philippines | 2017 - 2021 | Magna Cum Laude

PROJECTS:
- TaskFlow Workspace: Kanban-style task management web app built with React, Tailwind, and Node.js with real-time updates.
- PayPortal Checkout: Payment gateway integration mockup supporting simulated GCash and credit card transactions.

REFERENCES:
- Mark Rodriguez | Lead Architect, Manila Tech Solutions | mark.rodriguez@manilatech.ph | +63 917 888 1234
- Elena Morales | Engineering Manager, CloudFirst PH | elena.morales@cloudfirst.com | +63 920 777 5678`,
    jobDescription: `Position: Senior Full-Stack React & Node.js Engineer
Company: Apex Global Technologies
Location: Hybrid / Remote (Philippines or Southeast Asia)

About the Role:
We are seeking a high-performing Senior Full-Stack Engineer with deep expertise in React 18/19, TypeScript, modern state management, and Node.js microservices. In this role, you will architect enterprise-grade SaaS features, optimize Core Web Vitals, mentor junior engineers, and drive CI/CD and automated testing standards.

Key Requirements:
- 3+ years of production experience with React, TypeScript, and modern ecosystem (Next.js or Vite).
- Proven experience building scalable REST and GraphQL APIs using Node.js and TypeScript.
- Strong knowledge of relational databases (PostgreSQL) and query optimization.
- Experience with testing suites (Jest, Vitest, React Testing Library, or Cypress).
- Familiarity with Cloud platforms (AWS or GCP), Docker containerization, and CI/CD pipelines.
- Demonstrated leadership, code review rigor, and ability to communicate technical trade-offs to product stakeholders.
- Mindset oriented toward performance optimization, clean code architecture, and high reliability.`,
  },
  {
    id: 'virtual-assistant',
    label: 'Executive VA & Operations Specialist',
    role: 'Virtual Assistant tailoring for Operations & Client Success Lead',
    description: 'Admin VA tailoring their experience for an international Operations & Project Coordinator position.',
    currentResume: `MARIA SANTOS
Email: maria.santos.va@email.com | Phone: +63 920 987 6543 | Cebu, Philippines
LinkedIn: linkedin.com/in/mariasantos-ops

PROFESSIONAL SUMMARY:
Dedicated and detail-oriented Virtual Assistant with 3+ years of experience supporting international small business owners in the US and Australia. Proficient in managing complex calendars, handling client email correspondence, organizing digital files, and utilizing tools like ClickUp, Slack, and Google Workspace.

CORE SKILLS:
- Executive Support: Calendar Management, Travel Arrangements, Email Inbox Zero, Meeting Minutes
- Project & CRM Tools: ClickUp, Asana, Trello, Notion, HubSpot, Zendesk
- Communication & Admin: Customer Service, Data Entry, Google Workspace, Canva graphics

WORK EXPERIENCE:
Virtual Assistant / Project Support | Horizon Digital Agency (Remote)
August 2022 - Present
- Managed executive inboxes for 3 agency directors, filtering 150+ daily emails and maintaining Inbox Zero.
- Scheduled and coordinated over 40 weekly international client calls across multiple time zones (PST, EST, AEST).
- Created SOPs (Standard Operating Procedures) in Notion for client onboarding and invoice tracking.
- Assisted in managing client deliverables on Asana and sent weekly milestone update reports.

Customer Support & Admin Assistant | BPO Global Services
March 2020 - July 2022 | Cebu City, PH
- Answered 80+ customer inquiries daily via live chat and email regarding e-commerce shipments and order status.
- Maintained high customer satisfaction score (CSAT 96%) over 2 consecutive years.
- Processed refund requests and updated account records in Salesforce.

EDUCATION:
Bachelor of Arts in Communication
University of San Carlos, Cebu | 2016 - 2020

REFERENCES:
- David Miller | Managing Director, Horizon Digital Agency | david@horizondigital.agency | +1 (415) 555-0192
- Grace Tan | Operations Head, BPO Global Services | grace.tan@bpoglobal.ph | +63 917 555 4321`,
    jobDescription: `Position: Remote Client Operations & Project Coordinator
Company: Elevate Growth Partners (US Remote Client)

Overview:
We need an exceptional, highly proactive Operations & Project Coordinator to bridge our client account management, workflow automation, and leadership support.

Key Responsibilities:
- Act as the central operations anchor: oversee client project timelines in ClickUp/Asana, track milestones, and ensure zero missed deadlines.
- Own executive communications, high-stakes client correspondence, and calendar orchestration across international stakeholders.
- Build and standardize workflow automations using Zapier/Make and CRM systems (HubSpot/Notion).
- Lead client onboarding calls, draft meeting executive summaries, and track action items.
- Identify operational bottlenecks and author comprehensive Standard Operating Procedures (SOPs).

Qualifications:
- 3+ years experience in remote operations, client success, or high-level executive assistance for fast-paced agencies.
- Mastery of modern workflow tools: ClickUp, Slack, Notion, Zapier, HubSpot.
- Flawless English verbal and written communication with executive presence.
- High degree of autonomy, problem-solving initiative, and obsessive attention to detail.`,
  },
  {
    id: 'data-analyst',
    label: 'Data / Business Intelligence Analyst',
    role: 'Junior/Mid Data Analyst tailoring for Lead BI & Insights Analyst',
    description: 'Data reporting specialist positioning their SQL, Tableau, and analytical skills for a Lead BI role.',
    currentResume: `ANGELO REYES
Email: angelo.reyes.data@email.com | Phone: +63 918 555 7890 | Quezon City, Philippines
LinkedIn: linkedin.com/in/angeloreyes-analytics

SUMMARY:
Data Analyst with 3 years of hands-on experience transforming raw business data into actionable dashboard insights. Proficient in SQL, Python for data manipulation, Tableau, and Microsoft Excel. Experienced in working with sales, marketing, and operations teams to monitor KPI metrics.

SKILLS:
- Analysis & BI: SQL, PostgreSQL, MySQL, Tableau, Power BI, Advanced Excel, Pivot Tables
- Programming: Python (Pandas, NumPy, Matplotlib)
- Business: Cohort analysis, KPI tracking, A/B testing evaluation, Dashboard design

EXPERIENCE:
Data Analyst | RetailTech Insights PH
January 2022 - Present
- Designed and maintained 15+ automated Tableau dashboards tracking daily sales, inventory levels, and customer churn.
- Wrote complex SQL queries, joins, and window functions across 2M+ transaction records.
- Conducted monthly cohort retention analyses that helped marketing boost customer return rates by 14%.
- Prepared executive presentation slide decks summarizing monthly business performance.

Junior Reporting Specialist | FinServe Solutions
July 2020 - December 2021
- Consolidated weekly financial and operational metrics using Excel macros and Google Sheets.
- Assisted senior analysts in cleaning raw data exports and validating data accuracy.
- Documented data dictionary and schema documentation for reporting tables.

EDUCATION:
Bachelor of Science in Statistics
University of the Philippines Diliman | 2016 - 2020

REFERENCES:
- Carlos Gomez | VP of Analytics, RetailTech Insights PH | carlos.gomez@retailtech.ph | +63 918 222 3456
- Patricia Lim | Senior BI Lead, FinServe Solutions | patricia.lim@finserve.com | +63 922 444 7890`,
    jobDescription: `Position: Senior Business Intelligence & Product Analytics Specialist
Company: Fintech Vanguard Global
Location: Remote / Manila Tech Hub

Role Overview:
We are looking for an analytical powerhouse to lead our product intelligence and business decisioning infrastructure. You will collaborate directly with VP of Product and C-Suite to define metric frameworks, build scalable data models, and uncover growth levers.

Requirements:
- Advanced SQL proficiency (CTEs, window functions, query optimization on BigQuery/Snowflake).
- 3+ years crafting executive-ready dashboards in Tableau or Power BI with strong visual storytelling.
- Experience modeling user behavior, retention funnels, and statistical A/B testing significance.
- Working knowledge of Python/R for statistical modeling and predictive insights.
- Strong business acumen: ability to translate ambiguous questions into quantitative experiments and actionable recommendations.`,
  },
];
