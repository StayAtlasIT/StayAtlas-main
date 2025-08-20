import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 uppercase">
          Terms & Conditions
        </h1>

        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-300 space-y-10 text-gray-800 text-lg">

          {/* Advance Deposit */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">Advance Deposit</h2>
            <p>Up to ₹15,000 — Deposit of ₹5,000</p>
            <p>Above ₹15,000 — Deposit of ₹10,000</p>
            <p>Above ₹50,000 — Deposit of ₹15,000</p>
          </div>

          {/* Arrival & Departure */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">Arrival & Departure</h2>
            <p>• Check-in time 1:00 PM and Check-out time 11:00 AM.</p>
            <p>• To ensure staff has enough time to prepare, please adhere strictly to check-out time.</p>
            <p>• Late check-out may result in charges of ₹1,000 for every 30 minutes.</p>
          </div>

          {/* Booking Process */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">Booking Process</h2>
            <p>
              To confirm your booking, 50% advance payment is required. Balance must be paid 10 days before check-in.
              Total agreed amount is for the specified number of guests. Extra guests will be charged additional fees.
            </p>
          </div>

          {/* ID Verification */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">ID Verification & Digital Check-In</h2>
            <p>• All guests aged 18+ must present valid government-approved ID.</p>
            <p>• Filling out the digital check-in form is mandatory.</p>
            <p>• Entry will be denied without submission of the form.</p>
          </div>

          {/* Guests / Visitors */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">Residing Guests / Visitors</h2>
            <p>• Number of guests must not exceed booking agreement.</p>
            <p>• Extra guests will be charged additional fees.</p>
            <p>• Visitors of guests are not permitted to stay or use facilities.</p>
            <p>• Any rule violation may result in cancellation.</p>
          </div>

          {/* Villa Inspection */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">Villa Inspection at Check-In</h2>
            <p>• Guests are required to inspect villa at check-in.</p>
            <p>• Issues must be reported immediately, not later.</p>
          </div>

          {/* Damage / Deposit */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">Damage / Security Deposit</h2>
            <p>• Guests must treat property with care.</p>
            <p>• Refundable deposit of ₹10,000 at check-in (via bank transfer/UPI).</p>
            <p>• Costs of repairs will be adjusted from deposit.</p>
            <p>• Deposit refunded within 24 hours of check-out.</p>
          </div>

          {/* Illegal Activities */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">Illegal Activities</h2>
            <p>• Drugs, narcotics, hookah, firearms are prohibited.</p>
            <p>• Any violation will be reported to authorities.</p>
            <p>• Alcohol is permitted within reasonable limits.</p>
          </div>

          {/* Smoking */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">Smoking</h2>
            <p>• Smoking inside villa rooms, washrooms, etc. is prohibited.</p>
            <p>• Smoking allowed outdoors only.</p>
            <p>• Violation will incur a ₹2000 sanitization fee.</p>
          </div>

          {/* Kitchen */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">Kitchen Access</h2>
            <p>• Cleaning & gas charges apply if kitchen is used.</p>
            <p>• Infant cooking allowed free.</p>
            <p>• Inform caretaker for any special use.</p>
          </div>

          {/* Music */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">Music & Noise Policy</h2>
            <p>• Music indoors only, keep volume low.</p>
            <p>• No loud music after 10:00 PM.</p>
            <p>• Guest negligence is guest responsibility.</p>
          </div>

          {/* Swimming Pool */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">Swimming Pool</h2>
            <p>• No lifeguard on site.</p>
            <p>• Children must be accompanied at all times.</p>
          </div>

          {/* Insects */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">Insects & Flies</h2>
            <p>• Villa is in natural surroundings; insects may be present.</p>
            <p>• Pest control done regularly, but guests should take precautions.</p>
          </div>

          {/* Electricity */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">Electricity</h2>
            <p>• Power cuts/load shedding may occur beyond control.</p>
            <p>• Backup available for 2-3 hours.</p>
            <p>• No refund for power cuts caused by govt/supply company.</p>
          </div>

          {/* Personal Valuables */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">Personal Valuables</h2>
            <p>• Guests must take care of personal belongings.</p>
            <p>• Management not responsible for theft/damage/loss.</p>
          </div>

          {/* Caretaker */}
          <div>
            <h2 className="text-xl font-bold uppercase mb-4">Caretaker Services</h2>
            <p>• Staff available 8 AM – 10 PM.</p>
            <p>• During stay, only basic cleaning provided.</p>
          </div>

          {/* Thank You */}
          <div>
            <h2 className="text-xl font-bold uppercase mt-8">Thank You!</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
