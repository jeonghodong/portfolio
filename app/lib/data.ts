import { PersonalInfo, Project, Skill, Experience } from "@/app/types";

export const personalInfo: PersonalInfo = {
  name: "Jeonghо Dong",
  role: "Frontend Developer",
  tagline: "Crafting immersive web experiences with code and creativity",
  bio: `I'm a passionate frontend developer specializing in creating interactive and visually stunning web applications. With expertise in React, Next.js, and 3D web graphics, I transform ideas into engaging digital experiences.`,
  location: "Seoul, South Korea",
  email: "contact@example.com",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  audioUrl: "/audio/intro.mp3",
};

export const projects: Project[] = [
  {
    id: "1",
    title: "3D Product Showcase",
    description: "Interactive 3D product visualization platform",
    longDescription:
      "Built a cutting-edge e-commerce platform featuring real-time 3D product visualization using Three.js and React. Customers can interact with products in 3D space, customize colors, and view from any angle.",
    technologies: [
      "React",
      "Three.js",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
    ],
    demoUrl: "https://demo.example.com",
    githubUrl: "https://github.com/example/project1",
    imageUrl: "/projects/project1.jpg",
    audioUrl: "/audio/project1.mp3",
    featured: true,
  },
  {
    id: "2",
    title: "Real-time Collaboration Tool",
    description: "Team collaboration platform with live updates",
    longDescription:
      "Developed a real-time collaboration platform that enables teams to work together seamlessly. Features include live cursors, instant messaging, and collaborative whiteboard with WebSocket integration.",
    technologies: ["Next.js", "WebSocket", "Redis", "PostgreSQL", "Prisma"],
    demoUrl: "https://demo.example.com",
    githubUrl: "https://github.com/example/project2",
    imageUrl: "/projects/project2.jpg",
    audioUrl: "/audio/project2.mp3",
    featured: true,
  },
  {
    id: "3",
    title: "AI-Powered Design System",
    description: "Intelligent component library with AI suggestions",
    longDescription:
      "Created an innovative design system that uses AI to suggest component combinations and accessibility improvements. Includes 50+ customizable components with automatic dark mode support.",
    technologies: [
      "React",
      "TypeScript",
      "Storybook",
      "Framer Motion",
      "OpenAI",
    ],
    githubUrl: "https://github.com/example/project3",
    imageUrl: "/projects/project3.jpg",
    featured: false,
  },
  {
    id: "4",
    title: "Performance Monitoring Dashboard",
    description: "Real-time web vitals tracking and analytics",
    longDescription:
      "Built a comprehensive performance monitoring dashboard that tracks Core Web Vitals, custom metrics, and provides actionable insights for optimization.",
    technologies: ["Next.js", "D3.js", "Node.js", "MongoDB", "Docker"],
    demoUrl: "https://demo.example.com",
    imageUrl: "/projects/project4.jpg",
    featured: false,
  },
  {
    id: "5",
    title: "Performance Monitoring Dashboard",
    description: "Real-time web vitals tracking and analytics",
    longDescription:
      "Built a comprehensive performance monitoring dashboard that tracks Core Web Vitals, custom metrics, and provides actionable insights for optimization.",
    technologies: ["Next.js", "D3.js", "Node.js", "MongoDB", "Docker"],
    demoUrl: "https://demo.example.com",
    imageUrl: "/projects/project4.jpg",
    featured: false,
  },
  {
    id: "6",
    title: "Performance Monitoring Dashboard",
    description: "Real-time web vitals tracking and analytics",
    longDescription:
      "Built a comprehensive performance monitoring dashboard that tracks Core Web Vitals, custom metrics, and provides actionable insights for optimization.",
    technologies: ["Next.js", "D3.js", "Node.js", "MongoDB", "Docker"],
    demoUrl: "https://demo.example.com",
    imageUrl: "/projects/project4.jpg",
    featured: false,
  },
  {
    id: "7",
    title: "Performance Monitoring Dashboard",
    description: "Real-time web vitals tracking and analytics",
    longDescription:
      "Built a comprehensive performance monitoring dashboard that tracks Core Web Vitals, custom metrics, and provides actionable insights for optimization.",
    technologies: ["Next.js", "D3.js", "Node.js", "MongoDB", "Docker"],
    demoUrl: "https://demo.example.com",
    imageUrl: "/projects/project4.jpg",
    featured: false,
  },
  {
    id: "8",
    title: "Performance Monitoring Dashboard",
    description: "Real-time web vitals tracking and analytics",
    longDescription:
      "Built a comprehensive performance monitoring dashboard that tracks Core Web Vitals, custom metrics, and provides actionable insights for optimization.",
    technologies: ["Next.js", "D3.js", "Node.js", "MongoDB", "Docker"],
    demoUrl: "https://demo.example.com",
    imageUrl: "/projects/project4.jpg",
    featured: false,
  },
];

export const skills: Skill[] = [
  // Frontend
  { name: "React", category: "frontend", level: 5 },
  { name: "Next.js", category: "frontend", level: 5 },
  { name: "TypeScript", category: "frontend", level: 5 },
  { name: "JavaScript", category: "frontend", level: 5 },
  { name: "Three.js", category: "frontend", level: 4 },
  { name: "Framer Motion", category: "frontend", level: 4 },
  { name: "Tailwind CSS", category: "frontend", level: 5 },
  { name: "CSS/SCSS", category: "frontend", level: 5 },
  { name: "HTML5", category: "frontend", level: 5 },

  // Backend
  { name: "Node.js", category: "backend", level: 4 },
  { name: "Express", category: "backend", level: 4 },
  { name: "PostgreSQL", category: "backend", level: 3 },
  { name: "MongoDB", category: "backend", level: 3 },
  { name: "Prisma", category: "backend", level: 4 },
  { name: "GraphQL", category: "backend", level: 3 },

  // Tools
  { name: "Git", category: "tools", level: 5 },
  { name: "Docker", category: "tools", level: 3 },
  { name: "Webpack", category: "tools", level: 4 },
  { name: "Vite", category: "tools", level: 4 },
  { name: "Figma", category: "tools", level: 4 },
  { name: "Storybook", category: "tools", level: 4 },
];

export const experiences: Experience[] = [
  {
    company: "Tech Innovation Labs",
    position: "Senior Frontend Developer",
    period: "2022 - Present",
    description:
      "Leading frontend development for enterprise web applications. Implemented 3D visualization features and improved performance by 40%.",
    technologies: ["React", "Next.js", "Three.js", "TypeScript"],
  },
  {
    company: "Creative Digital Studio",
    position: "Frontend Developer",
    period: "2020 - 2022",
    description:
      "Developed interactive websites and web applications for various clients. Specialized in animation and user experience design.",
    technologies: ["React", "Vue.js", "Framer Motion", "GSAP"],
  },
  {
    company: "Startup Ventures",
    position: "Junior Frontend Developer",
    period: "2019 - 2020",
    description:
      "Built responsive web applications and maintained existing codebases. Collaborated with designers to implement pixel-perfect UIs.",
    technologies: ["JavaScript", "React", "Sass", "Bootstrap"],
  },
];

export const sectionAudios = {
  hero: "/audio/hero.mp3",
  about: "/audio/about.mp3",
  projects: "/audio/projects.mp3",
  skills: "/audio/skills.mp3",
  contact: "/audio/contact.mp3",
};
