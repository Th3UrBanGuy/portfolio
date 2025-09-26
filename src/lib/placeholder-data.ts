import type { PortfolioData } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const defaultPortfolioData: PortfolioData = {
  aboutMe:
    "Welcome to my digital portfolio! I'm a passionate developer with a knack for creating beautiful, functional, and user-centric web experiences. With a background in both design and engineering, I bridge the gap between creative vision and technical implementation. I thrive on solving complex problems and am always eager to learn new technologies. When I'm not coding, you can find me exploring new coffee shops or contributing to open-source projects.",
  projects: [
    {
      id: '1',
      name: 'QuantumLeap CRM',
      description:
        'A next-generation customer relationship management platform designed for startups. It features a modular design, real-time analytics, and an intuitive user interface to help businesses grow.',
      imageUrl: PlaceHolderImages[0].imageUrl,
      imageHint: PlaceHolderImages[0].imageHint,
      technologies: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL'],
    },
    {
      id: '2',
      name: 'Project Nebula',
      description:
        'An e-commerce site for a bespoke furniture brand. The project focused on a seamless user experience, 3D product visualizations, and a highly-performant, secure checkout process.',
      imageUrl: PlaceHolderImages[1].imageUrl,
      imageHint: PlaceHolderImages[1].imageHint,
      technologies: ['Next.js', 'Three.js', 'Stripe', 'Tailwind CSS', 'Vercel'],
    },
    {
      id: '3',
      name: 'EchoWave Social',
      description:
        'A decentralized social media application that gives users full control over their data. Built on blockchain technology, it prioritizes privacy and censorship resistance.',
      imageUrl: PlaceHolderImages[2].imageUrl,
      imageHint: PlaceHolderImages[2].imageHint,
      technologies: ['SvelteKit', 'Ethers.js', 'IPFS', 'The Graph'],
    },
  ],
};
