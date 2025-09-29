import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight, UserCircle } from 'lucide-react';

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
        <Link href="/admin/viewers">
            <Card className="hover:border-primary transition-colors cursor-pointer group">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Users className="h-6 w-6 text-primary" />
                            <span className="text-lg">Viewers</span>
                        </div>
                         <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        See detailed analytics about the visitors to your portfolio.
                    </CardDescription>
                </CardContent>
            </Card>
        </Link>
      </div>
    </div>
  );
}
