import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const roleKeywords = {
    'Frontend': ['React', 'JavaScript', 'TypeScript', 'Tailwind', 'Next.js', 'Redux', 'Architecture', 'TTI', 'Core Web Vitals', 'Performant', 'Accessible'],
    'Backend': ['Node.js', 'Go', 'Python', 'Microservices', 'distributed systems', 'high-availability', 'concurrency', 'API engineering', 'PostgreSQL', 'Kubernetes'],
    'Fullstack': ['React', 'Next.js', 'TypeScript', 'Node.js', 'tRPC', 'Prisma', 'E2E testing', 'SaaS', 'System Design'],
    'BDA': ['Data', 'Analytics', 'SQL', 'Tableau', 'Power BI', 'Statstical', 'ETL', 'Business', 'Strategy', 'KPI'],
    'Sales': ['Revenue', 'Market Expansion', 'CRM', 'Lead Generation', 'B2B', 'GTM', 'Negotiation', 'Strategic'],
    'General': ['Git', 'Communication', 'Teamwork', 'Agile', 'Leadership', 'Problem Solving']
};

const extractPersonalDetails = (text = "") => {
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const detectedName = lines.length > 0 ? lines[0] : "CANDIDATE NAME";

    return {
        name: String(detectedName).toUpperCase(),
        email: emailMatch ? emailMatch[0] : "contact@email.com",
        phone: phoneMatch ? phoneMatch[0] : "+91 91234 56789",
        location: "Dharmapuri, Tamil Nadu",
        dob: "DD-MM-YYYY",
        gender: "Not Specified",
        nationality: "Indian",
        education: "Bachelor's Degree",
        institution: "Professional University"
    };
};

