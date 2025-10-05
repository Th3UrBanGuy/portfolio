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
    // Fallback for old links that don't have a path field
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
            // check if path field exists to avoid infinite loops
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
    // This could be an old link like /links/{slug} being treated as path=slug
    // Or it could be a new root link path=/, slug=...
    // We will assume for now it's a root link if there is only one segment
    path = '/';
    slug = slugSegments[0];
  } else {
    [path, slug] = slugSegments;
  }


  const link = await getLink(path, slug);

  if (link && link.destination) {
    return NextResponse.redirect(link.destination);
  } else {
    return notFound();
  }
}
