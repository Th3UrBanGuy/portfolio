'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  User,
  GraduationCap,
  Star,
  ShieldCheck,
  Trophy,
  Mail,
  Home,
  LogOut,
  Book,
  Users,
} from 'lucide-react';
import Header from './_components/Header';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/viewers', label: 'Viewers', icon: Users },
  { href: '/admin/personal-info', label: 'Personal Info', icon: User },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/skills', label: 'Skills', icon: Star },
  { href: '/admin/experience', label: 'Experience', icon: ShieldCheck },
  { href: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/contact', label: 'Contact/Socials', icon: Mail },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    icon={<item.icon />}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/" legacyBehavior passHref>
                        <SidebarMenuButton icon={<Book />}>
                            View Portfolio
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton icon={<LogOut />}>
                        Logout
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-6">
          <Header />
          <main className="mt-4">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
