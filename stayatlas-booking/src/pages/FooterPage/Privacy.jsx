import React from 'react'

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d4af75] to-[#0e3226] text-white py-8">
      <div className="max-w-[90%] mx-auto my-5 p-5 md:p-8 bg-black bg-opacity-70 rounded-lg shadow-md animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-bold mb-5 text-center text-white animate-slideIn">PRIVACY POLICY</h1>

        {/* INTRODUCTION */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mt-6 text-white text-center animate-fadeInUp">INTRODUCTION</h2>
          <p className="mb-5 animate-fadeInUp text-center">
            Welcome to StayAtlas. We value the trust you place in us and are committed to maintaining the highest standards of security and privacy. By accessing or using our website or services, you expressly consent to the collection, use, and disclosure of your personal information as described in this policy.
          </p>
        </div>

       
        
        {/* APPLICABILITY */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mt-6 text-white text-center animate-fadeInUp">APPLICABILITY</h2>
          <p className="mb-5 animate-fadeInUp text-center">
            This policy applies to StayAtlas and governs our data collection and usage practices.
          </p>
        </div>

        {/* UPDATES TO POLICY */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mt-6 text-white text-center animate-fadeInUp">UPDATES TO POLICY</h2>
          <p className="mb-5 animate-fadeInUp text-center">
            This Privacy Policy may be updated at any time. Please revisit this page regularly to stay informed about any changes.
          </p>
        </div>

        {/* INFORMATION WE COLLECT */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mt-6 text-white text-center animate-fadeInUp">INFORMATION WE COLLECT</h2>
          <ul className="list-none ml-0 mb-5 text-left">
            <li className="mb-2 animate-fadeInUp">
              <span className="font-bold">- Voluntarily provided (when you make a reservation or interact with us):</span>
              <ul className="list-disc ml-6">
                <li>Name, gender, email address, phone number, billing address</li>
                <li>Payment details (e.g., credit/debit card, bank information)</li>
                <li>Account credentials, if you register</li>
              </ul>
            </li>
            <li className="mb-2 animate-fadeInUp">
              <span className="font-bold">- Automatically collected data:</span>
              <ul className="list-disc ml-6">
                <li>IP address, browser type, device type, operating system, and usage behavior</li>
                <li>Cookies and similar technologies to analyze trends, administer the site, track user movements, and gather demographic information</li>
              </ul>
            </li>
          </ul>
        </div>
        
        {/* COOKIES AND TRACKING */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mt-6 text-white text-center animate-fadeInUp">COOKIES AND TRACKING</h2>
          <ul className="list-disc ml-6 mb-5">
            <li className="mb-2 animate-fadeInUp">Enhance user experience (e.g., remembering login details)</li>
            <li className="mb-2 animate-fadeInUp">Analyze traffic and improve site usability</li>
            <li className="mb-2 animate-fadeInUp">Deliver targeted advertisements (when applicable)</li>
          </ul>
          <p className="mb-5 animate-fadeInUp text-center">
            You may adjust your browser settings to manage or block cookies; however, this may affect site functionality.
          </p>
        </div>

        {/* USE OF YOUR INFORMATION */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mt-6 text-white text-center animate-fadeInUp">USE OF YOUR INFORMATION</h2>
          <p className="mb-2 animate-fadeInUp text-center">We use collected information for purposes including, but not limited to:</p>
          <ul className="list-disc ml-6 mb-5">
            <li className="mb-2 animate-fadeInUp">Processing bookings and payments.</li>
            <li className="mb-2 animate-fadeInUp">Communicating with you regarding your reservations or account.</li>
            <li className="mb-2 animate-fadeInUp">Improving our services through analytics and user insights.</li>
            <li className="mb-2 animate-fadeInUp">Preventing fraud and ensuring website security.</li>
            <li className="mb-2 animate-fadeInUp">Complying with legal obligations and enforcing our Terms & Conditions.</li>
          </ul>
        </div>

        {/* SHARING OF INFORMATION */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mt-6 text-white text-center animate-fadeInUp">SHARING OF INFORMATION</h2>
          <p className="mb-2 animate-fadeInUp text-center">We may share your information with:</p>
          <ul className="list-disc ml-6 mb-5">
            <li className="mb-2 animate-fadeInUp">Service providers involved in payment processing, customer support, analytics, or marketing</li>
            <li className="mb-2 animate-fadeInUp">Legal and regulatory authorities, when required to comply with laws or protect our rights</li>
            <li className="mb-2 animate-fadeInUp">Advertisers, but only when you engage with third-party ads on our site; such sharing is also governed by their privacy policies</li>
          </ul>
        </div>
        
        {/* DATA RETENTION */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mt-6 text-white text-center animate-fadeInUp">DATA RETENTION</h2>
          <p className="mb-5 animate-fadeInUp text-center">
            We retain personal information only as long as necessary to fulfill the purposes outlined, comply with legal obligations, resolve disputes, and enforce agreements.
          </p>
        </div>

        {/* YOUR RIGHTS */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mt-6 text-white text-center animate-fadeInUp">YOUR RIGHTS</h2>
          <p className="mb-2 animate-fadeInUp text-center">Depending on your jurisdiction, you may have rights such as:</p>
          <ul className="list-disc ml-6 mb-5">
            <li className="mb-2 animate-fadeInUp">Accessing and obtaining copies of your personal data</li>
            <li className="mb-2 animate-fadeInUp">Correcting or updating inaccurate information</li>
            <li className="mb-2 animate-fadeInUp">Requesting deletion of your data</li>
            <li className="mb-2 animate-fadeInUp">Withdrawing consent or objecting to processing</li>
          </ul>
          <p className="mb-5 animate-fadeInUp text-center">
            To exercise your rights, please contact us using the details below.
          </p>
        </div>

        {/* SECURITY */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mt-6 text-white text-center animate-fadeInUp">SECURITY</h2>
          <p className="mb-5 animate-fadeInUp text-center">
            We implement industry-standard technical and organizational safeguards to protect your personal information. However, no method of data transmission or storage is completely secure, and absolute security cannot be guaranteed.
          </p>
        </div>

        {/* CHILDREN'S PRIVACY */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mt-6 text-white text-center animate-fadeInUp">CHILDREN'S PRIVACY</h2>
          <p className="mb-5 animate-fadeInUp text-center">
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal data from minors. If we become aware of such data, we will take steps to delete it promptly.
          </p>
        </div>

        {/* INTERNATIONAL DATA TRANSFERS */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mt-6 text-white text-center animate-fadeInUp">INTERNATIONAL DATA TRANSFERS</h2>
          <p className="mb-5 animate-fadeInUp text-center">
            If you are located outside the jurisdiction of StayAtlas and transfer information to us, such transfers will be conducted in compliance with applicable laws and safeguards.
          </p>
        </div>

        {/* CONTACT US */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mt-6 text-white text-center animate-fadeInUp">CONTACT US</h2>
          <p className="mb-2 animate-fadeInUp text-center">
            For any questions or to exercise your privacy rights, you can reach us at:
          </p>
          <div className="text-center animate-fadeInUp">
            <p className="font-bold">stayatlasin@gmail.com</p>
          </div>
        </div>

        {/* Additional Contact Details */}
        <div className="text-center animate-fadeInUp">
          <p className="mb-1">Address: Office Number 620, Ijmima Complex, near Infiniti Mall Malad, Malad West, Mumbai, Maharashtra 400064</p>
          <p className="mb-1">Email: stayatlasin@gmail.com</p>
          <p className="mb-1">Phone: +91 85911 31447</p>
        </div>

      </div>
    </div>
  )
}

export default Privacy