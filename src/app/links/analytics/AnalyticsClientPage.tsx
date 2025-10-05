'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ShortLink, Visit } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsClientPage() {
  const searchParams = useSearchParams();
  const initialLinkId = searchParams.get('id');
  
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(initialLinkId);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'short-links'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLinks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShortLink)));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (selectedLinkId) {
      setLoading(true);
      const q = query(collection(db, `short-links/${selectedLinkId}/visits`), orderBy('timestamp', 'desc'), limit(100));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const visitsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Visit));
        setVisits(visitsData);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      setVisits([]);
      setLoading(false);
    }
  }, [selectedLinkId]);

  const analyticsData = useMemo(() => {
    if (visits.length === 0) return null;

    const topCountries = visits.reduce((acc, v) => {
        if(v.country === 'Unknown') return acc;
        acc[v.country] = (acc[v.country] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topBrowsers = visits.reduce((acc, v) => {
        if(v.browser === 'Unknown') return acc;
        acc[v.browser] = (acc[v.browser] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topOS = visits.reduce((acc, v) => {
        if(v.os === 'Unknown') return acc;
        acc[v.os] = (acc[v.os] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return {
      totalClicks: visits.length,
      topCountries: Object.entries(topCountries).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5),
      topBrowsers: Object.entries(topBrowsers).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5),
      topOS: Object.entries(topOS).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5),
      recentVisits: visits.slice(0, 10),
    };
  }, [visits]);

  const handleLinkChange = (linkId: string) => {
    setSelectedLinkId(linkId);
    window.history.pushState(null, '', `?id=${linkId}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className='flex items-center gap-4'>
            <Button asChild variant="outline" size="icon">
                <Link href="/links"><ArrowLeft /></Link>
            </Button>
            <h1 className="text-2xl font-bold">Link Analytics</h1>
          </div>
          <Select onValueChange={handleLinkChange} value={selectedLinkId || ''}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a link..." />
            </SelectTrigger>
            <SelectContent>
              {links.map(link => (
                <SelectItem key={link.id} value={link.id}>
                  {link.path}/{link.slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-28" />
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
                <Skeleton className="h-96 col-span-1 md:col-span-2 lg:col-span-3" />
            </div>
        ) : !selectedLinkId ? (
            <Card className='text-center py-20'>
                <CardContent>
                    <h2 className='text-xl font-medium'>Select a link to view its analytics.</h2>
                </CardContent>
            </Card>
        ) : !analyticsData ? (
             <Card className='text-center py-20'>
                <CardContent>
                    <h2 className='text-xl font-medium'>No analytics data for this link yet.</h2>
                    <p className='text-muted-foreground'>Share the link to start collecting data!</p>
                </CardContent>
            </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{analyticsData.totalClicks}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader><CardTitle>Top Countries</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analyticsData.topCountries} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} width={80} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Top Browsers</CardTitle></CardHeader>
                <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                    <Pie data={analyticsData.topBrowsers} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {analyticsData.topBrowsers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                    </PieChart>
                </ResponsiveContainer>
                </CardContent>
            </Card>
            
             <Card>
                <CardHeader><CardTitle>Top Operating Systems</CardTitle></CardHeader>
                <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                    <Pie data={analyticsData.topOS} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {analyticsData.topOS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                    </PieChart>
                </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader><CardTitle>Recent Visits</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>ISP</TableHead>
                      <TableHead>Browser</TableHead>
                      <TableHead>OS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.recentVisits.map(v => (
                      <TableRow key={v.id}>
                        <TableCell>{formatDistanceToNow(v.timestamp.toDate(), { addSuffix: true })}</TableCell>
                        <TableCell>{v.country}</TableCell>
                        <TableCell>{v.isp}</TableCell>
                        <TableCell>{v.browser}</TableCell>
                        <TableCell>{v.os}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
