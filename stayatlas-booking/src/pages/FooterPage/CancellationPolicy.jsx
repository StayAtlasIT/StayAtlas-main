import React from "react";

const CancellationPolicy = () => {
  return (
    <div className="flex justify-center bg-gray-50 py-6 px-3 sm:py-10 sm:px-6 lg:px-8">
      {/* Outer Border Box */}
      <div className="w-full max-w-3xl border border-[#002b20] rounded-xl p-6 sm:p-10 bg-white text-[#002b20] shadow-sm text-center">
        
        {/* Heading */}
        <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wider mb-8 sm:mb-10">
          Refund & Cancellation Policy
          <div className="border-b border-[#002b20] w-40 sm:w-56 mx-auto mt-2"></div>
        </h1>

        {/* Policies */}
        <div className="space-y-6 sm:space-y-8 text-sm sm:text-lg leading-relaxed text-left sm:text-center">
          <p>
            <span className="block text-base sm:text-lg font-bold uppercase text-center">
              100% Refund or 100% Future Stay Voucher
            </span>
            If cancelled <strong>12 days or more</strong> before check-in date.
          </p>

          <p>
            <span className="block text-base sm:text-lg font-bold uppercase text-center">
              50% Refund or 50% Future Stay Voucher
            </span>
            If cancelled <strong>6 to 12 days</strong> before check-in date.
          </p>

          <p>
            <span className="block text-base sm:text-lg font-bold uppercase text-center">
              No Refund
            </span>
            If cancelled <strong>less than 6 days</strong> before check-in date.
          </p>

          <p>
            <span className="block text-base sm:text-lg font-bold uppercase text-center">
              If booking is cancelled on the same day as check-in:
            </span>
            <em>No refund</em> and no rescheduling will be possible under any circumstance.
          </p>

          <p>
            <span className="block text-base sm:text-lg font-bold uppercase text-center">
              If guests visit the property but choose not to check-in:
            </span>
            The advance payment will <strong>not be refunded</strong>.
          </p>

          <p>
            <span className="block text-base sm:text-lg font-bold uppercase text-center">
              If the booking is made within 3 days of check-in and later cancelled:
            </span>
            The <strong>50% advance</strong> is non-refundable.
          </p>

          <p className="text-xs sm:text-base italic mt-6 text-center">
            <strong>Note:</strong> Refunds or vouchers are not applicable on peak season dates
            or promotional bookings unless explicitly mentioned.
          </p>

          {/* Signature */}
          <p className="mt-8 sm:mt-10 font-semibold text-sm sm:text-lg text-center">
            StayAtlas
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
