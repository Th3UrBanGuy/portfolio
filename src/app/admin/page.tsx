'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book, UserCircle, GraduationCap, Star, Briefcase, Trophy, FolderKanban, Mail, Shield, LayoutDashboard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Header from './_components/Header';
import Dashboard from './_components/Dashboard';
import ProfilePage from './_components/profile/ProfilePage';
import EducationPage from './_components/education/EducationPage';
import SkillsPage from './_components/skills/SkillsPage';
import ExperiencePage from './_components/experience/ExperiencePage';
import AchievementsPage from './_components/achievements/AchievementsPage';
import ProjectsPage from './_components/projects/ProjectsPage';
import ContactPage from './_components/contact/ContactPage';
import SecurityPage from './_components/security/SecurityPage';

type AdminView =
  | 'dashboard'
  | 'profile'
  | 'education'
  | 'skills'
  | 'experience'
  | 'achievements'
  | 'projects'
  | 'contact'
  | 'security';

export default function AdminPage() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const renderView = () => {
    const props = { setActiveView };
    switch (activeView) {
      case 'profile':
        return <ProfilePage {...props} />;
      case 'education':
        return <EducationPage {...props} />;
      case 'skills':
        return <SkillsPage {...props} />;
      case 'experience':
        return <ExperiencePage {...props} />;
      case 'achievements':
        return <AchievementsPage {...props} />;
      case 'projects':
        return <ProjectsPage {...props} />;
      case 'contact':
        return <ContactPage {...props} />;
      case 'security':
        return <SecurityPage {...props} />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  const NavLink = ({ view, icon: Icon, label }: { view: AdminView; icon: React.ElementType; label: string }) => (
    <Button
      variant={activeView === view ? 'secondary' : 'ghost'}
      onClick={() => setActiveView(view)}
      className="w-full justify-start"
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href="#" className="flex items-center gap-2 font-semibold" onClick={() => setActiveView('dashboard')}>
              <Book className="h-6 w-6" />
              <span>Admin Panel</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <NavLink view="dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavLink view="profile" icon={UserCircle} label="Profile" />
              <NavLink view="education" icon={GraduationCap} label="Education" />
              <NavLink view="skills" icon={Star} label="Skills" />
              <NavLink view="experience" icon={Briefcase} label="Experience" />
              <NavLink view="achievements" icon={Trophy} label="Achievements" />
              <NavLink view="projects" icon={FolderKanban} label="Projects" />
              <NavLink view="contact" icon={Mail} label="Contact & Socials" />
              <NavLink view="security" icon={Shield} label="Security" />
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
