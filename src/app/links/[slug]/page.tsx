import {
  collection,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import type { ShortLink } from '@/lib/types';

type Props = {
  params: { slug: string };
};

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

export default async function SlugRedirectPage({ params }: Props) {
  const { slug } = params;
  const link = await getLink(slug);

  if (link) {
    redirect(link.destination);
  } else {
    notFound();
  }
}
