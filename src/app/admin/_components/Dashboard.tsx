'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight, UserCircle, GraduationCap, Star, Briefcase, Trophy, FolderKanban, Mail, Shield, Lock, Move } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KeyRound } from 'lucide-react';

type AdminView =
  | 'dashboard'
  | 'profile'
  | 'private-info'
  | 'education'
  | 'skills'
  | 'experience'
  | 'achievements'
  | 'projects'
  | 'contact'
  | 'sequence'
  | 'security';

type AdminDashboardProps = {
  setActiveView: (view: AdminView) => void;
};

export default function Dashboard({ setActiveView }: AdminDashboardProps) {
  // The reset key logic will be removed for now.
  // const wasReset = false; 

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card onClick={() => setActiveView('profile')} className="hover:border-primary transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCircle className="h-6 w-6 text-primary" />
                <span className="text-lg">Profile Details</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Manage your name, image, personal details, and CV link.
            </CardDescription>
          </CardContent>
        </Card>
        <Card onClick={() => setActiveView('private-info')} className="hover:border-primary transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-primary" />
                <span className="text-lg">Private Sanctum</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Manage sensitive personal information and private documents.
            </CardDescription>
          </CardContent>
        </Card>
        <Card onClick={() => setActiveView('education')} className="hover:border-primary transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-lg">Education</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Manage the educational institutions on your "About Me" page.
            </CardDescription>
          </CardContent>
        </Card>
        <Card onClick={() => setActiveView('skills')} className="hover:border-primary transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-primary" />
                <span className="text-lg">Skills</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Manage the skills and technologies listed on your portfolio.
            </CardDescription>
          </CardContent>
        </Card>
        <Card onClick={() => setActiveView('experience')} className="hover:border-primary transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-primary" />
                <span className="text-lg">Experience</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Manage your professional experience and job history.
            </CardDescription>
          </CardContent>
        </Card>
        <Card onClick={() => setActiveView('achievements')} className="hover:border-primary transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-primary" />
                <span className="text-lg">Achievements</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Manage your awards, publications, and other achievements.
            </CardDescription>
          </CardContent>
        </Card>
        <Card onClick={() => setActiveView('projects')} className="hover:border-primary transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FolderKanban className="h-6 w-6 text-primary" />
                <span className="text-lg">Projects</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Manage the projects, bundles, and creations on your portfolio.
            </CardDescription>
          </CardContent>
        </Card>
        <Card onClick={() => setActiveView('contact')} className="hover:border-primary transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                <span className="text-lg">Contact & Socials</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Manage your email, phone, and social media links.
            </CardDescription>
          </CardContent>
        </Card>
         <Card onClick={() => setActiveView('sequence')} className="hover:border-primary transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Move className="h-6 w-6 text-primary" />
                <span className="text-lg">Page Sequence</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
             Control the order of the pages in your portfolio flipbook.
            </CardDescription>
          </CardContent>
        </Card>
         <Card onClick={() => setActiveView('security')} className="hover:border-primary transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-lg">Security</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Manage the secret key for accessing the admin panel.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
