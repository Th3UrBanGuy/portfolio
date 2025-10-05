'use client';

import { useState, useEffect, useOptimistic, useTransition, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LinkForm } from './components/LinkForm';
import { QrCodeDialog } from './components/QrCodeDialog';
import { SettingsDialog } from './components/SettingsDialog';
import { ShortLink, LinkSettings } from '@/lib/types';
import { Trash2, Edit, Copy, ExternalLink, Link as LinkIcon, LogOut, MoreVertical, BarChart2, QrCode, Settings, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logout, saveLink, deleteLink, saveSettings } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input';

type Action = 
    | { type: 'add'; link: ShortLink }
    | { type: 'update'; link: ShortLink }
    | { type: 'delete'; id: string };


function optimisticReducer(state: ShortLink[], action: Action): ShortLink[] {
    switch (action.type) {
        case 'add':
            const existingIndex = state.findIndex(l => l.id === action.link.id);
            if (existingIndex > -1) {
                const newState = [...state];
                newState[existingIndex] = action.link;
                return newState;
            }
            return [action.link, ...state];
        case 'update':
            return state.map(l => l.id === action.link.id ? action.link : l);
        case 'delete':
            return state.filter(l => l.id !== action.id);
        default:
            return state;
    }
}

export default function LinksPage() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [settings, setSettings] = useState<LinkSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ShortLink | null>(null);
  const [qrCodeLink, setQrCodeLink] = useState<ShortLink | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPath, setSelectedPath] = useState('all');
  const { toast } = useToast();
  const [isSaving, startSavingTransition] = useTransition();
  const [isDeleting, startDeletingTransition] = useTransition();
  const isMobile = useIsMobile();
  const router = useRouter();

  const [optimisticLinks, dispatch] = useOptimistic(
    useMemo(() => links.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0)), [links]),
    optimisticReducer
  );

  useEffect(() => {
    const q = query(collection(db, 'short-links'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const linksData: ShortLink[] = [];
        querySnapshot.forEach((doc) => {
          linksData.push({ id: doc.id, ...doc.data() } as ShortLink);
        });
        setLinks(linksData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching links:', error);
        toast({ title: 'Error', description: 'Could not fetch links.', variant: 'destructive' });
        setLoading(false);
      }
    );
    
    const settingsDocRef = doc(db, 'site-data', 'link-shortener-settings');
    const unsubscribeSettings = onSnapshot(settingsDocRef, (doc) => {
        if (doc.exists()) {
            setSettings(doc.data() as LinkSettings);
        }
    });

    return () => {
        unsubscribe();
        unsubscribeSettings();
    };
  }, [toast]);
  
  const uniquePaths = useMemo(() => {
    const paths = new Set(links.map(link => link.path || '/'));
    return ['all', ...Array.from(paths)];
  }, [links]);

  const filteredLinks = useMemo(() => {
    return optimisticLinks.filter(link => {
      const pathMatch = selectedPath === 'all' || (link.path || '/') === selectedPath;
      const searchTermLower = searchTerm.toLowerCase();
      const searchMatch = 
        !searchTerm ||
        link.slug.toLowerCase().includes(searchTermLower) ||
        link.destination.toLowerCase().includes(searchTermLower);
      return pathMatch && searchMatch;
    });
  }, [optimisticLinks, selectedPath, searchTerm]);


  const handleEdit = (link: ShortLink) => {
    setEditingLink(link);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingLink(null);
    setIsFormOpen(true);
  };

  const handleShowQrCode = (link: ShortLink) => {
    setQrCodeLink(link);
  }

  const handleSave = async (values: Omit<ShortLink, 'createdAt'>) => {
    const isUpdating = !!values.id;
    const tempId = values.id || `temp-${Date.now()}`;
    const optimisticLink: ShortLink = {
        ...values,
        id: tempId,
        createdAt: new Date(),
    };

    startSavingTransition(async () => {
        dispatch({ type: isUpdating ? 'update' : 'add', link: optimisticLink });
        const result = await saveLink(values);
        if (result.success) {
            toast({ title: isUpdating ? 'Link Updated' : 'Link Created' });
        } else {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        }
    });
    setIsFormOpen(false);
  };

  const handleSaveSettings = async (values: LinkSettings) => {
    startSavingTransition(async () => {
        const result = await saveSettings(values);
        if (result.success) {
            toast({ title: 'Settings Saved' });
            setSettings(values);
        } else {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        }
    });
    setIsSettingsOpen(false);
  };

  const handleDelete = async (id: string) => {
     if (confirm('Are you sure you want to delete this link?')) {
        startDeletingTransition(async () => {
            dispatch({ type: 'delete', id });
            const result = await deleteLink(id);
            if (result.success) {
                toast({ title: 'Link Deleted' });
            } else {
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
            }
        });
     }
  };

  const copyToClipboard = (path: string, slug: string) => {
    const url = `${window.location.origin}${getFullShortUrl(path, slug)}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copied to Clipboard',
      description: url,
    });
  };

  const getFullShortUrl = (path: string, slug: string) => {
      if (path === '/') {
          return `/${slug}`;
      }
      return `/${path}/${slug}`;
  }

  const renderDesktopView = () => (
    <div className="border rounded-lg">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Short URL</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-24 inline-block" /></TableCell>
                </TableRow>
            ))
            ) : filteredLinks.length === 0 ? (
            <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                No links found. Try adjusting your search or filters.
                </TableCell>
            </TableRow>
            ) : (
            filteredLinks.map((link) => (
                <TableRow key={link.id} className={link.id.startsWith('temp-') || isDeleting ? 'opacity-50' : ''}>
                <TableCell className="font-medium">{getFullShortUrl(link.path || 'links', link.slug)}</TableCell>
                <TableCell className="max-w-xs truncate">
                    <a href={link.destination} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        {link.destination} <ExternalLink className="h-3 w-3" />
                    </a>
                </TableCell>
                <TableCell className="text-right">
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(link.path || 'links', link.slug)}
                    >
                    <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/links/analytics?id=${link.id}`)}
                    >
                        <BarChart2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShowQrCode(link)}
                    >
                        <QrCode className="h-4 w-4" />
                    </Button>
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(link)}
                    >
                    <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(link.id)}
                    >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </TableCell>
                </TableRow>
            ))
            )}
        </TableBody>
        </Table>
    </div>
  );
  
  const renderMobileView = () => (
    <div className="space-y-4">
        {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}><CardContent className='p-4'><Skeleton className="h-24 w-full" /></CardContent></Card>
            ))
        ) : filteredLinks.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
                No links found. Try adjusting your search or filters.
            </div>
        ) : (
            filteredLinks.map(link => (
                <Card key={link.id} className={link.id.startsWith('temp-') || isDeleting ? 'opacity-50' : ''}>
                    <CardContent className="p-4 flex justify-between items-start gap-4">
                        <div className="flex-grow space-y-2 overflow-hidden">
                            <p className="font-semibold truncate">{getFullShortUrl(link.path || 'links', link.slug)}</p>
                            <a href={link.destination} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground truncate flex items-center gap-1.5 hover:underline">
                               <ExternalLink className="h-3 w-3 flex-shrink-0"/> <span className="truncate">{link.destination}</span>
                            </a>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="-mr-2 flex-shrink-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => copyToClipboard(link.path || 'links', link.slug)}>
                                    <Copy className="mr-2 h-4 w-4" /> Copy
                                </DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => router.push(`/links/analytics?id=${link.id}`)}>
                                    <BarChart2 className="mr-2 h-4 w-4" /> Analytics
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShowQrCode(link)}>
                                    <QrCode className="mr-2 h-4 w-4" /> QR Code
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(link)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(link.id)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardContent>
                </Card>
            ))
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <LinkIcon />
                        URL Shortener
                    </CardTitle>
                    <CardDescription>
                    Create and manage your custom short links.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleAddNew}>Create New Link</Button>
                    <Button variant="outline" size="icon" onClick={() => setIsSettingsOpen(true)}>
                        <Settings />
                        <span className="sr-only">Settings</span>
                    </Button>
                    <form action={logout}>
                        <Button variant="outline" size="icon" type="submit">
                            <LogOut />
                            <span className="sr-only">Logout</span>
                        </Button>
                    </form>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 pt-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by slug or destination..."
                        className="pl-8 sm:w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={selectedPath} onValueChange={setSelectedPath}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by path" />
                    </SelectTrigger>
                    <SelectContent>
                        {uniquePaths.map(path => (
                            <SelectItem key={path} value={path}>
                                {path === 'all' ? 'All Paths' : path}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingLink ? 'Edit Link' : 'Create New Link'}
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[80vh] p-1">
                <div className='p-5'>
                    <LinkForm
                        existingLink={editingLink}
                        onSave={handleSave}
                        isSaving={isSaving}
                    />
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

           <SettingsDialog
                open={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
                onSave={handleSaveSettings}
                isSaving={isSaving}
                currentSettings={settings}
            />

           <QrCodeDialog 
                link={qrCodeLink}
                open={!!qrCodeLink}
                onOpenChange={() => setQrCodeLink(null)}
                getFullShortUrl={getFullShortUrl}
            />

            {isMobile ? renderMobileView() : renderDesktopView()}
        </CardContent>
      </Card>
    </div>
  );
}
