import React from "react";

const Privacy = () => {
  return (
    <div className="flex justify-center bg-gray-50 py-6 px-3 sm:py-10 sm:px-6 lg:px-8">
      {/* Outer Border Box */}
      <div className="w-full max-w-4xl border border-[#002b20] rounded-xl p-6 sm:p-10 bg-white text-[#002b20] shadow-sm">
        
        {/* Heading */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center uppercase tracking-wider mb-8 sm:mb-10">
          Privacy Policy
          <div className="border-b border-[#002b20] w-32 sm:w-48 mx-auto mt-2"></div>
        </h1>

        {/* Sections */}
        <div className="space-y-8 sm:space-y-12 text-sm sm:text-base md:text-lg leading-relaxed">
          
          {/* Introduction */}
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase text-center mb-3 sm:mb-4">Introduction</h2>
            <p className="text-center">
              Welcome to StayAtlas. We value the trust you place in us and are committed to 
              maintaining the highest standards of security and privacy. By accessing or using 
              our website or services, you expressly consent to the collection, use, and 
              disclosure of your personal information as described in this policy.
            </p>
          </div>

          {/* Applicability */}
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase text-center mb-3 sm:mb-4">Applicability</h2>
            <p className="text-center">
              This policy applies to StayAtlas and governs our data collection and usage practices.
            </p>
          </div>

          {/* Updates */}
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase text-center mb-3 sm:mb-4">Updates to Policy</h2>
            <p className="text-center">
              This Privacy Policy may be updated at any time. Please revisit this page regularly to stay informed about any changes.
            </p>
          </div>

          {/* Information We Collect */}
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase text-center mb-3 sm:mb-4">Information We Collect</h2>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2">
              <li>
                <span className="font-semibold">Voluntarily provided:</span> Name, gender, email, phone, billing address, payment details, and account credentials.
              </li>
              <li>
                <span className="font-semibold">Automatically collected:</span> IP address, browser type, device type, OS, usage behavior, and cookies for analytics.
              </li>
            </ul>
          </div>

          {/* Cookies */}
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase text-center mb-3 sm:mb-4">Cookies and Tracking</h2>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2">
              <li>Enhance user experience (e.g., remembering login details)</li>
              <li>Analyze traffic and improve site usability</li>
              <li>Deliver targeted advertisements (when applicable)</li>
            </ul>
            <p className="text-center mt-2 sm:mt-3">
              You may adjust your browser settings to manage or block cookies; however, this may affect site functionality.
            </p>
          </div>

          {/* Use of Info */}
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase text-center mb-3 sm:mb-4">Use of Your Information</h2>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2">
              <li>Processing bookings and payments</li>
              <li>Communicating with you regarding reservations or account</li>
              <li>Improving our services through analytics and insights</li>
              <li>Preventing fraud and ensuring website security</li>
              <li>Complying with legal obligations and enforcing Terms & Conditions</li>
            </ul>
          </div>

          {/* Sharing Info */}
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase text-center mb-3 sm:mb-4">Sharing of Information</h2>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2">
              <li>Service providers (payments, customer support, analytics, marketing)</li>
              <li>Legal/regulatory authorities when required</li>
              <li>Advertisers (only when you engage with third-party ads)</li>
            </ul>
          </div>

          {/* Data Retention */}
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase text-center mb-3 sm:mb-4">Data Retention</h2>
            <p className="text-center">
              We retain personal information only as long as necessary to fulfill the purposes outlined, comply with legal obligations, resolve disputes, and enforce agreements.
            </p>
          </div>

          {/* Your Rights */}
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase text-center mb-3 sm:mb-4">Your Rights</h2>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2">
              <li>Access and obtain copies of your data</li>
              <li>Correct or update inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent or object to processing</li>
            </ul>
            <p className="text-center mt-2 sm:mt-3">To exercise your rights, please contact us using the details below.</p>
          </div>

          {/* Security */}
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase text-center mb-3 sm:mb-4">Security</h2>
            <p className="text-center">
              We implement industry-standard safeguards to protect your personal information. However, no method of data transmission or storage is completely secure, and absolute security cannot be guaranteed.
            </p>
          </div>

          {/* Children's Privacy */}
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase text-center mb-3 sm:mb-4">Children's Privacy</h2>
            <p className="text-center">
              Our services are not intended for individuals under 18. We do not knowingly collect personal data from minors. If we become aware of such data, we will delete it promptly.
            </p>
          </div>

          {/* Data Transfers */}
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase text-center mb-3 sm:mb-4">International Data Transfers</h2>
            <p className="text-center">
              If you are located outside the jurisdiction of StayAtlas, such transfers will be conducted in compliance with applicable laws and safeguards.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase text-center mb-3 sm:mb-4">Contact Us</h2>
            <p className="text-center mb-2">For any questions or to exercise your privacy rights:</p>
            <p className="font-bold text-center">stayatlasin@gmail.com</p>
          </div>

          {/* Address */}
          <div className="text-center text-xs sm:text-sm md:text-base">
            <p>Address: Office Number 620, Ijmima Complex, near Infiniti Mall Malad, Malad West, Mumbai, Maharashtra 400064</p>
            <p>Email: stayatlasin@gmail.com</p>
            <p>Phone: +91 85911 31447</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
