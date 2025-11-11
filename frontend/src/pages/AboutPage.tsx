import { Bus, MapPin, Clock, Info } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="bg-primary-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bus className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            About CatchMyBus
          </h1>
          <p className="text-xl text-gray-600">
            Making bus travel smarter and easier for Kerala
          </p>
        </div>

        {/* Mission */}
        <div className="card mb-8">
          <h2 className="section-title">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            CatchMyBus is a mobile-based intelligent bus time information system designed
            specifically for Kerala bus transportation. Our main purpose is to help users
            easily find accurate bus arrival times and bus availability between two bus stops.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We aim to reduce the difficulty faced by daily commuters, students, working
            professionals, and travellers who depend on public transportation and find it
            difficult to know exact bus timings in real-time.
          </p>
        </div>

        {/* Features */}
        <div className="mb-8">
          <h2 className="section-title text-center mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Real-Time Information</h3>
                  <p className="text-gray-600 text-sm">
                    Get accurate bus arrival times and live updates for your routes
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Route Visualization</h3>
                  <p className="text-gray-600 text-sm">
                    View routes on interactive maps with detailed stop information
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Bus className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Bus Type Filtering</h3>
                  <p className="text-gray-600 text-sm">
                    Filter by KSRTC, Private, Fast, Super Fast, and other bus types
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Info className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Fare Calculation</h3>
                  <p className="text-gray-600 text-sm">
                    Know the approximate fare before you board the bus
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Future Features */}
        <div className="card bg-gradient-to-br from-primary-50 to-accent-50">
          <h2 className="section-title">Coming Soon</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Live GPS tracking from KSRTC and private buses
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Delay and arrival notifications
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Voice assistant-based search
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Nearby bus stops suggestions
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Recent searches and favorite routes
            </li>
          </ul>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12 card bg-primary-600 text-white">
          <h2 className="text-2xl font-bold mb-4">Have Feedback?</h2>
          <p className="mb-6">
            Help us improve CatchMyBus by sharing your experience
          </p>
          <a
            href="mailto:info@catchmybus.com"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
