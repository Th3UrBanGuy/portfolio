'use client';

import { z } from 'zod';
import type { ClientDetails } from './schemas/client-details';
import { BookOpenCheck, Briefcase, GraduationCap, Lock, Mail, Star, Trophy, User, FolderKanban, Move, Shield } from 'lucide-react';
import React from 'react';

// --- Page Sequence and Configuration ---
export const PageSchema = z.enum([
  'cover', 'toc', 'about', 'private-info', 'education', 'skills', 
  'experience', 'achievements', 'projects', 'contact', 'back-cover'
]);
export type Page = z.infer<typeof PageSchema>;

export const ALL_PAGES: Page[] = [
  'cover', 'toc', 'about', 'private-info', 'education', 'skills', 
  'experience', 'achievements', 'projects', 'contact', 'back-cover'
];

export const pageConfig: Record<Page, { id: Page; label: string; icon: React.ElementType; isFixed?: boolean; isNavigable?: boolean }> = {
  'cover': { id: 'cover', label: 'Cover', icon: () => null, isFixed: true, isNavigable: false },
  'toc': { id: 'toc', label: 'Table of Contents', icon: BookOpenCheck, isFixed: false, isNavigable: false },
  'about': { id: 'about', label: 'About Me', icon: User, isFixed: false, isNavigable: true },
  'private-info': { id: 'private-info', label: 'Private Sanctum', icon: Lock, isFixed: false, isNavigable: true },
  'education': { id: 'education', label: 'Education', icon: GraduationCap, isFixed: false, isNavigable: true },
  'skills': { id: 'skills', label: 'Skills', icon: Star, isFixed: false, isNavigable: true },
  'experience': { id: 'experience', label: 'Experience', icon: Briefcase, isFixed: false, isNavigable: true },
  'achievements': { id: 'achievements', label: 'Achievements', icon: Trophy, isFixed: false, isNavigable: true },
  'projects': { id: 'projects', label: 'Projects', icon: FolderKanban, isFixed: false, isNavigable: true },
  'contact': { id: 'contact', label: 'Contact', icon: Mail, isFixed: false, isNavigable: true },
  'back-cover': { id: 'back-cover', label: 'Back Cover', icon: () => null, isFixed: true, isNavigable: false },
};

// --- Data Types ---

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

export type PrivateDocument = {
  id: string;
  label: string;
  url: string;
  icon_name: string;
};

export type PrivateInfo = {
  father_name: string;
  father_occupation: string;
  mother_name: string;
  mother_occupation: string;
  present_address: string;
  permanent_address: string;
  documents: PrivateDocument[];
}

export type Education = {
  id: string;
  institution: string;
  session: string;
  details: string;
  order: number;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  short_description: string;
  details: string[];
  order: number;
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
  order?: number;
};


export type Social = {
    id: string;
    name: string;
    url: string;
    icon_name: string;
    order?: number;
}

export type CustomLink = {
    id: string;
    label: string;
    url: string;
    icon_name: string;
    order?: number;
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
  order: number;
};

export type Skill = {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  order?: number;
};

export type PageTitle = {
  id: string;
  title: string;
};

export type PortfolioData = {
  personalInfo: PersonalInfo;
  privateInfo: PrivateInfo;
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
  pageTitles: PageTitle[];
  pageSequence: Page[];
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
