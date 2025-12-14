import { Clock, Award, ShieldCheck, Heart, Globe, Users } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F8FF' }}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Welcome to Watch Utopia
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed">
            Your premier destination for luxury timepieces and exceptional
            craftsmanship
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Watch Utopia was founded with a singular vision: to create a
                haven for watch enthusiasts and collectors where quality,
                authenticity, and passion come together. We believe that a
                timepiece is more than just an instrument to tell time—it's a
                statement of style, a piece of history, and a work of art.
              </p>
              <p>
                Our carefully curated collection features the world's most
                prestigious brands, from iconic Swiss manufacturers like Rolex,
                Patek Philippe, and Omega to innovative independent watchmakers.
                Each piece in our collection is selected with meticulous
                attention to detail and authenticity.
              </p>
              <p>
                Whether you're a seasoned collector or purchasing your first
                luxury watch, Watch Utopia offers an unparalleled shopping
                experience backed by expertise, integrity, and a genuine love
                for horology.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="/fray-bekele-qVi94qiMhBU-unsplash.jpg"
              alt="Luxury watches collection"
              className="aspect-square rounded-2xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12 lg:mb-16">
            What We Stand For
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            <div
              className=" p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                Authenticity Guaranteed
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Every timepiece we offer is 100% authentic and comes with full
                documentation. We partner directly with authorized dealers and
                verify each watch's provenance.
              </p>
            </div>

            <div
              className=" p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                Premium Quality
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We curate only the finest timepieces from world-renowned
                manufacturers. Our collection represents the pinnacle of
                horological excellence and craftsmanship.
              </p>
            </div>

            <div
              className=" p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                Customer First
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Your satisfaction is our priority. We provide exceptional
                service, expert guidance, and comprehensive support throughout
                your watch-buying journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12 lg:mb-16">
          Why Choose Watch Utopia
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          <div
            className="flex gap-4 items-start p-6  rounded-xl shadow-md hover:shadow-lg transition-shadow"
            style={{ backgroundColor: '#F0F8FF' }}
          >
            <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Global Selection
              </h3>
              <p className="text-gray-700">
                Access to the world's most coveted watch brands and exclusive
                limited editions from across the globe.
              </p>
            </div>
          </div>

          <div
            className="flex gap-4 items-start p-6  rounded-xl shadow-md hover:shadow-lg transition-shadow"
            style={{ backgroundColor: '#F0F8FF' }}
          >
            <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Expert Consultation
              </h3>
              <p className="text-gray-700">
                Our team of watch specialists provides personalized
                recommendations and in-depth knowledge to help you find your
                perfect timepiece.
              </p>
            </div>
          </div>

          <div
            className="flex gap-4 items-start p-6  rounded-xl shadow-md hover:shadow-lg transition-shadow"
            style={{ backgroundColor: '#F0F8FF' }}
          >
            <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Secure Transactions
              </h3>
              <p className="text-gray-700">
                Shop with confidence using our secure payment system and
                comprehensive buyer protection policies.
              </p>
            </div>
          </div>

          <div
            className="flex gap-4 items-start p-6  rounded-xl shadow-md hover:shadow-lg transition-shadow"
            style={{ backgroundColor: '#F0F8FF' }}
          >
            <div className="bg-indigo-100 p-3 rounded-lg flex-shrink-0">
              <Award className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Warranty & Service
              </h3>
              <p className="text-gray-700">
                All watches come with manufacturer warranties and access to
                authorized service centers worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            Begin Your Watch Journey Today
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed">
            Explore our carefully curated collection of luxury timepieces and
            find the watch that speaks to your style and passion.
          </p>
          <a
            href="/products"
            className="inline-block text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors shadow-lg"
            style={{ backgroundColor: '#F0F8FF' }}
          >
            Browse Our Collection
          </a>
        </div>
      </section>
    </div>
  );
}
