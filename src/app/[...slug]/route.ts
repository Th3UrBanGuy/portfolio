'use server';

import { collection, query, where, getDocs, limit, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NextResponse, type NextRequest } from 'next/server';
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

function parseUserAgent(userAgent: string) {
    let browser = 'Unknown';
    let os = 'Unknown';

    if (/windows/i.test(userAgent)) os = 'Windows';
    else if (/macintosh|mac os x/i.test(userAgent)) os = 'macOS';
    else if (/android/i.test(userAgent)) os = 'Android';
    else if (/linux/i.test(userAgent)) os = 'Linux';
    else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';

    if (/chrome/i.test(userAgent) && !/edge|edg/i.test(userAgent)) browser = 'Chrome';
    else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari';
    else if (/firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/msie|trident/i.test(userAgent)) browser = 'Internet Explorer';
    else if (/edge|edg/i.test(userAgent)) browser = 'Edge';
    
    return { browser, os };
}


async function trackVisit(request: NextRequest, linkId: string) {
    try {
        const userAgent = request.headers.get('user-agent') || 'Unknown';
        const ip = request.ip || request.headers.get('x-forwarded-for') || 'Unknown';
        const { browser, os } = parseUserAgent(userAgent);
        
        let geo = {
            country: 'Unknown',
            city: 'Unknown',
            region: 'Unknown',
            isp: 'Unknown',
        };

        if (ip !== 'Unknown') {
            try {
                const response = await fetch(`https://ipinfo.tw/json?ip=${ip}`, {
                    headers: { 'User-Agent': 'curl/7.64.1' }
                });
                if (response.ok) {
                    const data = await response.json();
                    geo.country = data.country_name || 'Unknown';
                    geo.isp = data.as_desc || 'Unknown';
                }
            } catch (e) {
                console.error("IP info fetch failed:", e);
            }
        }

        const visitData = {
            timestamp: serverTimestamp(),
            ip,
            userAgent,
            browser,
            os,
            ...geo
        };

        const visitRef = doc(collection(db, `short-links/${linkId}/visits`));
        await setDoc(visitRef, visitData);

    } catch (error) {
        console.error('Error tracking visit:', error);
    }
}

export async function GET(
  request: NextRequest,
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

  // Start tracking visit in the background (don't await it)
  trackVisit(request, link.id);

  const destinationUrl = new URL(link.destination);
  const lockUrl = new URL('/links/lock', request.url);
  const loadingUrl = new URL('/loading', request.url);

  // If link is password protected
  if (link.password) {
    const encodedDestination = Buffer.from(destinationUrl.toString()).toString('base64');
    lockUrl.searchParams.set('destination_b64', encodedDestination);
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
