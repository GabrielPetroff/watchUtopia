import { useEffect } from 'react';
import FeaturedBrands from '../common/FeaturedBrands.jsx';
import FeaturedWatches from '../common/FeaturedWatches.jsx';

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col">
      <FeaturedBrands />
      <FeaturedWatches />
    </div>
  );
}
