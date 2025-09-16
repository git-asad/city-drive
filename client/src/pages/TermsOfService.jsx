import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Please read these terms carefully before using our services
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
              <a href="#acceptance" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Acceptance
              </a>
              <a href="#services" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Services
              </a>
              <a href="#accounts" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Accounts
              </a>
              <a href="#liability" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Liability
              </a>
              <a href="#contact" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Contact
              </a>
            </div>
          </nav>

          {/* Terms Sections */}
          <div className="space-y-12">
            <section id="acceptance">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing and using City Drive's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section id="services">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                2. Description of Service
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                City Drive provides luxury car rental services through our website and mobile applications. Our services include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6">
                <li>Online vehicle reservation and booking</li>
                <li>Vehicle pickup and delivery services</li>
                <li>Customer support and assistance</li>
                <li>Insurance and protection services</li>
                <li>Additional driver services</li>
              </ul>
            </section>

            <section id="accounts">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                3. User Accounts
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Creation</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                To use certain features of our service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6 mb-6">
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Be responsible for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Termination</h3>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to terminate or suspend your account at our discretion, with or without notice, for any violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                4. Rental Terms
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Vehicle Usage</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                All vehicles must be used in accordance with applicable laws and our rental policies. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6 mb-6">
                <li>Operate vehicles safely and responsibly</li>
                <li>Not use vehicles for illegal purposes</li>
                <li>Not modify or alter vehicle equipment</li>
                <li>Return vehicles in the same condition</li>
                <li>Report any accidents or damages immediately</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Payment Terms</h3>
              <p className="text-gray-700 leading-relaxed">
                All rentals require valid payment method authorization. Payments are processed according to our pricing structure and include applicable taxes and fees.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                5. Insurance and Liability
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Important Insurance Information</h4>
                <p className="text-blue-800">
                  While we provide comprehensive insurance coverage, you remain responsible for damages caused by negligent operation, violation of rental terms, or illegal use of the vehicle.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Insurance Coverage</h3>
              <p className="text-gray-700 leading-relaxed mb-4">Our rental packages include:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6 mb-6">
                <li>Collision damage waiver (CDW)</li>
                <li>Theft protection</li>
                <li>Third-party liability coverage</li>
                <li>Personal accident insurance</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Damage Responsibility</h3>
              <p className="text-gray-700 leading-relaxed mb-4">You are responsible for:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6">
                <li>Loss or damage due to negligence</li>
                <li>Interior damage from smoking or pets</li>
                <li>Damage from off-road use</li>
                <li>Loss of vehicle keys or documents</li>
                <li>Fines for traffic violations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                6. Cancellation and Refund Policy
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cancellation Terms</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6 mb-6">
                <li>Free cancellation up to 24 hours before pickup</li>
                <li>50% refund for cancellations within 24 hours</li>
                <li>No refund for no-shows or early returns</li>
                <li>Special terms may apply for long-term rentals</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Refund Processing</h3>
              <p className="text-gray-700 leading-relaxed">
                Refunds are processed within 5-7 business days to the original payment method. Processing times may vary by financial institution.
              </p>
            </section>

            <section id="liability">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                7. Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                City Drive's liability is limited to the extent permitted by law. We are not liable for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits or business interruption</li>
                <li>Data loss or corruption</li>
                <li>Third-party claims or disputes</li>
                <li>Force majeure events beyond our control</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                8. Privacy and Data Protection
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy for detailed information about how we collect, use, and protect your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                9. Governing Law
              </h2>
              <p className="text-gray-700 leading-relaxed">
                These terms are governed by and construed in accordance with the laws of the jurisdiction in which the rental agreement is executed, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                10. Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of the modified terms.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
                11. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                If you have any questions about these Terms of Service, please contact us:
              </p>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Support</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong className="text-gray-900">Email:</strong>
                    <p className="text-gray-700">support@citydrive.com</p>
                  </div>
                  <div>
                    <strong className="text-gray-900">Phone:</strong>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                  <div className="md:col-span-2">
                    <strong className="text-gray-900">Address:</strong>
                    <p className="text-gray-700">123 Luxury Lane, New York, NY 10001</p>
                  </div>
                  <div className="md:col-span-2">
                    <strong className="text-gray-900">Hours:</strong>
                    <p className="text-gray-700">Mon-Fri: 9AM-6PM EST</p>
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

export default TermsOfService;