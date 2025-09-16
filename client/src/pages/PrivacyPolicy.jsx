import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              How we collect, use, and protect your personal information
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Navigation */}
          <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#collection" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Data Collection
              </a>
              <a href="#usage" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Data Usage
              </a>
              <a href="#sharing" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Data Sharing
              </a>
              <a href="#rights" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Your Rights
              </a>
              <a href="#contact" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Contact
              </a>
            </div>
          </nav>

          {/* Privacy Sections */}
          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At City Drive, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our car rental services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This policy applies to all users of our website, mobile applications, and related services. By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section id="collection">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                Information We Collect
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect personal information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6 mb-6">
                <li>Name, email address, and phone number</li>
                <li>Driver's license and identification details</li>
                <li>Billing and payment information</li>
                <li>Emergency contact information</li>
                <li>Vehicle preferences and rental history</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We automatically collect certain information when you use our services:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6 mb-6">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information and screen resolution</li>
                <li>Usage patterns and preferences</li>
                <li>Cookies and tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Booking and Transaction Data</h3>
              <p className="text-gray-700 leading-relaxed">
                When you make a reservation or complete a transaction:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6">
                <li>Rental dates, locations, and vehicle details</li>
                <li>Payment method and transaction history</li>
                <li>Communication records and support tickets</li>
                <li>Vehicle damage reports and insurance claims</li>
              </ul>
            </section>

            <section id="usage">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                How We Use Your Information
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Provision</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6 mb-6">
                <li>Process and complete your rental reservations</li>
                <li>Verify your identity and eligibility to rent</li>
                <li>Communicate about your bookings and services</li>
                <li>Provide customer support and assistance</li>
                <li>Process payments and manage billing</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Improvement</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6 mb-6">
                <li>Analyze usage patterns and improve our services</li>
                <li>Develop new features and functionality</li>
                <li>Conduct research and statistical analysis</li>
                <li>Monitor service performance and reliability</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal and Security</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6">
                <li>Prevent fraud and unauthorized access</li>
                <li>Comply with legal obligations and regulations</li>
                <li>Protect our rights and the rights of others</li>
                <li>Investigate and resolve disputes or issues</li>
              </ul>
            </section>

            <section id="sharing">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                Information Sharing and Disclosure
              </h2>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Important Notice</h4>
                <p className="text-blue-800">
                  We do not sell, trade, or rent your personal information to third parties for marketing purposes. Your data is used solely to provide and improve our services.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Providers</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may share your information with trusted third-party service providers who assist us in:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6 mb-6">
                <li>Payment processing and financial services</li>
                <li>Vehicle maintenance and inspection</li>
                <li>Insurance and claims processing</li>
                <li>Customer support and communication</li>
                <li>Website hosting and technical support</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Requirements</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may disclose your information when required by law or to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6 mb-6">
                <li>Comply with legal obligations or court orders</li>
                <li>Protect against fraud or illegal activity</li>
                <li>Safeguard the rights and safety of our users</li>
                <li>Investigate security breaches or violations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Transfers</h3>
              <p className="text-gray-700 leading-relaxed">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity, subject to the same privacy protections outlined in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                We implement comprehensive security measures to protect your personal information:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 mb-6">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="border border-gray-300 px-4 py-3 text-left">Security Measure</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">Encryption</td>
                      <td className="border border-gray-300 px-4 py-3">All data transmitted and stored using industry-standard encryption</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">Access Controls</td>
                      <td className="border border-gray-300 px-4 py-3">Strict access controls and authentication requirements</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">Regular Audits</td>
                      <td className="border border-gray-300 px-4 py-3">Regular security audits and vulnerability assessments</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">Employee Training</td>
                      <td className="border border-gray-300 px-4 py-3">Ongoing security awareness training for all staff</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">Incident Response</td>
                      <td className="border border-gray-300 px-4 py-3">Established procedures for responding to security incidents</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6 mb-4">
                <li>Provide our services and fulfill your requests</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Resolve disputes and enforce our agreements</li>
                <li>Maintain accurate business and financial records</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Booking and transaction data is typically retained for 7 years for tax and legal compliance purposes. Account data is retained until you request deletion, subject to legal requirements.
              </p>
            </section>

            <section id="rights">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                Your Privacy Rights
              </h2>

              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  You have the following rights regarding your personal information:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-600">
                    <h4 className="font-semibold text-gray-900 mb-2">Access</h4>
                    <p className="text-gray-700 text-sm">Request a copy of the personal information we hold about you</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-600">
                    <h4 className="font-semibold text-gray-900 mb-2">Correction</h4>
                    <p className="text-gray-700 text-sm">Request correction of inaccurate or incomplete information</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-600">
                    <h4 className="font-semibold text-gray-900 mb-2">Deletion</h4>
                    <p className="text-gray-700 text-sm">Request deletion of your personal information, subject to legal requirements</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-600">
                    <h4 className="font-semibold text-gray-900 mb-2">Portability</h4>
                    <p className="text-gray-700 text-sm">Request transfer of your data in a structured, machine-readable format</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-600">
                    <h4 className="font-semibold text-gray-900 mb-2">Restriction</h4>
                    <p className="text-gray-700 text-sm">Request limitation of how we process your information</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-600">
                    <h4 className="font-semibold text-gray-900 mb-2">Objection</h4>
                    <p className="text-gray-700 text-sm">Object to processing based on legitimate interests or direct marketing</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Exercise Your Rights</h3>
              <p className="text-gray-700 leading-relaxed">
                To exercise any of these rights, please contact us using the information provided below. We will respond to your request within 30 days and may require verification of your identity.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                Cookies and Tracking
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookie Usage</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6 mb-6">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand user behavior and improve services</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with your consent)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookie Management</h3>
              <p className="text-gray-700 leading-relaxed">
                You can control cookie settings through your browser preferences. However, disabling certain cookies may affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                International Data Transfers
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                Children's Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected such information, we will take steps to delete it.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                Changes to This Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                Contact Us
              </h2>

              <div className="bg-indigo-600 text-white p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Privacy Inquiries</h3>
                <p className="mb-6 opacity-90">
                  If you have any questions about this Privacy Policy or our data practices, please contact our Data Protection Officer:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <strong className="block mb-1">Email</strong>
                    <span className="opacity-90">privacy@citydrive.com</span>
                  </div>
                  <div className="text-center">
                    <strong className="block mb-1">Phone</strong>
                    <span className="opacity-90">+1 (555) 123-4567</span>
                  </div>
                  <div className="text-center md:col-span-2">
                    <strong className="block mb-1">Address</strong>
                    <span className="opacity-90">123 Luxury Lane, New York, NY 10001</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            Last updated: January 15, 2024
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;