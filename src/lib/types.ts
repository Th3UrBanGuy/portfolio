import type { ClientDetails } from './schemas/client-details';

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
  documentation_link?: string;
  category: string;
};

export type Social = {
    id: string;
    name: string;
    url: string;
    icon_class: string;
}

export type ContactDetails = {
    contactMeLink: string;
    phone: string;
    emails: string[];
}

export type Achievement = {
  id: string;
  title: string;
  short_description: string;
  icon_url: string;
  certificate_image_url: string;
  full_description: string;
  how_achieved: string;
  words_about_it: string;
};

export type Skill = {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
};

export type PortfolioData = {
  personalInfo: PersonalInfo;
  education: Education[];
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  authorImageUrl: string;
  authorImageHint: string;
  aboutMe: string;
  contactDetails: ContactDetails;
  socials: Social[];
  achievements: Achievement[];
};

export type ViewerData = {
    id: string;
    timestamp: Date;
    ip: string;
    city: string;
    country: string;
    isp: string;
    ipType: string;
    region: string;
    postal: string;
    asn: string;
    latitude: number | null;
    longitude: number | null;
    clientDetails: ClientDetails;
};