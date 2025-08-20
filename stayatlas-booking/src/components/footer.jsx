import React from 'react';
import { SiWhatsapp, SiInstagram, SiFacebook } from 'react-icons/si';

const Footer = () => {
  const socialLinks = [
    { icon: <SiWhatsapp />, link: 'https://wa.me/918591131447', label: 'WhatsApp' },
    { icon: <SiInstagram />, link: 'https://www.instagram.com/stayatlas.in', label: 'Instagram' },
    { icon: <SiFacebook />, link: 'https://www.facebook.com/yourpage', label: 'Facebook' },
  ];

  const quickLinks = [
    { text: 'Home', link: '/' },
    { text: 'Explore Villas', link: '/explore' },
    { text: 'List Your Property', link: '/list' },
    { text: 'Customer Support', link: '/chat' },
    { text: 'About Us', link: '/about-us' },
    { text: 'Contact Us', link: 'https://wa.me/918591131447' },
  ];

  const policyLinks = [
    { text: 'Terms & Conditions', link: '/terms-and-conditions' },
    { text: 'Privacy Policy', link: '/privacy-policy' },
    { text: 'Cancellation Policy', link: '/cancellation-policy' },
  ];

  return (
    <footer className="bg-gradient-to-b from-black to-[#111111] text-white pt-16 px-6 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 grid-cols-1 gap-12 text-center md:text-left">
        {/* BRAND SECTION */}
        <div>
          <h2 className="text-3xl font-bold mb-4 text-white">StayAtlas</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            Discover curated villas across breathtaking destinations in India. From coastal escapes to forest retreats, StayAtlas offers handpicked experiences, high-end hospitality, and seamless bookings.
          </p>
          <div className="flex gap-4 mt-6 justify-center md:justify-start">
            {socialLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="p-2 rounded-full border border-white/40 text-white hover:bg-white hover:text-black transition duration-300"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-xl font-semibold mb-5 uppercase border-b border-white/30 pb-2 tracking-wide">Quick Links</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            {quickLinks.map((item, index) => (
              <li key={index}>
                <a href={item.link} className="hover:text-white transition duration-300">
                  ➤ {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* POLICIES */}
        <div>
          <h3 className="text-xl font-semibold mb-5 uppercase border-b border-white/30 pb-2 tracking-wide">Policies</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            {policyLinks.map((item, index) => (
              <li key={index}>
                <a href={item.link} className="hover:text-white transition duration-300">
                  ➤ {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT SECTION */}
        <div>
          <h3 className="text-xl font-semibold mb-5 uppercase border-b border-white/30 pb-2 tracking-wide">Contact Us</h3>
          <p className="text-sm mb-2 text-gray-300">🏠 Malad, Mumbai, 400097</p>
          <p className="text-sm mb-2 text-gray-300">📞 <a href="tel:+918591131447" className="hover:text-white">+91 85911 31447</a></p>
          <p className="text-sm mb-4 text-gray-300">📧 <a href="mailto:stayatlasin@gmail.com" className="hover:text-white">stayatlasin@gmail.com</a></p>

          <h4 className="text-sm mt-6 mb-2 font-semibold">Newsletter</h4>
          <form className="flex mt-2 justify-center md:justify-start">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-l-md bg-transparent text-white placeholder:text-gray-400 text-sm focus:outline-none border border-white/40"
            />
            <button
              type="submit"
              className="bg-white text-black px-4 py-2 rounded-r-md hover:bg-gray-200 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* QUOTE & COPYRIGHT */}
      <div className="mt-14 border-t border-white/10 pt-6 text-center text-sm text-gray-300 max-w-5xl mx-auto italic leading-relaxed">
        “Whether you want a quaint abode among the woods, a luxurious stay, or a homely vibe for your vacations —
        we at StayAtlas strive to provide a seamless experience blending luxury, warmth, and comfort.”
      </div>

      <div className="text-center text-xs text-gray-400 mt-6 pb-8">
        &copy; {new Date().getFullYear()} StayAtlas • All Rights Reserved • Powered by StayAtlas & Co.
      </div>
    </footer>
  );
};

export default Footer;