import React from 'react';

const About = () => {
  const stats = [
    { number: '5000+', label: 'Happy Customers' },
    { number: '1000+', label: 'Luxury Vehicles' },
    { number: '50+', label: 'Locations Worldwide' },
    { number: '24/7', label: 'Customer Support' }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: '👩‍💼',
      bio: 'With over 15 years in luxury automotive services, Sarah leads our vision for exceptional car rental experiences.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      image: '👨‍💼',
      bio: 'Michael ensures every vehicle meets our premium standards and every customer receives world-class service.'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Customer Experience Director',
      image: '👩‍💻',
      bio: 'Emma and her team are dedicated to making every rental experience memorable and stress-free.'
    }
  ];

  const values = [
    {
      icon: '🏆',
      title: 'Excellence',
      description: 'We maintain the highest standards in vehicle quality, service, and customer satisfaction.'
    },
    {
      icon: '🤝',
      title: 'Trust',
      description: 'Building lasting relationships through transparency, reliability, and honest communication.'
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'Continuously improving our services with the latest technology and industry best practices.'
    },
    {
      icon: '🌍',
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices and reducing our environmental impact.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About City Drive
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto">
              Redefining luxury car rental with premium vehicles, exceptional service, and unforgettable experiences since 2010.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Founded in 2010, City Drive began with a simple mission: to provide luxury car rental experiences
                  that exceed expectations. What started as a small operation in downtown New York has grown into
                  a global network of premium vehicle rentals.
                </p>
                <p>
                  We believe that every journey should be extraordinary. Whether you're planning a special occasion,
                  conducting business travel, or simply want to experience the thrill of driving a luxury vehicle,
                  we're here to make it happen.
                </p>
                <p>
                  Our commitment to excellence drives everything we do. From our meticulously maintained fleet of
                  high-end vehicles to our dedicated customer service team, we strive to deliver unparalleled
                  experiences that create lasting memories.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <div className="text-8xl">🏢</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our business and shape every customer interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate professionals dedicated to making your luxury car rental experience exceptional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-indigo-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto mb-8">
            To revolutionize the car rental industry by providing unparalleled luxury experiences,
            exceptional customer service, and innovative solutions that make every journey memorable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Customer First</h3>
              <p className="opacity-90">Every decision we make prioritizes our customers' needs and satisfaction.</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Quality Excellence</h3>
              <p className="opacity-90">We maintain the highest standards in everything we do, from vehicles to service.</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="opacity-90">We embrace new technologies and ideas to enhance your rental experience.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Experience Luxury?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who trust City Drive for their luxury car rental needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
              Browse Our Fleet
            </button>
            <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition-all duration-200">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;