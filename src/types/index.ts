export interface ProjectLink {
  label: string;
  label_ko?: string;
  url: string;
  icon?: "npm" | "blog" | "docs" | "video" | "external";
}

export interface Project {
  id: string;
  title: string;
  title_ko: string;
  title_en: string;
  description: string;
  description_ko: string;
  description_en: string;
  longDescription: string;
  longDescription_ko: string;
  longDescription_en: string;
  period: string;
  teamSize?: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  audioUrl?: string;
  featured: boolean;
  links?: ProjectLink[];
}

export interface Skill {
  name: string;
  category: "frontend" | "backend" | "tools" | "other";
  level: number; // 1-5
  icon?: string;
}

export interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
  technologies: string[];
}

export interface SectionAudio {
  hero?: string;
  about?: string;
  projects?: string;
  skills?: string;
  contact?: string;
}

export interface PlanetEnvironment {
  groundColor: string;
  skyColor: string;
  fogColor: string;
  ambientColor: string;
  particleColor: string;
  features: string[]; // e.g., ['craters', 'dust', 'rocks']
}

export interface Planet {
  id: string;
  name: string;
  name_ko: string;
  name_en: string;
  size: number;
  textureUrl: string;
  position: [number, number, number];
  rotationSpeed: number;
  projectId?: string;
  hasRing?: boolean;
  ringTextureUrl?: string;
  environment: PlanetEnvironment;
}

export interface Capsule {
  id: string;
  projectId: string;
  position: [number, number, number];
  size: number;
  color: string;
  glowColor: string;
  targetPlanetId: string;
  label: string;
  label_ko: string;
  label_en: string;
}
