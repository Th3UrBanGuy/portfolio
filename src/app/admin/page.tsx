import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight, UserCircle, GraduationCap, Star, Briefcase, Trophy, FolderKanban, Mail } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
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
      </div>
    </div>
  );
}