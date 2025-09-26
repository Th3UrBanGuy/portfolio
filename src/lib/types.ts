export type Project = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  technologies: string[];
};

export type PortfolioData = {
  aboutMe: string;
  projects: Project[];
};
