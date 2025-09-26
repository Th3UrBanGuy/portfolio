import { defaultPortfolioData } from '@/lib/placeholder-data';
import Flipbook from '@/components/flip-folio/Flipbook';

export default async function Home() {
  // Data is fetched on the server
  const portfolioData = defaultPortfolioData;

  return (
      <Flipbook data={portfolioData} />
  );
}
