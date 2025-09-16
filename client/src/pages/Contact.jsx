import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the data to your backend
      // For now, we'll simulate the submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      setNotification({
        type: 'success',
        message: 'Thank you for contacting us! We\'ll get back to you within 24 hours.'
      });

      // Reset form
      setFormData({
        name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
        email: user?.email || '',
        subject: '',
        message: ''
      });

    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className={`p-4 rounded-lg shadow-lg border-l-4 flex items-center gap-3 ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-800'
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <span className="text-xl">
              {notification.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="flex-1 text-sm">{notification.message}</span>
            <button
              onClick={closeNotification}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Get in touch with our luxury car rental experts. We're here to make your journey exceptional.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Phone Support</h3>
              <p className="text-indigo-600 font-semibold text-lg mb-2">+1 (555) 123-4567</p>
              <p className="text-gray-600 mb-1">24/7 Customer Service</p>
              <p className="text-gray-600">Available for immediate assistance</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Email Support</h3>
              <p className="text-indigo-600 font-semibold text-lg mb-2">support@citydrive.com</p>
              <p className="text-gray-600 mb-1">Response within 2 hours</p>
              <p className="text-gray-600">Detailed inquiries and booking assistance</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Visit Our Office</h3>
              <p className="text-indigo-600 font-semibold text-lg mb-2">123 Luxury Lane</p>
              <p className="text-gray-600 mb-1">New York, NY 10001</p>
              <p className="text-gray-600">Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Send us a Message</h2>
              <p className="text-gray-600 mb-8 text-center">
                Have questions about our services? Need help with a booking? We're here to help!
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="booking">Booking Inquiry</option>
                    <option value="pricing">Pricing Questions</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      Send Message
                    </>
                  )}
                </button>

                <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                  <span>🔒</span>
                  <span>Your information is secure and will never be shared</span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 mb-12">Find quick answers to common questions about our services</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>🚗</span>
                What types of vehicles do you offer?
              </h3>
              <p className="text-gray-600">
                We offer a premium fleet including luxury sedans, SUVs, sports cars, and electric vehicles from top brands like BMW, Mercedes, Porsche, and Tesla.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>💰</span>
                What are your rental rates?
              </h3>
              <p className="text-gray-600">
                Our rates start from $89/day for economy vehicles and go up to $450/day for luxury and sports cars. All rates include insurance and GPS.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>📅</span>
                What's your minimum rental period?
              </h3>
              <p className="text-gray-600">
                Our minimum rental period is 24 hours, but we offer flexible terms for longer rentals with discounted daily rates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>🛡️</span>
                Is insurance included?
              </h3>
              <p className="text-gray-600">
                Yes, all our rentals include comprehensive insurance coverage with zero deductible options available for additional peace of mind.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>📍</span>
                Where can I pick up my rental car?
              </h3>
              <p className="text-gray-600">
                We offer pickup from major airports, downtown locations, and can arrange delivery to your hotel or residence in most metropolitan areas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>🔄</span>
                Can I modify or cancel my booking?
              </h3>
              <p className="text-gray-600">
                You can modify your booking up to 24 hours before pickup at no charge. Cancellations made within 24 hours may incur a fee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;