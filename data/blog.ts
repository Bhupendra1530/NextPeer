import {
  Code2,
  Globe,
  Bot,
  Braces,
  Target,
  Compass,
  Trophy,
  GraduationCap,
  Newspaper,
  Brain,
  GitCompareArrows,
  ListChecks,
  FileWarning,
  GitBranch,
  Sparkles,
  FileText,
  BookOpen,
  Map,
  StickyNote,
  BookMarked,
} from "lucide-react";
import type {
  BlogCategory,
  BlogPost,
  FeaturedPost,
  TrendingTopic,
  FreeResource,
} from "@/types";

export const BLOG_CATEGORIES: BlogCategory[] = [
  { slug: "programming", label: "Programming", icon: Code2 },
  { slug: "web-development", label: "Web Development", icon: Globe },
  { slug: "artificial-intelligence", label: "Artificial Intelligence", icon: Bot },
  { slug: "dsa", label: "DSA", icon: Braces },
  { slug: "interview-preparation", label: "Interview Preparation", icon: Target },
  { slug: "career-guidance", label: "Career Guidance", icon: Compass },
  { slug: "success-stories", label: "Success Stories", icon: Trophy },
  { slug: "student-resources", label: "Student Resources", icon: GraduationCap },
  { slug: "industry-news", label: "Industry News", icon: Newspaper },
];

export const FEATURED_POST: FeaturedPost = {
  slug: "complete-roadmap-software-engineer-2026",
  title: "The Complete Roadmap to Become a Software Engineer in 2026",
  excerpt:
    "Learn everything from programming fundamentals to DSA, development, AI, projects, GitHub, resume building, and interview preparation.",
  tags: ["Career", "DSA", "AI", "Roadmap"],
  readTime: "12 Minutes",
};

