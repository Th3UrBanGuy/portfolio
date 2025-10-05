import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import type { ShortLink } from '@/lib/types';

async function getLink(slug: string): Promise<ShortLink | null> {
  const q = query(
    collection(db, 'short-links'),
    where('slug', '==', slug),
    limit(1)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as ShortLink;
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  if (!slug) {
    return notFound();
  }

  const link = await getLink(slug);

  if (link) {
    return NextResponse.redirect(link.destination);
  } else {
    // If the link is not found, redirect to a 404 page.
    // You can customize this to redirect to your main portfolio or another page.
    return notFound();
  }
}