const subRoleMapping = {
    // Frontend Family
    'UI Developer': {
        skills: { frontend: "HTML, CSS, Tailwind, Bootstrap, Responsive Design", backend: "None (UI Focused)", database: "None", languages: "HTML5, CSS3, JavaScript", tools: "Figma, Chrome DevTools", other: "Cross-browser Compatibility, Accessibility" },
        objective: "Detail-oriented UI Developer specialized in crafting visually stunning and highly responsive user interfaces using modern CSS frameworks and design systems."
    },
    'React Developer': {
        skills: { frontend: "React.js, Hooks, Redux, Context API, API Integration", backend: "Node.js (for integration)", database: "Firebase, Supabase", languages: "JavaScript (ES6+), JSX", tools: "Vite, Webpack, NPM, Git", other: "React Design Patterns, Performance Profiling" },
        objective: "React Developer with expertise in building dynamic, high-performance web applications using React Hooks and state management libraries. Skilled in seamless API integration and front-end optimization."
    },
    'UX Developer': {
        skills: { frontend: "Figma, UX Principles, Wireframing, Prototypes", backend: "None", database: "None", languages: "HTML, CSS, JavaScript (Basics)", tools: "Adobe XD, Sketch, Hotjar", other: "User Research, Journey Mapping, Usability Testing" },
        objective: "UX Developer dedicated to creating user-centric digital experiences through rigorous wireframing and prototyping. Expert in translating user behavior into intuitive product designs."
    },
    'Frontend Engineer': {
        skills: { frontend: "Advanced JS, Performance Optimization, Architecture, Design Patterns", backend: "Server-Side Rendering (Next.js)", database: "NoSQL", languages: "JavaScript (Deep Dive), TypeScript", tools: "Webpack, Performance Profiling, Docker", other: "Modular Architecture, Unit Testing, System Design" },
        objective: "Frontend Engineer focused on building scalable web architectures and optimizing critical rendering paths. Expert in advanced JavaScript and modular system design."
    },
    'Frontend Developer': {
        skills: { frontend: "HTML, CSS, JavaScript, React", backend: "Basic Node.js", database: "MySQL", languages: "JavaScript, HTML5, CSS3", tools: "Git, VS Code", other: "Web Fundamentals, REST APIs" },
        objective: "Agile Frontend Developer with a core focus on building interactive web interfaces using standard JavaScript and React. Dedicated to delivering clean, functional code."
    },
    // Backend Family
    'Node.js Developer': {
        skills: { frontend: "React (Consumption)", backend: "Node.js, Express, Middleware, JWT, Auth0", database: "MongoDB, PostgreSQL, SQL/NoSQL, Redis", languages: "JavaScript (ES6), TypeScript", tools: "Nodemon, Docker, Postman, PM2", other: "Microservices, Security Hardening, API Design" },
        objective: "Expert Node.js Developer with deep knowledge in building scalable, real-time server-side applications and secure microservices. Expert in data modeling and authentication protocols."
    },
    'Python Developer': {
        skills: { frontend: "Basic HTML/CSS", backend: "Django, Flask, Fast API, Celery", database: "PostgreSQL, SQLAlchemy, SQL/NoSQL, Redis", languages: "Python (Deep Dive), SQL", tools: "Pytest, Pylint, Docker, Jupyter", other: "Async IO, Data Processing, RESTful Services" },
        objective: "Python Developer specialized in developing robust backend systems and data-rich applications using modern Python frameworks like Django and Fast API."
    },
    'Java Developer': {
        skills: { frontend: "React (Basics)", backend: "Java, Spring Boot, Hibernate, J2EE", database: "Oracle, MySQL, SQL/NoSQL, DB2", languages: "Java 8+, SQL, Groovy", tools: "Maven, Jenkins, JUnit, SonarQube", other: "Object Oriented Design, JEE Patterns, Docker" },
        objective: "Java Expert with focus on enterprise-grade software development using Spring Boot and microservices architecture. Dedicated to building high-concurrency, maintainable backend systems."
    },
    'Database Engineer': {
        skills: { frontend: "None", backend: "Query Optimization, Indexing, Stored Procedures", database: "SQL/NoSQL, Oracle, MongoDB, Snowflake", languages: "SQL (Expert), PL/SQL, Python", tools: "Talend, Airflow, Informatica", other: "ETL, Data Warehousing, Data Modeling" },
        objective: "Detail-oriented Database Engineer focused on optimizing database performance, managing complex ETL pipelines, and ensuring data integrity across large-scale distributed systems."
    },
    // Fullstack Family
    'MERN Developer': {
        skills: { frontend: "React.js, Redux, Tailwind", backend: "Node.js, Express.js", database: "MongoDB, Mongoose, SQL/NoSQL", languages: "JavaScript (Full Stack)", tools: "Git, Heroku, Postman", other: "Full Lifecycle Development, MERN Stack Architecture" },
        objective: "Proficient MERN Stack Developer with end-to-end expertise in developing modern web applications from database modeling to responsive UI design."
    },
    'Fullstack Engineer': {
        skills: { frontend: "React, Next.js", backend: "Node.js, GraphQL", database: "PostgreSQL, Prisma, SQL/NoSQL", languages: "TypeScript (Expert), JS", tools: "AWS (S3, Lambda), Docker, CI/CD", other: "System Design, Cloud Infrastructure, Serverless" },
        objective: "Versatile Fullstack Engineer focused on high-level system design and cloud-native application development. Expert in TypeScript and modern DevOps practices."
    },
    // BDA Family
    'Data Analyst': {
        skills: { frontend: "Tableau, Power BI, Looker", backend: "Data Cleaning, Transformation", database: "SQL (Expert), Excel (VBA)", languages: "SQL, Python (Pandas)", tools: "Power Query, Alteryx, Jupyter", other: "KPI Dashboards, Reporting, Statistical Analysis" },
        objective: "Inquisitive Data Analyst specialized in transforming raw data into actionable insights through sophisticated visualization and statistical modeling."
    },
    'Data Scientist': {
        skills: { frontend: "Streamlit, Matplotlib, Seaborn", backend: "Machine Learning, Predictive Modeling", database: "NoSQL, BigQuery", languages: "Python (Sklearn, PyTorch), R", tools: "Jupyter, TensorFlow, Kaggle", other: "NLP, Computer Vision, Deep Learning, Statistics" },
        objective: "Data Scientist with expertise in building predictive models and deep learning algorithms to solve business problems with data-driven AI solutions."
    },
    'Business Analyst': {
        skills: { frontend: "Visio, LucidChart", backend: "Requirement Gathering, User Stories", database: "SQL (Basic)", languages: "English, Regional Languages", tools: "JIRA, Confluence, Trello", other: "GTM Strategy, Stakeholder Management, Agile" },
        objective: "Analytical Business Analyst focused on bridging the technical-business gap through clear requirement gathering and efficient project roadmap management."
    },
    // Sales Family
    'Business Development': {
        skills: { frontend: "None", backend: "None", database: "None", languages: "English (Expert)", tools: "LinkedIn Sales Navigator, CRM", other: "Lead Generation, Strategy, Cold Outreach, Partnerships" },
        objective: "Strategic Business Development professional with a track record of driving organizational growth through proactive lead generation and strategic partnership alliances."
    },
    'Sales Executive': {
        skills: { frontend: "None", backend: "None", database: "None", languages: "English, Marathi, Hindi", tools: "Pipedrive, Outreach", other: "Negotiation, B2B Sales, Closing, Target Management" },
        objective: "Dynamic Sales Executive focused on closing high-value B2B deals and managing long-term client relationships. Exceeding revenue targets through result-oriented negotiation."
    },
    'Marketing Specialist': {
        skills: { frontend: "None", backend: "None", database: "None", languages: "English", tools: "Google Analytics, SEO Tools, Canva", other: "Content Strategy, Campaigns, Social Media ADS, Branding" },
        objective: "Marketing Specialist dedicated to driving brand awareness and user engagement through data-driven digital campaigns and sophisticated content strategies."
    }
};

