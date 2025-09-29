import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight, UserCircle, GraduationCap, Star, Briefcase, Trophy, FolderKanban, Mail, Shield } from 'lucide-react';
import { resetSecretKey } from './security/actions';
import { redirect } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KeyRound } from 'lucide-react';

type AdminDashboardProps = {
  searchParams?: {
    resetkey?: string;
    reset?: string;
  };
};

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
  const resetKey = searchParams?.resetkey;
  const wasReset = searchParams?.reset === 'success';

  if (resetKey) {
    await resetSecretKey(resetKey);
    redirect('/admin?reset=success');
  }

  return (
    <div className="space-y-6">
      {wasReset && (
         <Alert>
            <KeyRound className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
                The secret key has been successfully reset. Please consider changing it to a more secure value on the Security page.
            </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/profile">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
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
        </Link>
        <Link href="/admin/education">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
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
        </Link>
        <Link href="/admin/skills">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
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
        </Link>
        <Link href="/admin/experience">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
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
        </Link>
        <Link href="/admin/achievements">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
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
        </Link>
        <Link href="/admin/projects">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
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
        </Link>
        <Link href="/admin/contact">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
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
        </Link>
        <Link href="/admin/viewers">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="text-lg">Portfolio Viewers</span>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                See who has been looking at your interactive portfolio.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
         <Link href="/admin/security">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
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
        </Link>
      </div>
    </div>
  );
}
