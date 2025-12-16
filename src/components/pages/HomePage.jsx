import FeaturedBrands from '../common/FeaturedBrands.jsx';
import FeaturedWatches from '../common/FeaturedWatches.jsx';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <FeaturedBrands />
      <FeaturedWatches />
    </div>
  );
}
