import {
  Sparkles,
  Cloud,
  Cpu,
  Code2,
  Sigma,
  Brain,
  Waves,
  Wand2,
  Languages,
  Eye,
  Rocket,
  MessageSquare,
  LineChart,
  HeartPulse,
  FileText,
  Laptop,
  Users,
  HelpCircle,
  Briefcase,
  Award,
  MonitorPlay,
  UserCheck,
  ClipboardCheck,
  MessagesSquare,
  FolderKanban,
  BadgeCheck,
  Server,
  Container,
  Layers,
  ShieldCheck,
  Activity,
  Globe,
  GitBranch,
  Boxes,
  Terminal,
  Gauge,
  Workflow,
  Database,
  PenTool,
  Megaphone,
  BarChart3,
  Target,
} from "lucide-react";
import type { ProgramDetail } from "@/types";

const commonWhyChoose = [
  { icon: MonitorPlay, label: "Live Interactive Classes" },
  { icon: UserCheck, label: "Industry Mentors" },
  { icon: Code2, label: "Hands-on Practice" },
  { icon: FolderKanban, label: "2 Live Projects" },
  { icon: MessagesSquare, label: "Doubt Support" },
  { icon: FileText, label: "Resume Building" },
  { icon: Users, label: "Mock Interviews" },
  { icon: ClipboardCheck, label: "Placement Assistance" },
  { icon: Briefcase, label: "Career Guidance" },
  { icon: Award, label: "NextPeer Certification" },
];

const commonJourney = [
  { number: 1, label: "Enroll", icon: BadgeCheck },
  { number: 2, label: "Live Classes", icon: MonitorPlay },
  { number: 3, label: "Practice", icon: Code2 },
  { number: 4, label: "Assignments", icon: ClipboardCheck },
  { number: 5, label: "Projects", icon: FolderKanban },
  { number: 6, label: "Portfolio", icon: Briefcase },
  { number: 7, label: "Placement Support", icon: UserCheck },
  { number: 8, label: "Certification", icon: Award },
];

const commonSalaryRows = [
  { experience: "Entry Level", salary: "Varies by role & company" },
  { experience: "1 – 3 Years", salary: "Depends on skills & experience" },
  { experience: "3 – 5 Years", salary: "Depends on role & specialization" },
  { experience: "Experienced", salary: "Depends on company & responsibilities" },
];

