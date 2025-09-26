import type { PortfolioData } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const defaultPortfolioData: PortfolioData = {
  aboutMe:
    "I'm a hands-on tech explorer who dives into any technical issue, finds innovative solutions, and stays updated with the latest tech trends - a true 'Jugadu Technophile'. Since 2016, I've been solving diverse tech issues using creative methods and AI tools, and I'm always exploring new technologies.",
  projects: [
    {
      id: '1',
      name: 'Automated Visitor Appointment System',
      description:
        'A sophisticated automated solution for scheduling appointments with the esteemed Vice Chancellor at BGC Trust University Bangladesh, aimed at redefining and streamlining the process.',
      imageUrl: PlaceHolderImages[0].imageUrl,
      imageHint: PlaceHolderImages[0].imageHint,
      technologies: ['Python', 'Docker', 'UI/UX'],
    },
    {
      id: '2',
      name: 'k-NN Algorithm Optimization',
      description:
        'Co-authored a research paper on optimizing the k value in the k-Nearest Neighbor algorithm, specifically for the academic prediction of working students.',
      imageUrl: PlaceHolderImages[1].imageUrl,
      imageHint: PlaceHolderImages[1].imageHint,
      technologies: ['Python', 'C++', 'Data Analysis'],
    },
    {
      id: '3',
      name: 'Real-Time Cricket Scoring Web App',
      description:
        'A dynamic web application designed to provide real-time cricket scorecards for university-level matches, creating the ultimate cricket experience for fans.',
      imageUrl: PlaceHolderImages[2].imageUrl,
      imageHint: PlaceHolderImages[2].imageHint,
      technologies: ['HTML', 'CSS', 'WordPress', 'JavaScript'],
    },
  ],
};
