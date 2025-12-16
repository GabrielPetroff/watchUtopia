import FeaturedBrands from './FeaturedBrands.jsx';
import FeaturedWatches from './FeaturedWatches.jsx';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <FeaturedBrands />
      <FeaturedWatches />
    </div>
  );
}