export const PROGRAM_DETAILS: Record<string, ProgramDetail> = {
  "artificial-intelligence-essentials": {
    slug: "artificial-intelligence-essentials",
    tagline: "Build Practical AI Skills",
    titleLine1: "Artificial Intelligence",
    heroInitials: "AI",
    titleLine2: "Course for College Students",
    description: "Learn Artificial Intelligence through live classes, hands-on practice and practical projects covering Python, Machine Learning, Deep Learning, NLP and Generative AI.",
    heroBadges: [
      { icon: Code2, label: "Python", key: "python" },
      { icon: Sigma, label: "TensorFlow", key: "tensorflow" },
      { icon: Sparkles, label: "Generative AI" },
      { icon: Brain, label: "Machine Learning" },
    ],
    quickHighlights: ["Live Online Training", "Industry Mentors", "Hands-on Practice", "2 Live Projects", "Placement Assistance", "NextPeer Certificate"],
    whyLearnTitle: "Why Learn Artificial Intelligence?",
    whyLearnDescription: "Artificial Intelligence combines programming, data and machine learning to build systems that can automate tasks, identify patterns and create intelligent applications.",
    whyLearnStats: [
      { icon: Code2, value: "Python", label: "Programming Foundation" },
      { icon: Brain, value: "ML", label: "Machine Learning Skills" },
      { icon: Waves, value: "Deep Learning", label: "Neural Network Concepts" },
      { icon: Sparkles, value: "GenAI", label: "Modern AI Applications" },
    ],
    curriculum: [
      { number: "01", icon: Code2, title: "Python Programming", topics: ["Python Basics", "Functions", "OOP", "NumPy", "Pandas", "Data Handling"] },
      { number: "02", icon: Sigma, title: "Mathematics for AI", topics: ["Linear Algebra", "Probability", "Statistics", "Calculus Basics"] },
      { number: "03", icon: Brain, title: "Machine Learning", topics: ["Regression", "Classification", "Decision Trees", "Random Forest", "Clustering", "Model Evaluation"] },
      { number: "04", icon: Waves, title: "Deep Learning", topics: ["Neural Networks", "TensorFlow", "Keras", "CNN", "RNN", "LSTM"] },
      { number: "05", icon: Wand2, title: "Generative AI", topics: ["Prompt Engineering", "LLMs", "OpenAI API", "Gemini", "RAG Basics", "AI Applications"] },
      { number: "06", icon: Languages, title: "Natural Language Processing", topics: ["Text Processing", "Sentiment Analysis", "Chatbots", "Transformers", "Embeddings"] },
      { number: "07", icon: Eye, title: "Computer Vision", topics: ["OpenCV", "Image Processing", "Image Classification", "Object Detection"] },
      { number: "08", icon: Rocket, title: "AI Deployment", topics: ["Flask", "FastAPI", "Streamlit", "Docker Basics", "Deployment"] },
    ],
    projects: [
      { icon: MessageSquare, title: "AI Chatbot" }, { icon: LineChart, title: "Prediction Application" },
      { icon: FileText, title: "Resume Screening Tool" }, { icon: Eye, title: "Image Classification Application" },
      { icon: Languages, title: "Sentiment Analysis Tool" }, { icon: Sparkles, title: "Generative AI Assistant" },
    ],
    tools: [
      { icon: Code2, label: "Python", key: "python" }, { icon: Sigma, label: "TensorFlow", key: "tensorflow" },
      { icon: Brain, label: "PyTorch", key: "pytorch" }, { icon: FileText, label: "Pandas", key: "pandas" },
      { icon: Eye, label: "OpenCV", key: "opencv" }, { icon: Code2, label: "GitHub", key: "github" },
      { icon: Laptop, label: "VS Code", key: "vscode" },
    ],
    careerRoles: [{ label: "AI Engineer" }, { label: "Machine Learning Engineer" }, { label: "NLP Engineer" }, { label: "Data Scientist" }, { label: "Generative AI Developer" }, { label: "AI Developer" }],
    salaryRows: commonSalaryRows,
    whyChoosePoints: commonWhyChoose,
    certificateTitle: "Artificial Intelligence Professional Certificate",
    journeySteps: commonJourney,
    faqs: [
      { question: "Do I need coding experience?", answer: "No. The program starts with Python fundamentals and progresses step by step." },
      { question: "Are the classes live?", answer: "Yes. The program includes instructor-led live classes." },
      { question: "Will I build projects?", answer: "Yes. Practical project work is included as part of the learning journey." },
      { question: "Will I receive a certificate?", answer: "Yes. Students who successfully complete the required training and project criteria receive a NextPeer certificate." },
      { question: "Is placement assistance included?", answer: "The program includes career support such as resume guidance, mock interviews and placement assistance." },
    ],
  },

  "cloud-computing-fundamentals": {
    slug: "cloud-computing-fundamentals",
    tagline: "Build, Deploy and Scale in the Cloud",
    titleLine1: "Cloud Computing",
    heroInitials: "CC",
    titleLine2: "AWS. Azure. DevOps. Deployment.",
    description: "Learn cloud fundamentals through live classes and hands-on labs covering AWS, Azure, containers, DevOps, infrastructure and cloud security.",
    heroBadges: [{ icon: Cloud, label: "AWS", key: "aws" }, { icon: Layers, label: "Azure", key: "azure" }, { icon: Container, label: "Docker", key: "docker" }, { icon: Boxes, label: "Kubernetes", key: "kubernetes" }],
    quickHighlights: ["Live Online Training", "Hands-on Labs", "Cloud Projects", "Industry Mentors", "Placement Assistance", "NextPeer Certificate"],
    whyLearnTitle: "Why Learn Cloud Computing?",
    whyLearnDescription: "Cloud computing provides the infrastructure used to host, deploy and scale modern applications. Learning cloud concepts also builds foundations for DevOps, infrastructure and platform engineering.",
    whyLearnStats: [{ icon: Cloud, value: "AWS", label: "Cloud Platform Skills" }, { icon: Layers, value: "Azure", label: "Enterprise Cloud Skills" }, { icon: Container, value: "Containers", label: "Modern Deployment" }, { icon: ShieldCheck, value: "Security", label: "Cloud Best Practices" }],
    curriculum: [
      { number: "01", icon: Cloud, title: "Cloud Fundamentals", topics: ["Cloud Concepts", "IaaS", "PaaS", "SaaS", "Deployment Models", "Cloud Economics"] },
      { number: "02", icon: Server, title: "AWS Fundamentals", topics: ["IAM", "EC2", "S3", "VPC", "Route 53", "CloudWatch"] },
      { number: "03", icon: Layers, title: "Microsoft Azure", topics: ["Azure Services", "Virtual Machines", "Storage", "Networking", "Identity"] },
      { number: "04", icon: Globe, title: "Cloud Networking", topics: ["VPC", "Subnets", "DNS", "Load Balancing", "Security Groups"] },
      { number: "05", icon: Workflow, title: "DevOps & CI/CD", topics: ["Git", "GitHub", "CI/CD Concepts", "GitHub Actions", "Automation"] },
      { number: "06", icon: Boxes, title: "Containers", topics: ["Docker", "Images", "Containers", "Docker Compose", "Kubernetes Basics"] },
      { number: "07", icon: Terminal, title: "Infrastructure as Code", topics: ["Terraform Basics", "Resources", "State", "Modules", "Cloud Provisioning"] },
      { number: "08", icon: ShieldCheck, title: "Monitoring & Security", topics: ["IAM", "Monitoring", "Logging", "Cloud Security", "Best Practices"] },
    ],
    projects: [{ icon: Cloud, title: "Deploy a Web Application on AWS" }, { icon: Layers, title: "Azure Cloud Deployment" }, { icon: Workflow, title: "CI/CD Pipeline Project" }, { icon: Terminal, title: "Terraform Infrastructure Project" }, { icon: Container, title: "Dockerized Application" }, { icon: Gauge, title: "Cloud Monitoring Dashboard" }],
    tools: [{ icon: Cloud, label: "AWS", key: "aws" }, { icon: Layers, label: "Azure", key: "azure" }, { icon: Container, label: "Docker", key: "docker" }, { icon: Boxes, label: "Kubernetes", key: "kubernetes" }, { icon: Terminal, label: "Terraform" }, { icon: GitBranch, label: "Git & GitHub" }, { icon: Laptop, label: "VS Code", key: "vscode" }],
    careerRoles: [{ label: "Cloud Engineer" }, { label: "DevOps Engineer" }, { label: "Cloud Administrator" }, { label: "Platform Engineer" }, { label: "Infrastructure Engineer" }, { label: "Junior Cloud Engineer" }],
    salaryRows: commonSalaryRows,
    whyChoosePoints: commonWhyChoose,
    certificateTitle: "Cloud Computing Professional Certificate",
    journeySteps: commonJourney,
    faqs: [
      { question: "Do I need prior cloud experience?", answer: "No. The program starts with cloud fundamentals." },
      { question: "Which cloud platforms are covered?", answer: "The curriculum introduces major cloud concepts with practical exposure to AWS and Azure." },
      { question: "Will I get hands-on practice?", answer: "Yes. Hands-on labs and practical cloud projects are included." },
      { question: "Will I receive a certificate?", answer: "Yes. Successful learners receive a NextPeer certificate after meeting the program requirements." },
    ],
  },

  "full-stack-web-development": {
    slug: "full-stack-web-development",
    tagline: "Build Modern Web Applications",
    titleLine1: "Full Stack Web Development",
    heroInitials: "FS",
    titleLine2: "Frontend. Backend. Database. Deployment.",
    description: "Learn full stack web development through live training, hands-on coding and practical projects using HTML, CSS, JavaScript, React, Node.js, Express and MongoDB.",
    heroBadges: [{ icon: Globe, label: "Web Development" }, { icon: Code2, label: "JavaScript" }, { icon: Layers, label: "React" }, { icon: Server, label: "Node.js" }],
    quickHighlights: ["Live Online Training", "Industry Mentors", "Hands-on Coding", "2 Live Projects", "Placement Assistance", "NextPeer Certificate"],
    whyLearnTitle: "Why Learn Full Stack Development?",
    whyLearnDescription: "Full stack development teaches you how complete web applications work, from responsive user interfaces to APIs, databases and production deployment.",
    whyLearnStats: [{ icon: Globe, value: "Frontend", label: "Build Responsive Interfaces" }, { icon: Server, value: "Backend", label: "Build APIs & Server Logic" }, { icon: Database, value: "Database", label: "Manage Application Data" }, { icon: Rocket, value: "Deploy", label: "Launch Applications Online" }],
    curriculum: [
      { number: "01", icon: Globe, title: "HTML & CSS", topics: ["HTML5", "Semantic HTML", "CSS", "Flexbox", "Grid", "Responsive Design"] },
      { number: "02", icon: Code2, title: "JavaScript", topics: ["Variables", "Functions", "Arrays", "Objects", "DOM", "ES6+"] },
      { number: "03", icon: Layers, title: "React", topics: ["Components", "Props", "State", "Hooks", "Forms", "Routing"] },
      { number: "04", icon: Server, title: "Node.js & Express", topics: ["Node.js", "Express", "REST APIs", "Middleware", "Routing", "Error Handling"] },
      { number: "05", icon: Database, title: "MongoDB", topics: ["Collections", "CRUD", "Mongoose", "Data Modelling", "Queries"] },
      { number: "06", icon: ShieldCheck, title: "Authentication", topics: ["Authentication", "Authorization", "JWT", "Password Hashing", "Protected Routes"] },
      { number: "07", icon: GitBranch, title: "Git & GitHub", topics: ["Version Control", "Repositories", "Branches", "Pull Requests", "Collaboration"] },
      { number: "08", icon: Rocket, title: "Deployment", topics: ["Environment Variables", "Frontend Deployment", "Backend Deployment", "Production Builds"] },
    ],
    projects: [{ icon: Globe, title: "Responsive Portfolio Website" }, { icon: FolderKanban, title: "Full Stack Project Management App" }, { icon: Users, title: "Authentication System" }, { icon: Database, title: "MongoDB CRUD Application" }, { icon: Briefcase, title: "Job Portal Application" }, { icon: Rocket, title: "Production Deployment Project" }],
    tools: [{ icon: Globe, label: "HTML5" }, { icon: Layers, label: "CSS3" }, { icon: Code2, label: "JavaScript" }, { icon: Layers, label: "React" }, { icon: Server, label: "Node.js" }, { icon: Server, label: "Express.js" }, { icon: Database, label: "MongoDB" }, { icon: Code2, label: "GitHub", key: "github" }, { icon: Laptop, label: "VS Code", key: "vscode" }],
    careerRoles: [{ label: "Frontend Developer" }, { label: "Backend Developer" }, { label: "Full Stack Developer" }, { label: "React Developer" }, { label: "Node.js Developer" }, { label: "Web Developer" }],
    salaryRows: commonSalaryRows,
    whyChoosePoints: commonWhyChoose,
    certificateTitle: "Full Stack Web Development Professional Certificate",
    journeySteps: commonJourney,
    faqs: [
      { question: "Do I need coding experience?", answer: "No. The program starts with web development fundamentals." },
      { question: "Will I build projects?", answer: "Yes. Practical project work is included." },
      { question: "Which technologies are covered?", answer: "The curriculum covers HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, Git and deployment." },
      { question: "Will I receive a certificate?", answer: "Yes. Students who meet the completion criteria receive a NextPeer certificate." },
    ],
  },

  "python-for-beginners-to-advanced": {
    slug: "python-for-beginners-to-advanced",
    tagline: "Master Python from Fundamentals to Advanced",
    titleLine1: "Python Programming",
    heroInitials: "PY",
    titleLine2: "Learn. Code. Build Real Projects.",
    description: "Learn Python through live classes, coding practice and practical projects, progressing from programming fundamentals to OOP, APIs, databases and automation.",
    heroBadges: [{ icon: Code2, label: "Python", key: "python" }, { icon: Terminal, label: "Programming" }, { icon: Database, label: "Databases" }, { icon: GitBranch, label: "Git & GitHub" }],
    quickHighlights: ["Live Online Training", "Beginner Friendly", "Hands-on Coding", "2 Live Projects", "Placement Assistance", "NextPeer Certificate"],
    whyLearnTitle: "Why Learn Python?",
    whyLearnDescription: "Python is a versatile programming language used in software development, automation, data analytics, artificial intelligence and machine learning.",
    whyLearnStats: [{ icon: Code2, value: "Beginner", label: "Friendly Programming Syntax" }, { icon: Brain, value: "Versatile", label: "Used Across Technology Fields" }, { icon: Database, value: "Practical", label: "Work with Data & APIs" }, { icon: Rocket, value: "Projects", label: "Build Python Applications" }],
    curriculum: [
      { number: "01", icon: Code2, title: "Python Fundamentals", topics: ["Setup", "Variables", "Data Types", "Operators", "Input", "Output"] },
      { number: "02", icon: Terminal, title: "Programming Logic", topics: ["Conditions", "For Loops", "While Loops", "Break", "Continue", "Problem Solving"] },
      { number: "03", icon: Layers, title: "Data Structures", topics: ["Lists", "Tuples", "Sets", "Dictionaries", "Comprehensions"] },
      { number: "04", icon: Code2, title: "Functions & Modules", topics: ["Functions", "Arguments", "Return Values", "Lambda", "Modules", "Packages"] },
      { number: "05", icon: Layers, title: "Object-Oriented Programming", topics: ["Classes", "Objects", "Inheritance", "Encapsulation", "Polymorphism"] },
      { number: "06", icon: FileText, title: "Files & Exceptions", topics: ["Files", "CSV", "JSON", "Exceptions", "Error Handling"] },
      { number: "07", icon: Database, title: "Databases & APIs", topics: ["SQL Basics", "Database Connections", "CRUD", "REST APIs", "JSON APIs"] },
      { number: "08", icon: Rocket, title: "Automation & Projects", topics: ["Virtual Environments", "Packages", "Automation", "API Integration", "Git & GitHub"] },
    ],
    projects: [{ icon: Code2, title: "Python Calculator" }, { icon: FolderKanban, title: "Student Management System" }, { icon: Database, title: "Python Database Application" }, { icon: Globe, title: "API-Based Application" }, { icon: Terminal, title: "Automation Script" }, { icon: Rocket, title: "Python Capstone Project" }],
    tools: [{ icon: Code2, label: "Python", key: "python" }, { icon: Laptop, label: "VS Code", key: "vscode" }, { icon: FileText, label: "Jupyter Notebook" }, { icon: Database, label: "SQL" }, { icon: Globe, label: "REST APIs" }, { icon: Code2, label: "GitHub", key: "github" }],
    careerRoles: [{ label: "Python Developer" }, { label: "Junior Software Developer" }, { label: "Backend Developer" }, { label: "Automation Developer" }, { label: "Python Intern" }, { label: "Junior Backend Engineer" }],
    salaryRows: commonSalaryRows,
    whyChoosePoints: commonWhyChoose,
    certificateTitle: "Python Programming Professional Certificate",
    journeySteps: commonJourney,
    faqs: [
      { question: "Do I need programming experience?", answer: "No. This program starts with Python fundamentals." },
      { question: "Does it cover advanced Python?", answer: "The curriculum progresses from fundamentals through OOP, databases, APIs, automation and projects." },
      { question: "Will I build projects?", answer: "Yes. Practical coding and project work are included." },
      { question: "Will I receive a certificate?", answer: "Yes. Students who meet the completion criteria receive a NextPeer certificate." },
    ],
  },

  "data-analytics-excel-power-bi": {
    slug: "data-analytics-excel-power-bi",
    tagline: "Turn Data into Business Insights",
    titleLine1: "Data Analytics",
    heroInitials: "DA",
    titleLine2: "Excel. SQL. Power BI. Insights.",
    description: "Learn practical data analytics through live classes and projects using Excel, SQL and Power BI to clean, analyse, visualise and communicate data.",
    heroBadges: [{ icon: BarChart3, label: "Data Analytics" }, { icon: FileText, label: "Excel" }, { icon: Database, label: "SQL" }, { icon: LineChart, label: "Power BI" }],
    quickHighlights: ["Live Online Training", "Business Case Studies", "Dashboard Projects", "2 Live Projects", "Placement Assistance", "NextPeer Certificate"],
    whyLearnTitle: "Why Learn Data Analytics?",
    whyLearnDescription: "Data analytics helps organisations understand performance, identify patterns and make informed decisions using structured data, dashboards and business metrics.",
    whyLearnStats: [{ icon: FileText, value: "Excel", label: "Data Cleaning & Analysis" }, { icon: Database, value: "SQL", label: "Query Structured Data" }, { icon: LineChart, value: "Power BI", label: "Build Interactive Dashboards" }, { icon: Target, value: "Insights", label: "Support Business Decisions" }],
    curriculum: [
      { number: "01", icon: BarChart3, title: "Analytics Fundamentals", topics: ["Data Types", "Business Questions", "KPIs", "Analytics Workflow", "Data Quality"] },
      { number: "02", icon: FileText, title: "Excel Fundamentals", topics: ["Formulas", "Functions", "Tables", "Sorting", "Filtering", "Data Cleaning"] },
      { number: "03", icon: FileText, title: "Advanced Excel", topics: ["Lookup Functions", "Pivot Tables", "Charts", "Conditional Logic", "Dashboards"] },
      { number: "04", icon: Database, title: "SQL for Analytics", topics: ["SELECT", "WHERE", "GROUP BY", "JOINs", "Subqueries", "Aggregations"] },
      { number: "05", icon: LineChart, title: "Power BI Fundamentals", topics: ["Power Query", "Data Model", "Visuals", "Filters", "Reports"] },
      { number: "06", icon: Sigma, title: "DAX & Data Modelling", topics: ["Measures", "Calculated Columns", "Relationships", "DAX Basics", "Time Intelligence"] },
      { number: "07", icon: Target, title: "Business Analytics", topics: ["Sales Analytics", "Marketing Analytics", "Customer Analysis", "KPI Design", "Storytelling"] },
      { number: "08", icon: Rocket, title: "Portfolio Projects", topics: ["Dashboard Planning", "Data Cleaning", "Analysis", "Presentation", "Publishing"] },
    ],
    projects: [{ icon: LineChart, title: "Sales Performance Dashboard" }, { icon: Users, title: "Customer Analytics Dashboard" }, { icon: Briefcase, title: "Business KPI Report" }, { icon: Database, title: "SQL Analytics Case Study" }, { icon: FileText, title: "Excel Analytics Project" }, { icon: Rocket, title: "Power BI Capstone Dashboard" }],
    tools: [{ icon: FileText, label: "Microsoft Excel" }, { icon: Database, label: "SQL" }, { icon: LineChart, label: "Power BI" }, { icon: Sigma, label: "DAX" }, { icon: Database, label: "Power Query" }],
    careerRoles: [{ label: "Data Analyst" }, { label: "Business Analyst" }, { label: "Reporting Analyst" }, { label: "BI Analyst" }, { label: "MIS Analyst" }, { label: "Junior Data Analyst" }],
    salaryRows: commonSalaryRows,
    whyChoosePoints: commonWhyChoose,
    certificateTitle: "Data Analytics with Excel & Power BI Professional Certificate",
    journeySteps: commonJourney,
    faqs: [
      { question: "Is this program beginner friendly?", answer: "Yes. It starts with analytics and spreadsheet fundamentals." },
      { question: "Will I learn SQL?", answer: "Yes. SQL for querying and analysing structured data is included." },
      { question: "Will I build Power BI dashboards?", answer: "Yes. Dashboard design and practical Power BI projects are included." },
      { question: "Will I receive a certificate?", answer: "Yes. Successful learners receive a NextPeer certificate after meeting the completion requirements." },
    ],
  },

  "machine-learning-with-python": {
    slug: "machine-learning-with-python",
    tagline: "Build Intelligent Models with Python",
    titleLine1: "Machine Learning",
    heroInitials: "ML",
    titleLine2: "Python. Models. Data. Deployment.",
    description: "Learn machine learning with Python through live classes, hands-on exercises and projects covering data preparation, supervised learning, unsupervised learning and model evaluation.",
    heroBadges: [{ icon: Code2, label: "Python", key: "python" }, { icon: Brain, label: "Machine Learning" }, { icon: Sigma, label: "Scikit-learn" }, { icon: LineChart, label: "Data" }],
    quickHighlights: ["Live Online Training", "Python Practice", "ML Projects", "2 Live Projects", "Placement Assistance", "NextPeer Certificate"],
    whyLearnTitle: "Why Learn Machine Learning?",
    whyLearnDescription: "Machine learning provides techniques for finding patterns in data and building models that can classify, predict and support automated decision-making.",
    whyLearnStats: [{ icon: Code2, value: "Python", label: "Programming for ML" }, { icon: Brain, value: "Models", label: "Supervised & Unsupervised Learning" }, { icon: LineChart, value: "Data", label: "Prepare & Evaluate Datasets" }, { icon: Rocket, value: "Deploy", label: "Turn Models into Applications" }],
    curriculum: [
      { number: "01", icon: Code2, title: "Python for ML", topics: ["Python Review", "NumPy", "Pandas", "Matplotlib", "Data Handling"] },
      { number: "02", icon: Sigma, title: "Statistics for ML", topics: ["Descriptive Statistics", "Probability", "Distributions", "Correlation", "Sampling"] },
      { number: "03", icon: LineChart, title: "Data Preparation", topics: ["Cleaning", "Missing Values", "Encoding", "Scaling", "Feature Engineering"] },
      { number: "04", icon: Brain, title: "Regression", topics: ["Linear Regression", "Multiple Regression", "Metrics", "Overfitting", "Regularization Basics"] },
      { number: "05", icon: Target, title: "Classification", topics: ["Logistic Regression", "Decision Trees", "Random Forest", "KNN", "SVM"] },
      { number: "06", icon: Layers, title: "Unsupervised Learning", topics: ["Clustering", "K-Means", "Hierarchical Clustering", "PCA", "Segmentation"] },
      { number: "07", icon: Activity, title: "Model Evaluation", topics: ["Train/Test Split", "Cross Validation", "Confusion Matrix", "Precision", "Recall", "F1"] },
      { number: "08", icon: Rocket, title: "ML Projects & Deployment", topics: ["Pipelines", "Model Saving", "Streamlit", "API Basics", "Deployment"] },
    ],
    projects: [{ icon: LineChart, title: "House Price Prediction" }, { icon: Users, title: "Customer Churn Prediction" }, { icon: Target, title: "Customer Segmentation" }, { icon: HeartPulse, title: "Classification Case Study" }, { icon: FileText, title: "Text Classification Project" }, { icon: Rocket, title: "Deployed ML Application" }],
    tools: [{ icon: Code2, label: "Python", key: "python" }, { icon: Sigma, label: "Scikit-learn" }, { icon: FileText, label: "Pandas", key: "pandas" }, { icon: Sigma, label: "NumPy" }, { icon: FileText, label: "Jupyter Notebook" }, { icon: Code2, label: "GitHub", key: "github" }],
    careerRoles: [{ label: "Machine Learning Intern" }, { label: "Junior ML Engineer" }, { label: "Data Science Intern" }, { label: "Data Analyst" }, { label: "AI/ML Developer" }, { label: "Junior Data Scientist" }],
    salaryRows: commonSalaryRows,
    whyChoosePoints: commonWhyChoose,
    certificateTitle: "Machine Learning with Python Professional Certificate",
    journeySteps: commonJourney,
    faqs: [
      { question: "Do I need Python knowledge?", answer: "Basic Python is helpful, but the program includes a Python review before machine learning topics." },
      { question: "Will I build ML models?", answer: "Yes. You will practice building, evaluating and using machine learning models." },
      { question: "Does the program include projects?", answer: "Yes. Practical machine learning projects are included." },
      { question: "Will I receive a certificate?", answer: "Yes. Successful learners receive a NextPeer certificate after meeting the completion criteria." },
    ],
  },

  "ui-ux-design-fundamentals": {
    slug: "ui-ux-design-fundamentals",
    tagline: "Design Better Digital Experiences",
    titleLine1: "UI/UX Design",
    heroInitials: "UX",
    titleLine2: "Research. Design. Prototype. Test.",
    description: "Learn UI/UX design through live classes and practical projects covering user research, wireframing, visual design, prototyping, usability and portfolio development.",
    heroBadges: [{ icon: PenTool, label: "UI Design" }, { icon: Users, label: "UX Research" }, { icon: Layers, label: "Wireframes" }, { icon: Eye, label: "Prototyping" }],
    quickHighlights: ["Live Online Training", "Design Practice", "Portfolio Projects", "2 Live Projects", "Placement Assistance", "NextPeer Certificate"],
    whyLearnTitle: "Why Learn UI/UX Design?",
    whyLearnDescription: "UI/UX design focuses on understanding users and creating digital products that are clear, useful and visually consistent.",
    whyLearnStats: [{ icon: Users, value: "Research", label: "Understand User Needs" }, { icon: Layers, value: "Wireframe", label: "Plan Product Structure" }, { icon: PenTool, value: "Design", label: "Create Visual Interfaces" }, { icon: Eye, value: "Test", label: "Improve User Experience" }],
    curriculum: [
      { number: "01", icon: Users, title: "UX Fundamentals", topics: ["UX Principles", "Design Process", "User-Centred Design", "Problem Definition"] },
      { number: "02", icon: FileText, title: "User Research", topics: ["Research Methods", "Interviews", "Surveys", "Personas", "User Needs"] },
      { number: "03", icon: Layers, title: "Information Architecture", topics: ["User Flows", "Sitemaps", "Navigation", "Content Hierarchy", "Task Flows"] },
      { number: "04", icon: PenTool, title: "Wireframing", topics: ["Low-Fidelity Design", "Layouts", "Components", "Mobile Design", "Web Design"] },
      { number: "05", icon: Eye, title: "UI Design", topics: ["Typography", "Colour", "Spacing", "Visual Hierarchy", "Design Systems"] },
      { number: "06", icon: Rocket, title: "Prototyping", topics: ["Interactive Prototypes", "Transitions", "Components", "Prototype Testing"] },
      { number: "07", icon: UserCheck, title: "Usability Testing", topics: ["Testing Plans", "User Feedback", "Design Iteration", "Accessibility Basics"] },
      { number: "08", icon: Briefcase, title: "Portfolio & Case Study", topics: ["Case Study Structure", "Process Documentation", "Presentation", "Portfolio Review"] },
    ],
    projects: [{ icon: PenTool, title: "Mobile App Redesign" }, { icon: Globe, title: "Responsive Website Design" }, { icon: Users, title: "User Research Case Study" }, { icon: Layers, title: "Wireframe & User Flow Project" }, { icon: Eye, title: "Interactive Prototype" }, { icon: Briefcase, title: "UI/UX Portfolio Case Study" }],
    tools: [{ icon: PenTool, label: "Figma" }, { icon: Layers, label: "Wireframing" }, { icon: Eye, label: "Prototyping" }, { icon: Users, label: "User Research" }, { icon: FileText, label: "Case Studies" }],
    careerRoles: [{ label: "UI Designer" }, { label: "UX Designer" }, { label: "Product Design Intern" }, { label: "UI/UX Designer" }, { label: "UX Research Intern" }, { label: "Junior Product Designer" }],
    salaryRows: commonSalaryRows,
    whyChoosePoints: commonWhyChoose,
    certificateTitle: "UI/UX Design Fundamentals Professional Certificate",
    journeySteps: commonJourney,
    faqs: [
      { question: "Do I need design experience?", answer: "No. The program starts with UI/UX fundamentals." },
      { question: "Will I create a portfolio?", answer: "Yes. Practical projects and case-study development are included." },
      { question: "Will I learn prototyping?", answer: "Yes. Wireframing and interactive prototyping are part of the curriculum." },
      { question: "Will I receive a certificate?", answer: "Yes. Successful learners receive a NextPeer certificate." },
    ],
  },

  "digital-marketing-essentials": {
    slug: "digital-marketing-essentials",
    tagline: "Build Skills for Modern Digital Marketing",
    titleLine1: "Digital Marketing",
    heroInitials: "DM",
    titleLine2: "SEO. Content. Social. Performance.",
    description: "Learn digital marketing through live classes and practical campaigns covering SEO, content marketing, social media, paid advertising, analytics and campaign strategy.",
    heroBadges: [{ icon: Megaphone, label: "Marketing" }, { icon: Globe, label: "SEO" }, { icon: Users, label: "Social Media" }, { icon: LineChart, label: "Analytics" }],
    quickHighlights: ["Live Online Training", "Campaign Practice", "Marketing Projects", "2 Live Projects", "Placement Assistance", "NextPeer Certificate"],
    whyLearnTitle: "Why Learn Digital Marketing?",
    whyLearnDescription: "Digital marketing helps businesses reach, engage and convert audiences through search engines, content, social platforms, advertising and measurable campaigns.",
    whyLearnStats: [{ icon: Globe, value: "SEO", label: "Improve Search Visibility" }, { icon: Users, value: "Social", label: "Build Audience Engagement" }, { icon: Megaphone, value: "Ads", label: "Run Performance Campaigns" }, { icon: LineChart, value: "Analytics", label: "Measure Marketing Results" }],
    curriculum: [
      { number: "01", icon: Megaphone, title: "Digital Marketing Fundamentals", topics: ["Marketing Funnel", "Audience", "Positioning", "Channels", "Campaign Planning"] },
      { number: "02", icon: Globe, title: "SEO Fundamentals", topics: ["Keywords", "On-Page SEO", "Technical Basics", "Content SEO", "Link Building Basics"] },
      { number: "03", icon: FileText, title: "Content Marketing", topics: ["Content Strategy", "Copywriting", "Blogs", "Content Calendar", "Calls to Action"] },
      { number: "04", icon: Users, title: "Social Media Marketing", topics: ["Platform Strategy", "Content Planning", "Community", "Organic Growth", "Metrics"] },
      { number: "05", icon: Target, title: "Paid Advertising", topics: ["Campaign Objectives", "Audience Targeting", "Ad Creative", "Budgeting", "Optimization"] },
      { number: "06", icon: LineChart, title: "Marketing Analytics", topics: ["Traffic", "Conversions", "UTM Tracking", "Campaign Metrics", "Reporting"] },
      { number: "07", icon: MessageSquare, title: "Email & Lead Marketing", topics: ["Lead Funnels", "Email Campaigns", "Segmentation", "Nurturing", "Landing Pages"] },
      { number: "08", icon: Rocket, title: "Campaign Project", topics: ["Strategy", "Execution", "Measurement", "Optimization", "Presentation"] },
    ],
    projects: [{ icon: Globe, title: "SEO Audit Project" }, { icon: FileText, title: "Content Marketing Plan" }, { icon: Users, title: "Social Media Campaign" }, { icon: Target, title: "Paid Campaign Strategy" }, { icon: LineChart, title: "Marketing Analytics Dashboard" }, { icon: Rocket, title: "Integrated Digital Campaign" }],
    tools: [{ icon: Globe, label: "SEO Tools" }, { icon: LineChart, label: "Google Analytics" }, { icon: Target, label: "Google Ads" }, { icon: Users, label: "Social Media Platforms" }, { icon: FileText, label: "Content Planning" }],
    careerRoles: [{ label: "Digital Marketing Executive" }, { label: "SEO Executive" }, { label: "Social Media Executive" }, { label: "Content Marketing Executive" }, { label: "Performance Marketing Intern" }, { label: "Marketing Analyst" }],
    salaryRows: commonSalaryRows,
    whyChoosePoints: commonWhyChoose,
    certificateTitle: "Digital Marketing Essentials Professional Certificate",
    journeySteps: commonJourney,
    faqs: [
      { question: "Is this program suitable for beginners?", answer: "Yes. It starts with digital marketing fundamentals." },
      { question: "Will I learn SEO?", answer: "Yes. SEO fundamentals, content SEO and search visibility are included." },
      { question: "Will I work on campaigns?", answer: "Yes. Practical campaign planning and project work are included." },
      { question: "Will I receive a certificate?", answer: "Yes. Successful learners receive a NextPeer certificate." },
    ],
  },
  "data-science": {
  "slug": "data-science",
  "tagline": "Python, Statistics, Machine Learning & Data Visualisation",
  "titleLine1": "Data Science",
  "heroInitials": "DS",
  "titleLine2": "Practical Training for College Students",
  "description": "Learn Data Science through live classes, guided practice and two practical projects covering python, statistics, machine learning & data visualisation.",
  "heroBadges": [
    {
      "icon": BarChart3,
      "label": "Python"
    },
    {
      "icon": BarChart3,
      "label": "Pandas"
    },
    {
      "icon": BarChart3,
      "label": "NumPy"
    },
    {
      "icon": BarChart3,
      "label": "SQL"
    }
  ],
  "quickHighlights": [
    "Live Online Training",
    "Hands-on Practice",
    "2 Live Projects",
    "Career Guidance",
    "NextPeer Certificate"
  ],
  "whyLearnTitle": "Why Learn Data Science?",
  "whyLearnDescription": "Build foundational skills in python, statistics, machine learning & data visualisation and apply them to practical assignments and portfolio projects.",
  "whyLearnStats": [
    {
      "icon": BarChart3,
      "value": "Python & Data Handling",
      "label": "Python Basics & NumPy"
    },
    {
      "icon": BarChart3,
      "value": "Statistics & Exploration",
      "label": "Probability & Descriptive Statistics"
    },
    {
      "icon": BarChart3,
      "value": "SQL & Visualisation",
      "label": "SQL Queries & Joins"
    },
    {
      "icon": BarChart3,
      "value": "Machine Learning",
      "label": "Regression & Classification"
    }
  ],
  "curriculum": [
    {
      "number": "01",
      "icon": BarChart3,
      "title": "Python & Data Handling",
      "topics": [
        "Python Basics",
        "NumPy",
        "Pandas",
        "Data Cleaning"
      ]
    },
    {
      "number": "02",
      "icon": BarChart3,
      "title": "Statistics & Exploration",
      "topics": [
        "Probability",
        "Descriptive Statistics",
        "Hypothesis Testing",
        "Exploratory Data Analysis"
      ]
    },
    {
      "number": "03",
      "icon": BarChart3,
      "title": "SQL & Visualisation",
      "topics": [
        "SQL Queries",
        "Joins",
        "Matplotlib",
        "Seaborn"
      ]
    },
    {
      "number": "04",
      "icon": BarChart3,
      "title": "Machine Learning",
      "topics": [
        "Regression",
        "Classification",
        "Clustering",
        "Model Evaluation"
      ]
    },
    {
      "number": "05",
      "icon": BarChart3,
      "title": "Capstone & Presentation",
      "topics": [
        "Feature Engineering",
        "Model Validation",
        "Streamlit",
        "Communicating Findings"
      ]
    }
  ],
  "projects": [
    {
      "icon": BarChart3,
      "title": "Customer Churn Analysis & Prediction"
    },
    {
      "icon": BarChart3,
      "title": "Sales Data Exploration Dashboard"
    }
  ],
  "tools": [
    {
      "icon": BarChart3,
      "label": "Python"
    },
    {
      "icon": BarChart3,
      "label": "Pandas"
    },
    {
      "icon": BarChart3,
      "label": "NumPy"
    },
    {
      "icon": BarChart3,
      "label": "SQL"
    },
    {
      "icon": BarChart3,
      "label": "Jupyter Notebook"
    },
    {
      "icon": BarChart3,
      "label": "Scikit-learn"
    }
  ],
  "careerRoles": [
    {
      "label": "Data Science Intern"
    },
    {
      "label": "Junior Data Scientist"
    },
    {
      "label": "Data Analyst"
    }
  ],
  "salaryRows": commonSalaryRows,
  "whyChoosePoints": commonWhyChoose,
  "certificateTitle": "Data Science Training & Project Certificate",
  "journeySteps": commonJourney,
  "faqs": [
    {
      "question": "What knowledge or equipment do I need?",
      "answer": "The program starts with Python basics. Comfort with school-level mathematics is helpful."
    },
    {
      "question": "Will I complete practical projects?",
      "answer": "Yes. The program includes guided practice and two practical projects."
    },
    {
      "question": "How do I earn a certificate?",
      "answer": "Complete the required training, assignments and project assessments to receive a NextPeer certificate."
    },
    {
      "question": "Is a job guaranteed?",
      "answer": "Career guidance and placement assistance support your job search. Employment is not guaranteed."
    }
  ]
},

  "vlsi": {
  "slug": "vlsi",
  "tagline": "Digital Logic, Verilog & RTL Design Fundamentals",
  "titleLine1": "VLSI",
  "heroInitials": "VL",
  "titleLine2": "Practical Training for College Students",
  "description": "Learn VLSI through live classes, guided practice and two practical projects covering digital logic, verilog & rtl design fundamentals.",
  "heroBadges": [
    {
      "icon": Cpu,
      "label": "Verilog"
    },
    {
      "icon": Cpu,
      "label": "Icarus Verilog"
    },
    {
      "icon": Cpu,
      "label": "GTKWave"
    },
    {
      "icon": Cpu,
      "label": "Yosys"
    }
  ],
  "quickHighlights": [
    "Live Online Training",
    "Hands-on Practice",
    "2 Live Projects",
    "Career Guidance",
    "NextPeer Certificate"
  ],
  "whyLearnTitle": "Why Learn VLSI?",
  "whyLearnDescription": "Build foundational skills in digital logic, verilog & rtl design fundamentals and apply them to practical assignments and portfolio projects.",
  "whyLearnStats": [
    {
      "icon": Cpu,
      "value": "Digital Electronics",
      "label": "Boolean Algebra & Logic Gates"
    },
    {
      "icon": Cpu,
      "value": "Verilog HDL",
      "label": "Modules & Data Types"
    },
    {
      "icon": Cpu,
      "value": "RTL Design",
      "label": "Finite State Machines & Counters"
    },
    {
      "icon": Cpu,
      "value": "Simulation & Verification",
      "label": "Waveform Analysis & Functional Verification"
    }
  ],
  "curriculum": [
    {
      "number": "01",
      "icon": Cpu,
      "title": "Digital Electronics",
      "topics": [
        "Boolean Algebra",
        "Logic Gates",
        "Combinational Circuits",
        "Sequential Circuits"
      ]
    },
    {
      "number": "02",
      "icon": Cpu,
      "title": "Verilog HDL",
      "topics": [
        "Modules",
        "Data Types",
        "Behavioural Modelling",
        "Testbenches"
      ]
    },
    {
      "number": "03",
      "icon": Cpu,
      "title": "RTL Design",
      "topics": [
        "Finite State Machines",
        "Counters",
        "Registers",
        "Synchronous Design"
      ]
    },
    {
      "number": "04",
      "icon": Cpu,
      "title": "Simulation & Verification",
      "topics": [
        "Waveform Analysis",
        "Functional Verification",
        "Test Cases",
        "Debugging"
      ]
    },
    {
      "number": "05",
      "icon": Cpu,
      "title": "VLSI Design Flow",
      "topics": [
        "Synthesis Concepts",
        "Timing Basics",
        "CMOS Fundamentals",
        "Physical Design Overview"
      ]
    }
  ],
  "projects": [
    {
      "icon": Cpu,
      "title": "Verilog ALU with Testbench"
    },
    {
      "icon": Cpu,
      "title": "FIFO Controller RTL Design"
    }
  ],
  "tools": [
    {
      "icon": Cpu,
      "label": "Verilog"
    },
    {
      "icon": Cpu,
      "label": "Icarus Verilog"
    },
    {
      "icon": Cpu,
      "label": "GTKWave"
    },
    {
      "icon": Cpu,
      "label": "Yosys"
    }
  ],
  "careerRoles": [
    {
      "label": "RTL Design Intern"
    },
    {
      "label": "Verification Intern"
    },
    {
      "label": "Junior Digital Design Engineer"
    }
  ],
  "salaryRows": commonSalaryRows,
  "whyChoosePoints": commonWhyChoose,
  "certificateTitle": "VLSI Training & Project Certificate",
  "journeySteps": commonJourney,
  "faqs": [
    {
      "question": "What knowledge or equipment do I need?",
      "answer": "Basic digital electronics knowledge is recommended. The program reviews logic fundamentals."
    },
    {
      "question": "Will I complete practical projects?",
      "answer": "Yes. The program includes guided practice and two practical projects."
    },
    {
      "question": "How do I earn a certificate?",
      "answer": "Complete the required training, assignments and project assessments to receive a NextPeer certificate."
    },
    {
      "question": "Is a job guaranteed?",
      "answer": "Career guidance and placement assistance support your job search. Employment is not guaranteed."
    }
  ]
},

  "embedded-systems": {
  "slug": "embedded-systems",
  "tagline": "Embedded C, Microcontrollers & Sensor Interfacing",
  "titleLine1": "Embedded Systems",
  "heroInitials": "ES",
  "titleLine2": "Practical Training for College Students",
  "description": "Learn Embedded Systems through live classes, guided practice and two practical projects covering embedded c, microcontrollers & sensor interfacing.",
  "heroBadges": [
    {
      "icon": Cpu,
      "label": "Embedded C"
    },
    {
      "icon": Cpu,
      "label": "Arduino IDE"
    },
    {
      "icon": Cpu,
      "label": "ESP32"
    },
    {
      "icon": Cpu,
      "label": "Serial Monitor"
    }
  ],
  "quickHighlights": [
    "Live Online Training",
    "Hands-on Practice",
    "2 Live Projects",
    "Career Guidance",
    "NextPeer Certificate"
  ],
  "whyLearnTitle": "Why Learn Embedded Systems?",
  "whyLearnDescription": "Build foundational skills in embedded c, microcontrollers & sensor interfacing and apply them to practical assignments and portfolio projects.",
  "whyLearnStats": [
    {
      "icon": Cpu,
      "value": "Embedded C",
      "label": "Data Types & Pointers"
    },
    {
      "icon": Cpu,
      "value": "Microcontroller Fundamentals",
      "label": "Architecture & GPIO"
    },
    {
      "icon": Cpu,
      "value": "Peripheral Interfaces",
      "label": "UART & SPI"
    },
    {
      "icon": Cpu,
      "value": "Sensors & Firmware",
      "label": "Sensor Interfacing & Device Drivers Basics"
    }
  ],
  "curriculum": [
    {
      "number": "01",
      "icon": Cpu,
      "title": "Embedded C",
      "topics": [
        "Data Types",
        "Pointers",
        "Bitwise Operations",
        "Memory Concepts"
      ]
    },
    {
      "number": "02",
      "icon": Cpu,
      "title": "Microcontroller Fundamentals",
      "topics": [
        "Architecture",
        "GPIO",
        "Interrupts",
        "Timers"
      ]
    },
    {
      "number": "03",
      "icon": Cpu,
      "title": "Peripheral Interfaces",
      "topics": [
        "UART",
        "SPI",
        "I2C",
        "ADC & PWM"
      ]
    },
    {
      "number": "04",
      "icon": Cpu,
      "title": "Sensors & Firmware",
      "topics": [
        "Sensor Interfacing",
        "Device Drivers Basics",
        "State Machines",
        "Debugging"
      ]
    },
    {
      "number": "05",
      "icon": Cpu,
      "title": "Connected Systems",
      "topics": [
        "IoT Basics",
        "Communication",
        "Real-Time Concepts",
        "System Integration"
      ]
    }
  ],
  "projects": [
    {
      "icon": Cpu,
      "title": "Sensor-Based Monitoring System"
    },
    {
      "icon": Cpu,
      "title": "Automated Device Controller"
    }
  ],
  "tools": [
    {
      "icon": Cpu,
      "label": "Embedded C"
    },
    {
      "icon": Cpu,
      "label": "Arduino IDE"
    },
    {
      "icon": Cpu,
      "label": "ESP32"
    },
    {
      "icon": Cpu,
      "label": "Serial Monitor"
    }
  ],
  "careerRoles": [
    {
      "label": "Embedded Systems Intern"
    },
    {
      "label": "Firmware Intern"
    },
    {
      "label": "Junior Embedded Developer"
    }
  ],
  "salaryRows": commonSalaryRows,
  "whyChoosePoints": commonWhyChoose,
  "certificateTitle": "Embedded Systems Training & Project Certificate",
  "journeySteps": commonJourney,
  "faqs": [
    {
      "question": "What knowledge or equipment do I need?",
      "answer": "Basic C programming and electronics knowledge is helpful. Hardware exercises require a compatible board and sensors; confirm the kit requirements before enrolling."
    },
    {
      "question": "Will I complete practical projects?",
      "answer": "Yes. The program includes guided practice and two practical projects."
    },
    {
      "question": "How do I earn a certificate?",
      "answer": "Complete the required training, assignments and project assessments to receive a NextPeer certificate."
    },
    {
      "question": "Is a job guaranteed?",
      "answer": "Career guidance and placement assistance support your job search. Employment is not guaranteed."
    }
  ]
},

  "autocad": {
  "slug": "autocad",
  "tagline": "2D Drafting, 3D Modelling & Technical Drawings",
  "titleLine1": "AutoCAD",
  "heroInitials": "AC",
  "titleLine2": "Practical Training for College Students",
  "description": "Learn AutoCAD through live classes, guided practice and two practical projects covering 2d drafting, 3d modelling & technical drawings.",
  "heroBadges": [
    {
      "icon": PenTool,
      "label": "AutoCAD"
    },
    {
      "icon": PenTool,
      "label": "DWG Files"
    },
    {
      "icon": PenTool,
      "label": "Layouts"
    },
    {
      "icon": PenTool,
      "label": "PDF Plotting"
    }
  ],
  "quickHighlights": [
    "Live Online Training",
    "Hands-on Practice",
    "2 Live Projects",
    "Career Guidance",
    "NextPeer Certificate"
  ],
  "whyLearnTitle": "Why Learn AutoCAD?",
  "whyLearnDescription": "Build foundational skills in 2d drafting, 3d modelling & technical drawings and apply them to practical assignments and portfolio projects.",
  "whyLearnStats": [
    {
      "icon": PenTool,
      "value": "Drawing Fundamentals",
      "label": "Workspace & Coordinates"
    },
    {
      "icon": PenTool,
      "value": "Editing & Organisation",
      "label": "Modify Commands & Layers"
    },
    {
      "icon": PenTool,
      "value": "Technical Documentation",
      "label": "Dimensions & Annotations"
    },
    {
      "icon": PenTool,
      "value": "Layouts & Plotting",
      "label": "Layouts & Viewports"
    }
  ],
  "curriculum": [
    {
      "number": "01",
      "icon": PenTool,
      "title": "Drawing Fundamentals",
      "topics": [
        "Workspace",
        "Coordinates",
        "Units",
        "Drawing Commands"
      ]
    },
    {
      "number": "02",
      "icon": PenTool,
      "title": "Editing & Organisation",
      "topics": [
        "Modify Commands",
        "Layers",
        "Blocks",
        "Object Properties"
      ]
    },
    {
      "number": "03",
      "icon": PenTool,
      "title": "Technical Documentation",
      "topics": [
        "Dimensions",
        "Annotations",
        "Hatching",
        "Drawing Standards"
      ]
    },
    {
      "number": "04",
      "icon": PenTool,
      "title": "Layouts & Plotting",
      "topics": [
        "Layouts",
        "Viewports",
        "Scale",
        "PDF Export"
      ]
    },
    {
      "number": "05",
      "icon": PenTool,
      "title": "3D Fundamentals",
      "topics": [
        "Solids",
        "Extrude",
        "Revolve",
        "Views & Presentation"
      ]
    }
  ],
  "projects": [
    {
      "icon": PenTool,
      "title": "Residential Floor Plan & Drawing Set"
    },
    {
      "icon": PenTool,
      "title": "Mechanical Component Drafting Project"
    }
  ],
  "tools": [
    {
      "icon": PenTool,
      "label": "AutoCAD"
    },
    {
      "icon": PenTool,
      "label": "DWG Files"
    },
    {
      "icon": PenTool,
      "label": "Layouts"
    },
    {
      "icon": PenTool,
      "label": "PDF Plotting"
    }
  ],
  "careerRoles": [
    {
      "label": "CAD Drafter"
    },
    {
      "label": "CAD Technician"
    },
    {
      "label": "Junior Design Assistant"
    }
  ],
  "salaryRows": commonSalaryRows,
  "whyChoosePoints": commonWhyChoose,
  "certificateTitle": "AutoCAD Training & Project Certificate",
  "journeySteps": commonJourney,
  "faqs": [
    {
      "question": "What knowledge or equipment do I need?",
      "answer": "No prior CAD experience is required. Access to AutoCAD and a compatible computer is needed; confirm software access before enrolling."
    },
    {
      "question": "Will I complete practical projects?",
      "answer": "Yes. The program includes guided practice and two practical projects."
    },
    {
      "question": "How do I earn a certificate?",
      "answer": "Complete the required training, assignments and project assessments to receive a NextPeer certificate."
    },
    {
      "question": "Is a job guaranteed?",
      "answer": "Career guidance and placement assistance support your job search. Employment is not guaranteed."
    }
  ]
},

  "hr-management": {
  "slug": "hr-management",
  "tagline": "Recruitment, Employee Engagement & HR Operations",
  "titleLine1": "HR Management",
  "heroInitials": "HR",
  "titleLine2": "Practical Training for College Students",
  "description": "Learn HR Management through live classes, guided practice and two practical projects covering recruitment, employee engagement & hr operations.",
  "heroBadges": [
    {
      "icon": Users,
      "label": "Microsoft Excel"
    },
    {
      "icon": Users,
      "label": "HR Dashboards"
    },
    {
      "icon": Users,
      "label": "Recruitment Trackers"
    },
    {
      "icon": Users,
      "label": "HRIS Concepts"
    }
  ],
  "quickHighlights": [
    "Live Online Training",
    "Hands-on Practice",
    "2 Live Projects",
    "Career Guidance",
    "NextPeer Certificate"
  ],
  "whyLearnTitle": "Why Learn HR Management?",
  "whyLearnDescription": "Build foundational skills in recruitment, employee engagement & hr operations and apply them to practical assignments and portfolio projects.",
  "whyLearnStats": [
    {
      "icon": Users,
      "value": "HR Fundamentals",
      "label": "Employee Lifecycle & HR Functions"
    },
    {
      "icon": Users,
      "value": "Recruitment & Selection",
      "label": "Job Descriptions & Sourcing"
    },
    {
      "icon": Users,
      "value": "Onboarding & HR Operations",
      "label": "Onboarding & Employee Records"
    },
    {
      "icon": Users,
      "value": "Performance & Engagement",
      "label": "Goal Setting & Performance Reviews"
    }
  ],
  "curriculum": [
    {
      "number": "01",
      "icon": Users,
      "title": "HR Fundamentals",
      "topics": [
        "Employee Lifecycle",
        "HR Functions",
        "Workforce Planning",
        "HR Ethics"
      ]
    },
    {
      "number": "02",
      "icon": Users,
      "title": "Recruitment & Selection",
      "topics": [
        "Job Descriptions",
        "Sourcing",
        "Screening",
        "Interview Planning"
      ]
    },
    {
      "number": "03",
      "icon": Users,
      "title": "Onboarding & HR Operations",
      "topics": [
        "Onboarding",
        "Employee Records",
        "Payroll Concepts",
        "Policy Documentation"
      ]
    },
    {
      "number": "04",
      "icon": Users,
      "title": "Performance & Engagement",
      "topics": [
        "Goal Setting",
        "Performance Reviews",
        "Learning & Development",
        "Employee Engagement"
      ]
    },
    {
      "number": "05",
      "icon": Users,
      "title": "HR Analytics & Practice",
      "topics": [
        "HR Metrics",
        "Excel Reporting",
        "Case Studies",
        "HR Project Presentation"
      ]
    }
  ],
  "projects": [
    {
      "icon": Users,
      "title": "Recruitment & Onboarding Toolkit"
    },
    {
      "icon": Users,
      "title": "Employee Engagement & HR Metrics Dashboard"
    }
  ],
  "tools": [
    {
      "icon": Users,
      "label": "Microsoft Excel"
    },
    {
      "icon": Users,
      "label": "HR Dashboards"
    },
    {
      "icon": Users,
      "label": "Recruitment Trackers"
    },
    {
      "icon": Users,
      "label": "HRIS Concepts"
    }
  ],
  "careerRoles": [
    {
      "label": "HR Intern"
    },
    {
      "label": "HR Executive"
    },
    {
      "label": "Recruitment Coordinator"
    }
  ],
  "salaryRows": commonSalaryRows,
  "whyChoosePoints": commonWhyChoose,
  "certificateTitle": "HR Management Training & Project Certificate",
  "journeySteps": commonJourney,
  "faqs": [
    {
      "question": "What knowledge or equipment do I need?",
      "answer": "No prior HR experience is required. Suitable for students interested in people management and business operations."
    },
    {
      "question": "Will I complete practical projects?",
      "answer": "Yes. The program includes guided practice and two practical projects."
    },
    {
      "question": "How do I earn a certificate?",
      "answer": "Complete the required training, assignments and project assessments to receive a NextPeer certificate."
    },
    {
      "question": "Is a job guaranteed?",
      "answer": "Career guidance and placement assistance support your job search. Employment is not guaranteed."
    }
  ]
},

  "business-analytics": {
  "slug": "business-analytics",
  "tagline": "Excel, SQL, Power BI & Business Decision-Making",
  "titleLine1": "Business Analytics",
  "heroInitials": "BA",
  "titleLine2": "Practical Training for College Students",
  "description": "Learn Business Analytics through live classes, guided practice and two practical projects covering excel, sql, power bi & business decision-making.",
  "heroBadges": [
    {
      "icon": LineChart,
      "label": "Microsoft Excel"
    },
    {
      "icon": LineChart,
      "label": "SQL"
    },
    {
      "icon": LineChart,
      "label": "Power BI"
    },
    {
      "icon": LineChart,
      "label": "Power Query"
    }
  ],
  "quickHighlights": [
    "Live Online Training",
    "Hands-on Practice",
    "2 Live Projects",
    "Career Guidance",
    "NextPeer Certificate"
  ],
  "whyLearnTitle": "Why Learn Business Analytics?",
  "whyLearnDescription": "Build foundational skills in excel, sql, power bi & business decision-making and apply them to practical assignments and portfolio projects.",
  "whyLearnStats": [
    {
      "icon": LineChart,
      "value": "Business Analytics Foundations",
      "label": "Business Questions & KPIs"
    },
    {
      "icon": LineChart,
      "value": "Excel for Analysis",
      "label": "Formulas & Pivot Tables"
    },
    {
      "icon": LineChart,
      "value": "SQL for Business",
      "label": "Queries & Joins"
    },
    {
      "icon": LineChart,
      "value": "Power BI & Dashboards",
      "label": "Power Query & Data Models"
    }
  ],
  "curriculum": [
    {
      "number": "01",
      "icon": LineChart,
      "title": "Business Analytics Foundations",
      "topics": [
        "Business Questions",
        "KPIs",
        "Data Types",
        "Analytical Thinking"
      ]
    },
    {
      "number": "02",
      "icon": LineChart,
      "title": "Excel for Analysis",
      "topics": [
        "Formulas",
        "Pivot Tables",
        "Data Cleaning",
        "Charts"
      ]
    },
    {
      "number": "03",
      "icon": LineChart,
      "title": "SQL for Business",
      "topics": [
        "Queries",
        "Joins",
        "Aggregations",
        "Business Reporting"
      ]
    },
    {
      "number": "04",
      "icon": LineChart,
      "title": "Power BI & Dashboards",
      "topics": [
        "Power Query",
        "Data Models",
        "DAX Basics",
        "Dashboard Design"
      ]
    },
    {
      "number": "05",
      "icon": LineChart,
      "title": "Decision-Making & Storytelling",
      "topics": [
        "Sales Analysis",
        "Customer Segmentation",
        "Forecasting Basics",
        "Recommendations"
      ]
    }
  ],
  "projects": [
    {
      "icon": LineChart,
      "title": "Sales & Profitability Dashboard"
    },
    {
      "icon": LineChart,
      "title": "Customer Segmentation & Business Recommendations"
    }
  ],
  "tools": [
    {
      "icon": LineChart,
      "label": "Microsoft Excel"
    },
    {
      "icon": LineChart,
      "label": "SQL"
    },
    {
      "icon": LineChart,
      "label": "Power BI"
    },
    {
      "icon": LineChart,
      "label": "Power Query"
    },
    {
      "icon": LineChart,
      "label": "DAX"
    }
  ],
  "careerRoles": [
    {
      "label": "Business Analyst Intern"
    },
    {
      "label": "BI Analyst"
    },
    {
      "label": "Reporting Analyst"
    }
  ],
  "salaryRows": commonSalaryRows,
  "whyChoosePoints": commonWhyChoose,
  "certificateTitle": "Business Analytics Training & Project Certificate",
  "journeySteps": commonJourney,
  "faqs": [
    {
      "question": "What knowledge or equipment do I need?",
      "answer": "No coding experience is required. The program starts with spreadsheet and analytics fundamentals."
    },
    {
      "question": "Will I complete practical projects?",
      "answer": "Yes. The program includes guided practice and two practical projects."
    },
    {
      "question": "How do I earn a certificate?",
      "answer": "Complete the required training, assignments and project assessments to receive a NextPeer certificate."
    },
    {
      "question": "Is a job guaranteed?",
      "answer": "Career guidance and placement assistance support your job search. Employment is not guaranteed."
    }
  ]
},
  "finance": {
    slug: "finance",
    tagline: "Understand Financial Decisions with Practical Analysis",
    titleLine1: "Finance",
    heroInitials: "FI",
    titleLine2: "Accounting. Analysis. Modelling. Business Decisions.",
    description: "Build finance foundations through live classes, Excel exercises and two practical projects covering financial statements, budgeting, corporate finance and financial modelling.",
    heroBadges: [
      { icon: FileText, label: "Financial Statements" },
      { icon: LineChart, label: "Financial Analysis" },
      { icon: BarChart3, label: "Excel Modelling" },
      { icon: Briefcase, label: "Corporate Finance" },
    ],
    quickHighlights: ["Live Online Training", "Excel Practice", "Business Case Studies", "2 Live Projects", "Career Guidance", "NextPeer Certificate"],
    whyLearnTitle: "Why Learn Finance?",
    whyLearnDescription: "Finance helps you interpret business performance, plan budgets and evaluate decisions using financial data. Practical analysis connects accounting information to business questions.",
    whyLearnStats: [
      { icon: FileText, value: "Statements", label: "Understand Business Performance" },
      { icon: BarChart3, value: "Excel", label: "Build Financial Models" },
      { icon: LineChart, value: "Analysis", label: "Interpret Financial Ratios" },
      { icon: Briefcase, value: "Decisions", label: "Evaluate Business Scenarios" },
    ],
    curriculum: [
      { number: "01", icon: Briefcase, title: "Finance & Accounting Foundations", topics: ["Business Finance", "Accounting Equation", "Accruals and Cash", "Revenue and Expenses", "Financial Terminology"] },
      { number: "02", icon: FileText, title: "Financial Statements", topics: ["Income Statement", "Balance Sheet", "Cash Flow Statement", "Statement Linkages", "Reading Annual Reports"] },
      { number: "03", icon: BarChart3, title: "Excel for Finance", topics: ["Financial Formulas", "Data Cleaning", "Lookup Functions", "Pivot Tables", "Charts and Model Checks"] },
      { number: "04", icon: LineChart, title: "Financial Statement Analysis", topics: ["Profitability Ratios", "Liquidity Ratios", "Leverage Ratios", "Working Capital", "Trend and Peer Analysis"] },
      { number: "05", icon: Target, title: "Budgeting & Forecasting", topics: ["Revenue Drivers", "Cost Planning", "Operating Budgets", "Cash Budgets", "Variance Analysis"] },
      { number: "06", icon: Sigma, title: "Corporate Finance", topics: ["Time Value of Money", "Discounting", "Capital Budgeting", "NPV and IRR", "Funding and Cost of Capital Concepts"] },
      { number: "07", icon: Layers, title: "Financial Modelling & Valuation Basics", topics: ["Model Structure", "Assumption Documentation", "Projected Statements", "DCF Concepts", "Scenario and Sensitivity Analysis"] },
      { number: "08", icon: FolderKanban, title: "Projects & Career Preparation", topics: ["Financial Analysis Report", "Budget and Forecast Model", "Model Validation", "Presenting Findings", "Finance Interview Practice"] },
    ],
    projects: [
      { icon: FileText, title: "Company Financial Statement Analysis Report" },
      { icon: BarChart3, title: "Excel Budget, Cash Forecast & Scenario Model" },
    ],
    tools: [
      { icon: BarChart3, label: "Microsoft Excel" },
      { icon: FileText, label: "Google Sheets" },
      { icon: FileText, label: "Annual Reports" },
      { icon: LineChart, label: "Financial Dashboards" },
    ],
    careerRoles: [
      { label: "Finance Intern" },
      { label: "Junior Financial Analyst" },
      { label: "FP&A Intern" },
      { label: "Finance Operations Associate" },
      { label: "Accounts and Finance Trainee" },
    ],
    salaryRows: commonSalaryRows,
    whyChoosePoints: commonWhyChoose,
    certificateTitle: "Finance Training & Project Certificate",
    journeySteps: commonJourney,
    faqs: [
      { question: "Do I need prior finance experience?", answer: "No. The course starts with finance and accounting foundations. Basic arithmetic and spreadsheet familiarity are helpful." },
      { question: "Which software do I need?", answer: "You need a computer with spreadsheet access. Microsoft Excel is used for modelling practice; many foundational exercises can also be completed in Google Sheets." },
      { question: "Will I complete practical projects?", answer: "Yes. You will prepare a financial statement analysis report and an Excel budget and cash forecast model using sample or publicly available business data." },
      { question: "Is this a trading or investment advisory course?", answer: "The course focuses on business finance, financial analysis and modelling. Valuation exercises are educational case studies." },
      { question: "How do I earn a certificate?", answer: "Complete the required training, assignments and project assessments to receive a NextPeer certificate." },
      { question: "Is a job guaranteed?", answer: "Career guidance and placement assistance support your preparation and job search. Employment is not guaranteed." },
    ],
  },
};

export const DEFAULT_HELP_ICON = HelpCircle;
