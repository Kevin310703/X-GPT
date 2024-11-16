import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faBolt, faLightbulb } from '@fortawesome/free-solid-svg-icons';

export async function generateMetadata() {
  return {
    title: "About Us",
    description: `This is the about us page.`,
  };
}

export default function InformationPage() {
  return (
    <div className="p-6 bg-white from-gray-100 to-white min-h-screen">
      <section className="text-center">
        <h1 className="text-4xl font-extrabold text-indigo-600">
          Welcome to <span className="text-blue-500">X-GPT</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          X-GPT is an advanced AI-powered platform that leverages cutting-edge technologies to provide seamless
          chatbot experiences, powerful text generation, and image creation capabilities.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Why Choose <span className="text-indigo-600">X-GPT?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto">
              <FontAwesomeIcon icon={faBolt} className="text-indigo-500 text-4xl" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-800">AI-Powered Solutions</h3>
            <p className="mt-2 text-gray-600">
              Leverage state-of-the-art AI to generate text, answer queries, and create images.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto">
              <FontAwesomeIcon icon={faLightbulb} className="text-indigo-500 text-4xl" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-800">Fast & Reliable</h3>
            <p className="mt-2 text-gray-600">
              Get results in seconds with our optimized processing and real-time capabilities.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto">
              <FontAwesomeIcon icon={faShieldAlt} className="text-indigo-500 text-4xl" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-800">Secure & Private</h3>
            <p className="mt-2 text-gray-600">
              Your data is protected with the highest security standards to ensure privacy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
