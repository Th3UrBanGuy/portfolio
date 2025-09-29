import { getPortfolioData } from '@/lib/placeholder-data';
import { ContactForm } from './components';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function ContactPage() {
  const portfolioData = await getPortfolioData();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Contact &amp; Socials</CardTitle>
          <CardDescription>
            Update your contact information and social media presence.
          </CardDescription>
        </CardHeader>
      </Card>
      <ContactForm
        contactDetails={portfolioData.contactDetails}
        socials={portfolioData.socials}
        customLinks={portfolioData.customLinks}
      />
    </div>
  );
}