export const LATEST_ARTICLES: BlogPost[] = [
  {
    slug: "why-dsa-still-matters-in-the-ai-era",
    number: 1,
    title: "Why DSA Still Matters in the AI Era",
    excerpt: "Master problem-solving skills that every software company looks for.",
    gradient: "from-indigo-950 via-purple-950 to-slate-900",
    icon: Brain,
    readTime: "8 min read",
    content: `
## Why DSA Still Matters in the AI Era

Artificial intelligence has changed how developers write code. AI tools can generate functions, explain errors, suggest solutions and speed up development. But this raises an important question for students: is learning Data Structures and Algorithms still worth it?

The answer is that DSA remains highly relevant because programming is not only about writing code. It is about understanding problems, choosing efficient solutions and knowing why a solution works.

## What Is DSA?

Data Structures and Algorithms, commonly called DSA, is the study of how data can be organized and how problems can be solved efficiently.

Data structures include arrays, linked lists, stacks, queues, hash maps, trees, heaps and graphs. Algorithms include techniques such as searching, sorting, recursion, dynamic programming, greedy algorithms and graph traversal.

Together, these concepts help developers think systematically about computational problems.

## Why Learn DSA When AI Can Generate Code?

AI can produce code quickly, but developers still need to evaluate that code.

You need to understand whether a generated solution is correct, efficient, secure and suitable for the problem you are solving. A strong foundation in algorithms makes it easier to identify inefficient approaches and improve them.

For example, two pieces of code may produce exactly the same output while having very different time and memory requirements. Understanding concepts such as time complexity and space complexity helps you recognize that difference.

## DSA and Coding Interviews

DSA also continues to be important for technical interview preparation.

Coding assessments frequently test problem-solving rather than knowledge of a specific framework. Candidates may encounter problems involving arrays, strings, hash maps, trees, graphs, recursion or dynamic programming.

Instead of memorizing hundreds of solutions, students should focus on recognizing common problem-solving patterns and understanding why they work.

## DSA Topics Students Should Learn

A practical learning sequence can start with:

1. Arrays and strings
2. Searching and sorting
3. Hashing
4. Linked lists
5. Stacks and queues
6. Recursion and backtracking
7. Trees and binary search trees
8. Heaps and priority queues
9. Graphs
10. Greedy algorithms
11. Dynamic programming
12. Time and space complexity

You do not need to master everything immediately. Build the fundamentals first and gradually move toward more complex problems.

## How AI Should Be Used While Learning DSA

AI can be a useful learning assistant when used correctly.

Instead of asking AI to solve every problem immediately, try solving the problem yourself first. Then use AI to explain concepts you do not understand, review your approach, identify edge cases or suggest alternative solutions.

A useful workflow is:

**Understand → Attempt → Debug → Optimize → Explain**

If you can explain your final solution clearly without depending on AI, you are developing genuine problem-solving ability.

## A Simple DSA Roadmap

Start with programming fundamentals and become comfortable with variables, loops, functions and basic object-oriented programming.

Next, learn arrays, strings and complexity analysis. After that, progress through linked lists, stacks, queues, recursion and trees.

Once those concepts feel comfortable, move toward graphs, greedy techniques and dynamic programming.

Most importantly, practice consistently. Solving a few problems regularly is usually more useful than attempting dozens of problems in one day and then stopping for weeks.

## DSA Plus Development Is a Strong Combination

DSA should not be your only focus.

Students preparing for software careers can combine problem-solving skills with practical development. Build projects, learn Git and GitHub, understand databases, work with APIs and become comfortable deploying applications.

DSA develops your problem-solving foundation, while projects demonstrate that you can apply technical knowledge to real applications.

## Final Thoughts

AI is changing software development, but it is also increasing the importance of understanding what happens behind generated code.

Students who combine DSA fundamentals, practical projects and responsible use of AI can build a stronger technical foundation for internships, placements and software engineering roles.

At NextPeer, our goal is to help college students move beyond theory through practical learning, projects, mentorship and career-focused skill development.
`,
  },
  {
    slug: "mern-vs-nextjs-which-should-you-learn-first",
    number: 2,
    title: "MERN Stack vs Next.js: Which Should You Learn First?",
    excerpt: "A detailed comparison for beginners and professionals.",
    gradient: "from-slate-900 via-emerald-950 to-slate-900",
    icon: GitCompareArrows,
    readTime: "10 min read",
  },
  {
    slug: "top-50-coding-interview-questions",
    number: 3,
    title: "Top 50 Coding Interview Questions Asked in Product Companies",
    excerpt: "Practice the most frequently asked interview questions.",
    gradient: "from-blue-950 via-slate-900 to-slate-900",
    icon: ListChecks,
    readTime: "15 min read",
  },
  {
    slug: "resume-mistakes-costing-you-interviews",
    number: 4,
    title: "Resume Mistakes That Are Costing You Interviews",
    excerpt: "Avoid these common mistakes and get shortlisted faster.",
    gradient: "from-slate-900 via-rose-950 to-slate-900",
    icon: FileWarning,
    readTime: "6 min read",
  },
  {
    slug: "git-github-explained-like-a-beginner",
    number: 5,
    title: "Git & GitHub Explained Like You're a Beginner",
    excerpt: "Everything you need to know to collaborate on real-world projects.",
    gradient: "from-slate-950 via-slate-800 to-slate-900",
    icon: GitBranch,
    readTime: "7 min read",
  },
  {
    slug: "ai-tools-every-student-should-learn",
    number: 6,
    title: "AI Tools Every Student Should Learn",
    excerpt: "Explore tools that can boost productivity, coding, and learning.",
    gradient: "from-cyan-950 via-blue-950 to-slate-900",
    icon: Sparkles,
    readTime: "9 min read",
  },
];

export const TRENDING_TOPICS: TrendingTopic[] = [
  { label: "JavaScript" },
  { label: "React" },
  { label: "Python" },
  { label: "AI" },
  { label: "Machine Learning" },
  { label: "System Design" },
  { label: "Node.js" },
  { label: "SQL" },
  { label: "Aptitude" },
  { label: "Placement Tips" },
];

export const FREE_RESOURCES: FreeResource[] = [
  { icon: FileText, label: "Resume Templates" },
  { icon: BookOpen, label: "Interview Preparation Guide" },
  { icon: StickyNote, label: "DSA Cheat Sheet" },
  { icon: Map, label: "Web Development Roadmap" },
  { icon: FileText, label: "JavaScript Notes" },
  { icon: BookMarked, label: "Python Handbook" },
];
