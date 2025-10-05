'use client';

import { useState, useEffect, useOptimistic, useTransition } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LinkForm } from './components/LinkForm';
import { ShortLink } from '@/lib/types';
import { Trash2, Edit, Copy, ExternalLink, Link as LinkIcon, LogOut, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logout, saveLink } from './actions';
import { Skeleton } from '@/components/ui/skeleton';


type Action = 
    | { type: 'add'; link: ShortLink }
    | { type: 'update'; link: ShortLink }
    | { type: 'delete'; id: string };


function optimisticReducer(state: ShortLink[], action: Action): ShortLink[] {
    switch (action.type) {
        case 'add':
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
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ShortLink | null>(null);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [optimisticLinks, dispatch] = useOptimistic(links, optimisticReducer);

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
    return () => unsubscribe();
  }, [toast]);

  const handleEdit = (link: ShortLink) => {
    setEditingLink(link);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingLink(null);
    setIsFormOpen(true);
  };

  const handleSave = async (values: Omit<ShortLink, 'createdAt'>) => {
    const isUpdating = !!values.id;
    const optimisticLink: ShortLink = {
        ...values,
        id: values.id || `temp-${Date.now()}`,
        createdAt: new Date(),
    };

    startTransition(async () => {
        dispatch({ type: isUpdating ? 'update' : 'add', link: optimisticLink });
        const result = await saveLink(values);
        if (result.success) {
            toast({ title: isUpdating ? 'Link Updated' : 'Link Created' });
        } else {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
            // Revert state by re-fetching (onSnapshot will handle this)
        }
    });
    setIsFormOpen(false);
  };

  const handleDelete = async (id: string) => {
     if (confirm('Are you sure you want to delete this link?')) {
        startTransition(async () => {
            dispatch({ type: 'delete', id });
            try {
                await deleteDoc(doc(db, 'short-links', id));
                toast({ title: 'Link Deleted' });
            } catch (error) {
                toast({ title: 'Error', description: 'Failed to delete link.', variant: 'destructive' });
            }
        });
     }
  };

  const copyToClipboard = (slug: string) => {
    const url = `${window.location.origin}/links/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copied to Clipboard',
      description: url,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
                <LinkIcon />
                URL Shortener
            </CardTitle>
            <CardDescription>
              Create and manage your custom short links.
            </CardDescription>
          </div>
           <div className="flex gap-2">
            <Button onClick={handleAddNew}>Create New Link</Button>
            <form action={logout}>
                <Button variant="outline" size="icon" type="submit">
                    <LogOut />
                </Button>
            </form>
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
              <LinkForm
                existingLink={editingLink}
                onSave={handleSave}
                isSaving={isPending}
              />
            </DialogContent>
          </Dialog>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slug</TableHead>
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
                ) : optimisticLinks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      No links found. Create one to get started!
                    </TableCell>
                  </TableRow>
                ) : (
                  optimisticLinks.map((link) => (
                    <TableRow key={link.id} className={link.id.startsWith('temp-') ? 'opacity-50' : ''}>
                      <TableCell className="font-medium">/links/{link.slug}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        <a href={link.destination} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                            {link.destination} <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(link.slug)}
                        >
                          <Copy className="h-4 w-4" />
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
        </CardContent>
      </Card>
    </div>
  );
}
