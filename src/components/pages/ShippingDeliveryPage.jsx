import {
  Package,
  Truck,
  Shield,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function ShippingDeliveryPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F8FF' }}>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Shipping & Delivery</h1>
          <p className="text-xl text-indigo-100">
            Fast, secure, and fully insured delivery of your luxury timepieces
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Shipping Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div
            className=" p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            style={{ backgroundColor: '#F0F8FF' }}
          >
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Truck className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Fast Shipping
            </h3>
            <p className="text-gray-600">
              Express delivery options available. Most orders ship within 1-2
              business days.
            </p>
          </div>

          <div
            className=" p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            style={{ backgroundColor: '#F0F8FF' }}
          >
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Fully Insured
            </h3>
            <p className="text-gray-600">
              Every shipment is fully insured for the complete value of your
              purchase.
            </p>
          </div>

          <div
            className=" p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            style={{ backgroundColor: '#F0F8FF' }}
          >
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Worldwide Delivery
            </h3>
            <p className="text-gray-600">
              We ship to over 100 countries with secure international shipping
              options.
            </p>
          </div>
        </div>

        {/* Shipping Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Shipping Options
          </h2>
          <div className="space-y-6">
            <div
              className=" p-6 rounded-lg shadow-md border border-gray-200"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <div className="flex items-start gap-4">
                <Package className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Standard Shipping
                    </h3>
                    <span className="text-indigo-600 font-bold">
                      $25 / FREE over $500
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    $25 for orders under $500 • Free standard shipping on all
                    orders over $500
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Delivery: 5-7 business days (Domestic)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>Delivery: 10-14 business days (International)</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className=" p-6 rounded-lg shadow-md border border-gray-200"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <div className="flex items-start gap-4">
                <Truck className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Express Shipping
                    </h3>
                    <span className="text-indigo-600 font-bold">$50</span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Expedited delivery with signature required
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Delivery: 2-3 business days (Domestic)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>Delivery: 5-7 business days (International)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Our Delivery Process
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                1. Order Confirmed
              </h3>
              <p className="text-sm text-gray-600">
                Your order is verified and prepared for shipment
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                2. Secure Packaging
              </h3>
              <p className="text-sm text-gray-600">
                Watch is carefully packaged in luxury presentation box
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">3. In Transit</h3>
              <p className="text-sm text-gray-600">
                Track your package in real-time with updates
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">4. Delivered</h3>
              <p className="text-sm text-gray-600">
                Signature required for secure delivery
              </p>
            </div>
          </div>
        </div>

        {/* International Shipping */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            International Shipping
          </h2>
          <div
            className=" p-8 rounded-lg shadow-md border border-gray-200"
            style={{ backgroundColor: '#F0F8FF' }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Countries We Ship To
                </h3>
                <p className="text-gray-600 mb-4">
                  We proudly ship to over 100 countries worldwide, including:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    All European Union countries
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    United Kingdom, Canada, Australia
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Middle East and Asia Pacific
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Latin America and Caribbean
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Customs & Duties
                </h3>
                <p className="text-gray-600 mb-4">
                  Important information about international orders:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Buyers are responsible for all customs duties and import
                      taxes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>Customs fees vary by country and item value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>
                      All packages require proper customs documentation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>Contact us for specific country requirements</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Shipping FAQs
          </h2>
          <div className="space-y-4">
            <div
              className=" p-6 rounded-lg shadow-md border border-gray-200"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Can I track my order?
              </h3>
              <p className="text-gray-600">
                Yes! Once your order ships, you'll receive a tracking number via
                email. You can track your package in real-time through our
                website or the carrier's website.
              </p>
            </div>

            <div
              className=" p-6 rounded-lg shadow-md border border-gray-200"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                What if I'm not home for delivery?
              </h3>
              <p className="text-gray-600">
                Since signature is required for all luxury watch deliveries, the
                carrier will leave a notice and attempt redelivery. You can also
                arrange to pick up the package at a carrier facility or schedule
                a specific delivery time.
              </p>
            </div>

            <div
              className=" p-6 rounded-lg shadow-md border border-gray-200"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Is my shipment insured?
              </h3>
              <p className="text-gray-600">
                Absolutely. Every shipment is fully insured for the complete
                purchase value at no additional cost. In the unlikely event of
                loss or damage, you're completely protected.
              </p>
            </div>

            <div
              className=" p-6 rounded-lg shadow-md border border-gray-200"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Can I change my delivery address after ordering?
              </h3>
              <p className="text-gray-600">
                Contact us immediately if you need to change your delivery
                address. We can modify the address before shipment. Once
                shipped, address changes may be possible through the carrier
                depending on the delivery stage.
              </p>
            </div>

            <div
              className=" p-6 rounded-lg shadow-md border border-gray-200"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Do you ship to P.O. boxes?
              </h3>
              <p className="text-gray-600">
                Due to signature requirements and insurance policies, we cannot
                ship luxury watches to P.O. boxes. A physical street address is
                required for all deliveries.
              </p>
            </div>

            <div
              className=" p-6 rounded-lg shadow-md border border-gray-200"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                What happens if my package is delayed?
              </h3>
              <p className="text-gray-600">
                If your shipment is delayed beyond the estimated delivery date,
                please contact our customer service team. We'll work with the
                carrier to locate your package and ensure safe delivery as
                quickly as possible.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Have Questions About Shipping?
          </h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Our customer service team is here to help with any shipping or
            delivery questions.
          </p>
          <a
            href="/contact"
            className="inline-block text-indigo-600 font-semibold py-3 px-8 rounded-lg transition-colors"
            style={{ backgroundColor: '#F0F8FF' }}
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
