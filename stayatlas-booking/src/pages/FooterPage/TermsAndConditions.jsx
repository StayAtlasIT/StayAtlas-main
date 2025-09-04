import React from "react";

const TermsAndConditions = () => {
  const sections = [
    {
      title: "Arrival & Departure",
      content: [
        "Check-in time 1:00 PM and Check-out time 11:00 AM.",
        "To ensure that our staff has enough time to turn around the villa for the next guest, we request you to adhere strictly to the check-out time.",
        "Please be aware that late check-out may result in additional fees of ₹1,000 for every 30 minutes.",
      ],
    },
    {
      title: "Booking Process",
      content: [
        "To confirm your booking, we kindly request a 50% advance payment.",
        "The balance payment must be paid two days before the check-in date.",
        "The total amount agreed upon is for the specific number of guests at the time of booking.",
        "If there are additional guests accompanying you upon arrival, please be advised that they will be charged an additional fee for their stay.",
      ],
    },
    {
      title: "ID Verification & Digital Check-In",
      content: [
        "All guests aged 18 and above must present valid government-approved photo ID & address proof (Aadhar Card, Passport, or Driving License).",
        "Filling out the digital check-in form is strictly mandatory for all guests — as per government compliance regulations.",
        "Entry will be denied without submission of the digital check-in form.",
      ],
    },
    {
      title: "Residing Guests / Visitors",
      content: [
        "Number of guests staying at the villa should not exceed the number agreed upon at the time of booking.",
        "If there are any additional guests accompanying you, please be advised that they will be charged an additional fee for their stay.",
        "Visitors of guests are not permitted to stay or utilise the villa's facilities.",
        "Inappropriate behavior or violation of any of the Villa Rules will invite a polite refusal to accept a booking.",
        "If already checked in, Management reserves the right to ask guests to leave.",
      ],
    },
    {
      title: "Villa Inspection at Check-In",
      content: [
        "Guests are requested to inspect the villa at check-in, including cleanliness, smell, and condition.",
        "Any issues must be reported to the caretaker immediately.",
        "Complaints raised later during or after the stay may not be accepted.",
      ],
    },
    {
      title: "Damage / Security Deposit",
      content: [
        "We expect and earnestly request the guest to treat the home with utmost care & respect:",
        "Any damage to the property, whether accidental or wilful, is the responsibility of the registered guest.",
        "A refundable damage / security deposit of ₹10,000 is to be paid at the time of check-in via bank transfer or UPI.",
        "Any costs associated with repairs or replacement will be adjusted against this deposit.",
        "The deposit will be returned within 24 hours of check-out.",
      ],
    },
    {
      title: "Illegal Activities",
      content: [
        "Illegal activities, including but not limited to the carrying or consumption of drugs or narcotics, hookah or shisha, as well as the carrying of firearms or weapons, are strictly prohibited on the property.",
        "The management reserves the right to report any such activities to the local authorities.",
        "However, consumption of alcohol is permissible within reasonable limits.",
      ],
    },
    {
      title: "Smoking",
      content: [
        "Smoking indoors within the villa, including in rooms, living room, washrooms, dining room and other common areas, is strictly prohibited.",
        "However, guests may smoke in well-ventilated areas such as the poolside, deck area and the lawn.",
        "Please note that if this rule is violated, a sanitization fee of ₹2000 per area will be charged.",
      ],
    },
    {
      title: "Kitchen Access",
      content: [
        "Cleaning and Gas charges will be applicable if guest wishes to use the Kitchen for cooking.",
        "Basic cooking for Infant is permitted without charges on permission basis.",
        "In case of any other kitchen needs, inform the caretaker who will be happy to help.",
      ],
    },
    {
      title: "Music & Noise Policy",
      content: [
        "Music is allowed indoors only and must be kept at a low volume.",
        "Strictly no loud music after 10:00 PM.",
        "Any police action due to guest negligence will be the guest’s responsibility. StayAtlas will not be held liable in such cases.",
      ],
    },
    {
      title: "Swimming Pool",
      content: [
        "In case the property features a swimming pool, please note that the swimming pool is unguarded.",
        "There is no lifeguard on site.",
        "Children in the swimming pool must be accompanied by adults at all times.",
      ],
    },
    {
      title: "Insects & Flies",
      content: [
        "Remember, we are amongst nature & the surrounding areas belong to its inhabitants, we are the guests. You are advised to not venture out of the property after dark.",
        "Although pest control services are conducted regularly, some insects may find access to the house.",
        "Guests are requested to keep doors & windows shut and take precautionary measures necessary for their personal safety and protection.",
      ],
    },
    {
      title: "Electricity",
      content: [
        "There could be intermittent power cuts or load shedding in the area of the villa.",
        "In such cases, we request that guests cooperate with us, as this is beyond our control.",
        "However, we do have minimum power backup for 2 to 3 hours available through the inverter.",
        "Please note that no refund will be provided in case of power cuts caused by the government or the power supply company.",
      ],
    },
    {
      title: "Personal Valuables",
      content: [
        "Guests are requested to take care of all personal valuables. Management is not responsible for loss, theft or damage to any items.",
      ],
    },
    {
      title: "Caretaker Services",
      content: [
        "The villa staff will be available from 8:00 AM to 10:00 PM only.",
        "Please note that during your stay, the housekeeping staff will be available for basic cleaning only.",
      ],
    },
  ];

  return (
    <div className="flex justify-center bg-gray-50 py-6 px-3 sm:py-10 sm:px-6 lg:px-8">
  <div className="w-full max-w-3xl border-2 border-[#002b20] rounded-lg p-6 sm:p-10 bg-white text-[#002b20]">
    
    {/* Main Heading */}
    <h1 className="text-xl sm:text-2xl font-extrabold text-center uppercase tracking-wider mb-8 sm:mb-10">
      TERMS & CONDITIONS
      <div className="border-b-2 border-[#002b20] w-28 sm:w-40 mx-auto mt-2"></div>
    </h1>

    {/* Advance Deposit Box */}
    <div className="text-center mb-10 sm:mb-12">
      <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider mb-4">
        Advance Deposit
      </h2>
      <div className="border border-[#002b20] rounded-md inline-block overflow-x-auto">
        <table className="table-auto text-sm sm:text-base w-full">
          <tbody>
            <tr>
              <td className="px-4 sm:px-6 py-2 sm:py-3 border-r border-[#002b20]">
                Up to ₹15,000
              </td>
              <td className="px-4 sm:px-6 py-2 sm:py-3">
                Deposit of ₹5,000
              </td>
            </tr>
            <tr className="border-t border-[#002b20]">
              <td className="px-4 sm:px-6 py-2 sm:py-3 border-r border-[#002b20]">
                Above ₹15,000
              </td>
              <td className="px-4 sm:px-6 py-2 sm:py-3">
                Deposit of ₹10,000
              </td>
            </tr>
            <tr className="border-t border-[#002b20]">
              <td className="px-4 sm:px-6 py-2 sm:py-3 border-r border-[#002b20]">
                Above ₹50,000
              </td>
              <td className="px-4 sm:px-6 py-2 sm:py-3">
                Deposit of ₹15,000
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Other Sections */}
    <div className="space-y-8 sm:space-y-12">
      {sections.map((section, index) => (
        <div key={index}>
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-center mb-3 sm:mb-4">
            {section.title}
          </h2>
          {section.content.length > 1 ? (
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 leading-relaxed text-sm sm:text-base">
              {section.content.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="leading-relaxed text-sm sm:text-base">{section.content[0]}</p>
          )}
        </div>
      ))}
    </div>

    {/* Thank You */}
    <div className="text-center mt-10 sm:mt-12">
      <h2 className="text-base sm:text-lg font-bold uppercase">Thank You!</h2>
    </div>
  </div>
</div>

  );
};

export default TermsAndConditions;
