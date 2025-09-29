'use client';

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

export type ProjectLink = {
  label: string;
  url: string;
};

export type Project = {
  id: string;
  title: string;
  short_description: string;
  image_url: string;
  full_description: string;
  technologies: string[];
  links: ProjectLink[];
  category: string;
};


export type Social = {
    id: string;
    name: string;
    url: string;
    icon_name: string;
}

export type CustomLink = {
    id: string;
    label: string;
    url: string;
    icon_name: string;
}

export type PhoneNumber = {
    id: string;
    number: string;
}

export type ContactDetails = {
    emails: string[];
    phoneNumbers: PhoneNumber[];
}

export type Achievement = {
  id:string;
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
  cvLink: string;
  customLinks: CustomLink[];
};

export type ViewerData = {
    id: string;
    visitorId: string;
    first_visit: Date;
    last_visit: Date;
    visit_history: Date[];
    visit_count: number;
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
