'use server';

import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import type { ShortLink } from '@/lib/types';

async function getLink(path: string, slug: string): Promise<ShortLink | null> {
  const q = query(
    collection(db, 'short-links'),
    where('path', '==', path),
    where('slug', '==', slug),
    limit(1)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    if (path === 'links') {
        const oldQuery = query(
            collection(db, 'short-links'),
            where('slug', '==', slug),
            limit(1)
        );
        const oldQuerySnapshot = await getDocs(oldQuery);
        if (!oldQuerySnapshot.empty) {
            const doc = oldQuerySnapshot.docs[0];
            const data = doc.data();
            if (!data.path) {
                return { id: doc.id, ...data } as ShortLink;
            }
        }
    }
    return null;
  }

  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as ShortLink;
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  const slugSegments = params.slug;

  if (!slugSegments || slugSegments.length < 1 || slugSegments.length > 2) {
    return notFound();
  }
  
  let path: string;
  let slug: string;

  if (slugSegments.length === 1) {
    path = '/';
    slug = slugSegments[0];
  } else {
    [path, slug] = slugSegments;
  }

  const link = await getLink(path, slug);

  if (!link) {
    return notFound();
  }

  const destinationUrl = new URL(link.destination);
  const lockUrl = new URL('/links/lock', request.url);
  const loadingUrl = new URL('/loading', request.url);

  // If link is password protected
  if (link.password) {
    lockUrl.searchParams.set('destination', destinationUrl.toString());
    lockUrl.searchParams.set('id', link.id);
    return NextResponse.redirect(lockUrl);
  }

  // If link has a loading screen
  if (link.loading_text && link.loading_duration_seconds) {
    loadingUrl.searchParams.set('destination', destinationUrl.toString());
    loadingUrl.searchParams.set('text', link.loading_text);
    loadingUrl.searchParams.set('duration', link.loading_duration_seconds.toString());
    return NextResponse.redirect(loadingUrl);
  }

  // Standard redirect
  return NextResponse.redirect(destinationUrl);
}
