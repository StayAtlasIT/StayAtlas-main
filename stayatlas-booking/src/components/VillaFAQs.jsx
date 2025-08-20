import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqData = [
  {
    category: "Accommodation",
    questions: [
      {
        q: "Is Driver and/or House-Help accommodation available?",
        a: "No, accommodation for driver and house-help is not available.",
      },
      {
        q: "Is parking available onsite or nearby?",
        a: "Free parking is available onsite.",
      },
      {
        q: "Is the villa suitable for a day picnic?",
        a: "Yes, the home has a garden for outdoor picnic activities. Meals at additional cost. Washrooms and other amenities are available for day use.",
      },
      {
        q: "Can I reserve your place for special functions such as engagement ceremony, a small wedding ceremony or a birthday party, etc?",
        a: "Yes, events and shoots are allowed with prior approval. Meals and music allowed with some rules. Refundable deposit and extra charges may apply.",
      },
      {
        q: "Is Driver and/or House-Help accommodation available?",
        a: "No, accommodation for driver and house-help is not available.",
      },
      {
        q: "Is parking available onsite or nearby?",
        a: "Free parking is available onsite.",
      },
      {
        q: "Is the villa suitable for a day picnic?",
        a: "Yes, the home has a garden for outdoor picnic activities. Meals at additional cost. Washrooms and other amenities are available for day use.",
      },
      {
        q: "Can I reserve your place for special functions such as engagement ceremony, a small wedding ceremony or a birthday party, etc?",
        a: "Yes, events and shoots are allowed with prior approval. Meals and music allowed with some rules. Refundable deposit and extra charges may apply.",
      },
    ],
  },
];

export default function VillaFAQs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const filtered = faqData.flatMap((cat) =>
    cat.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const visibleFaqs = showAll ? filtered : filtered.slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 border-l-4 border-orange-500 pl-4">
        FAQs
      </h2>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search"
        className="w-[40%] px-4 py-2 mb-4 border rounded-full"
      />

      <div className="space-y-4">
        {visibleFaqs.map((item, index) => (
          <div key={index} className="border-b">
            <button
              onClick={() => setExpanded(index === expanded ? null : index)}
              className="flex justify-between items-center w-full text-left font-medium py-3"
            >
              {item.q}
              {expanded === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expanded === index && (
              <p className="pb-4 text-gray-600">{item.a}</p>
            )}
          </div>
        ))}
      </div>

      {filtered.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 px-4 py-2 border rounded-full hover:bg-gray-100"
        >
          {showAll ? "See less FAQs" : "See all FAQs"}
        </button>
      )}

      {/* Contact Us Section */}
      <div className="mt-12 p-6 bg-blue-50 border-b-2 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
        <div>
          <h3 className="text-xl font-bold mb-1 text-gray-800">Questions?</h3>
          <p className="text-gray-600">
            Our team is here to help you. Drop us a message!
          </p>
        </div>
        <a
          href="https://wa.me/918591131447"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 border border-black rounded-full hover:bg-black hover:text-white transition whitespace-nowrap text-center"
        >
          Contact us
        </a>
      </div>
    </div>
  );
}
