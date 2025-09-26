export type PersonalInfo = {
  name: string;
  dob: string;
  bloodGroup: string;
  nationality: string;
  occupation: string;
  status: string;
  hobby: string;
  aimInLife: string;
};

export type Education = {
  id: string;
  institution: string;
  session: string;
  details: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  short_description: string;
  details: string[];
};

export type Project = {
  id: string;
  name: string; // was title
  description: string; // was short_description
  imageUrl: string;
  imageHint: string;
  technologies: string[];
  full_description: string;
  preview_link: string;
};

export type PortfolioData = {
  personalInfo: PersonalInfo;
  education: Education[];
  skills: string[];
  projects: Project[];
  experience: Experience[];
  authorImageUrl: string;
  authorImageHint: string;
  aboutMe: string;
};
