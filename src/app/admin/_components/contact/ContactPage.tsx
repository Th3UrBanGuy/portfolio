'use client';

import { useState, useEffect } from 'react';
import { getPortfolioData, getDocumentData } from '@/lib/placeholder-data';
import { ContactForm } from '@/app/admin/contact/components';
import { TitleForm } from '@/app/admin/contact/components/TitleForm';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ContactDetails, Social, CustomLink, PageTitle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type AdminView = 'dashboard' | 'profile' | 'education' | 'skills' | 'experience' | 'achievements' | 'projects' | 'contact' | 'security';

type ContactPageProps = {
  setActiveView: (view: AdminView) => void;
};

export default function ContactPage({ setActiveView }: ContactPageProps) {
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);
  const [socials, setSocials] = useState<Social[]>([]);
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const [titles, setTitles] = useState({ pageTitle: '', tocTitle: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [portfolioData, titleData] = await Promise.all([
        getPortfolioData(),
        getDocumentData<PageTitle>('page-titles', 'contact'),
      ]);
      setContactDetails(portfolioData.contactDetails);
      setSocials(portfolioData.socials);
      setCustomLinks(portfolioData.customLinks);
      setTitles({
        pageTitle: titleData?.pageTitle ?? 'Contact',
        tocTitle: titleData?.tocTitle ?? 'Contact',
      });
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage Contact &amp; Socials</CardTitle>
                <CardDescription>
                    Update your contact information and social media presence.
                </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => setActiveView('dashboard')}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </CardHeader>
      </Card>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <>
            <TitleForm pageTitle={titles.pageTitle} tocTitle={titles.tocTitle} />
            <ContactForm
            contactDetails={contactDetails}
            socials={socials}
            customLinks={customLinks}
            />
        </>
      )}
    </div>
  );
}