const optimizeResume = (analysis, targetRole, jd = '') => {
    const { score = 65, extractedText = "" } = analysis;
    const details = extractPersonalDetails(extractedText);
    
    const roleOptimizations = {
        'Frontend': {
            objective: "Expert Frontend Engineer with 7+ years of experience specializing in high-performance, scalable React architectures and modern UI/UX ecosystems. Proven track record of optimizing Core Web Vitals and achieving a 40% reduction in TTI.",
            skills: { frontend: "React 18+, TypeScript, Next.js, Tailwind CSS", backend: "Node.js (SSR), GraphQL, RESTful APIs", database: "Firebase, PostgreSQL, Redis Caching", languages: "JavaScript (ESNext), TypeScript, Java", tools: "Redux Toolkit, Jest, React Testing Library, Git", other: "Performance Optimization, Design Systems (Storybook), CI/CD" },
            project: { title: "Senior Frontend Lead at Fortune 500 Bank", points: ["Engineered a high-performance design system with Storybook, reducing UI development time by 35%.", "Architected a scalable Mikro-Frontend architecture using Webpack Module Federation.", "Optimized LCP and CLS scores from 4.2s to 1.1s, resulting in 22% increase in engagement.", "Mentored 15+ junior developers through code reviews and workshops."] }
        },
        'Backend': {
            objective: "Senior Backend Architect with 8+ years of expertise in designing distributed systems and microservices using Python and Go. Expert in cloud-native infrastructure and high-availability database design.",
            skills: { frontend: "API Design (OpenAPI), GraphQL Schema", backend: "Python (FastAPI/Django), Go, Node.js, Microservices", infrastructure: "AWS (EC2, Lambda, S3), Docker, Kubernetes", database: "PostgreSQL, MongoDB Core, Redis Cluster", languages: "Python, Go, SQL, Bash Scripting", tools: "Terraform (IaC), Jenkins, GitHub Actions, Datadog", other: "Distributed Systems, Security (OAuth2/JWT), Scalability" },
            project: { title: "Lead Backend Architect at Global Fintech Corp", points: ["Redesigned monolithic core into Go microservices, reducing latency by 65%.", "Orchestrated zero-downtime migration of 50TB+ data to sharded PostgreSQL.", "Implemented global caching with Redis, reducing DB load by 40%.", "Led security auditing implementing strict OAuth2 and mutual TLS protocols."] }
        },
        'Fullstack': {
            objective: "Dynamic Fullstack Engineer with expertise in building E2E web applications using the T3/MERN stack. Expert in bridging the gap between sophisticated UI/UX and robust server-side logic.",
            skills: { frontend: "React, Next.js, Framer Motion, Tailwind", backend: "Node.js, Express, tRPC, Prisma ORM", database: "PostgreSQL, MongoDB, Supabase", languages: "TypeScript (Expert), JavaScript, SQL", tools: "Docker, Vercel, Git, Jest, Cypress", other: "E2E Testing, SaaS Architecture, Agile Methodologies" },
            project: { title: "Fullstack Product Engineer at TechFlow SaaS", points: ["Developed core SaaS features using Next.js Server Components and tRPC.", "Integrated Stripe for subscription management, increasing ARR by 18%.", "Architected real-time collaboration with Socket.io for 50+ concurrent users.", "Maintained 95%+ unit and integration test coverage."] }
        },
        'BDA': {
            objective: "Business Development Associate with expertise in creating networks and growing customer base. Adept at implementing effective business practices and leading high-impact campaigns.",
            skills: { frontend: "Social Media Management", backend: "Market Strategy, Research", database: "Salesforce, CRM Tools", languages: "English", tools: "Microsoft Office Suite, Google Analytics", other: "Lead Generation, Strategy, Partnerships" },
            project: { title: "Business Development Associate at Resume Worded", points: ["Managed multi-channel social accounts, boosting client base by 35%.", "Attended referral group meetings, boosting revenue by 15% through partnerships.", "Spearheaded renewal campaigns, yielding a 65% increase in annual revenue.", "Executed 5 new customer campaigns, increasing business by 30%."] }
        },
        'Sales': {
            objective: "Forward-thinking salesperson with 5+ years of experience and over $2M in sales. Expert in empathy-driven sales strategies and high-level negotiation.",
            skills: { frontend: "Presentation Delivery", backend: "Lead Generation, Reporting", database: "Salesforce CRM", languages: "English", tools: "Microsoft Office, Google Analytics", other: "Negotiation, Results-oriented, Empathy-driven Sales" },
            project: { title: "Lead Sales Specialist at Humana", points: ["Delivered presentations leading to a 27% improvement in lead conversion.", "Recruited staff for national training, resulting in $285k in revenue.", "Executed outbound strategy to warm leads, achieving 26% close rate.", "Worked with existing customers, resulting in $400k retention revenue."] }
        }
    };

    const isSub = subRoleMapping[targetRole];
    const opt = isSub ? isSub : (roleOptimizations[targetRole] || roleOptimizations['Fullstack']);
    
    // Parent Dept Logic
    let parentDept = 'Fullstack';
    const norm = (targetRole || 'Fullstack').toLowerCase();
    if (norm.includes('frontend') || norm.includes('ui') || norm.includes('ux')) parentDept = 'Frontend';
    else if (norm.includes('backend') || norm.includes('node') || norm.includes('python')) parentDept = 'Backend';
    else if (norm.includes('data') || norm.includes('analyst')) parentDept = 'BDA';
    else if (norm.includes('sales') || norm.includes('business')) parentDept = 'Sales';

    const domainSkills = {};
    const categories = ["Core Knowledge", "Frameworks & Logic", "Data & Infrastructure", "Languages", "Tools", "Expertise"];
    const skillKeys = ['frontend', 'backend', 'database', 'languages', 'tools', 'other'];
    categories.forEach((cat, index) => { domainSkills[cat] = opt.skills[skillKeys[index]] || "Industry Proficiency"; });

    const structuredData = {
        name: details.name,
        contact: { location: details.location, phone: details.phone, email: details.email },
        department: parentDept,
        objective: opt.objective,
        education: [{ degree: details.education, institution: details.institution, tenure: "Graduated with Honors", grade: "Distinction" }],
        skills: domainSkills,
        projects: [{ title: roleOptimizations[parentDept]?.project?.title || "Strategic Delivery", points: roleOptimizations[parentDept]?.project?.points || ["Led E2E design and implementation", "Drove performance improvements", "Maintained industry standards"] }],
        training: ["Executive Leadership Program", "Certified Expert Training"],
        personalDetails: { dob: details.dob, gender: details.gender, nationality: details.nationality }
    };

    return {
        improvedResume: `# ${details.name}\n${opt.objective}`,
        structuredData,
        changesMade: ["Targeted career objective updated", "Injected role-specific technical keywords", "Standardized professional formatting"],
        targetScore: Math.min(score + 30, 98),
        targetMatch: 98
    };
};

const generateCareerRoadmap = (analysis, targetRole) => {
    return {
        skillsToLearn: ["Master Advanced " + targetRole + " Patterns", "Earn AWS Cloud Certification", "Contribute to Open Source Projects"],
        suggestedProjects: ["Build a scalable " + targetRole + " application", "Implement a custom CI/CD pipeline"]
    };
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { analysis, role = 'General', jd = '' } = req.body;
    if (!analysis) return res.status(400).json({ error: 'Missing analysis data' });

    const optimization = optimizeResume(analysis, role, jd);
    const roadmap = generateCareerRoadmap(analysis, role);

    return res.status(200).json({ ...optimization, roadmap });
  } catch (error) {
    console.error('Optimization error:', error);
    return res.status(500).json({ error: 'Optimization failed' });
  }
}
