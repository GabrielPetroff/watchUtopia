import FeauturedBrands from './FeauteredBrands.jsx';
import Carousel from './Carousel.jsx';
import FeauteredWatches from './FeauteredWatches.jsx';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <FeauturedBrands />
      <Carousel />
      <FeauteredWatches />
    </div>
  );
}
