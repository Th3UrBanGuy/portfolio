import { defaultPortfolioData } from '@/lib/placeholder-data';
import Flipbook from '@/components/flip-folio/Flipbook';

export default function Home() {
  return <Flipbook data={defaultPortfolioData} />;
}
