import React from 'react';
import { Users, Map, Shield, Mail } from 'lucide-react';

const AboutUs = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Community-Driven",
      description: "Join thousands of citizens helping make our roads safer through collaborative pothole reporting."
    },
    {
      icon: <Map className="w-8 h-8 text-blue-600" />,
      title: "Real-Time Mapping",
      description: "Our interactive map shows pothole locations and severity, updated in real-time by our community."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Data Verification",
      description: "Multiple reports and AI-powered analysis ensure accurate pothole identification."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About RoadWatch</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're revolutionizing road maintenance by empowering communities to identify and report infrastructure issues.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12 mb-16">
        {features.map((feature, index) => (
          <div key={index} className="text-center p-6 rounded-lg border border-gray-200">
            <div className="flex justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
        <div className="flex items-center justify-center gap-2">
          <Mail className="w-5 h-5" />
          <a href="mailto:contact@roadwatch.com" className="text-blue-600 hover:underline">
            contact@roadwatch.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;