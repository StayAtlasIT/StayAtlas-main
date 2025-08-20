import React from 'react';

const CancellationPolicy = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 uppercase">
          Refund & Cancellation Policy
        </h1>

        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-300 space-y-8 text-gray-800 text-lg">
          <p>
            <strong className="block text-xl">100% REFUND OR 100% FUTURE STAY VOUCHER</strong>
            If cancelled <strong>12 days or more</strong> before check-in date.
          </p>

          <p>
            <strong className="block text-xl">50% REFUND OR 50% FUTURE STAY VOUCHER</strong>
            If cancelled <strong>6 to 12 days</strong> before check-in date.
          </p>

          <p>
            <strong className="block text-xl">NO REFUND</strong>
            If cancelled <strong>less than 6 days</strong> before check-in date.
          </p>

          <p>
            <strong className="block text-xl">IF BOOKING IS CANCELLED ON THE SAME DAY AS CHECK-IN:</strong>
            <span className="italic"> No refund</span> and no rescheduling will be possible under any circumstance.
          </p>

          <p>
            <strong className="block text-xl">IF GUESTS VISIT THE PROPERTY BUT CHOOSE NOT TO CHECK-IN:</strong>
            The advance payment will <span className="font-semibold">not be refunded</span>.
          </p>

          <p>
            <strong className="block text-xl">IF THE BOOKING IS MADE WITHIN 3 DAYS OF CHECK-IN AND LATER CANCELLED:</strong>
            The <span className="font-semibold">50% advance</span> is non-refundable.
          </p>

          <p className="text-base text-gray-500 italic mt-6">
            <strong>Note:</strong> Refunds or vouchers are not applicable on peak season dates or promotional bookings unless explicitly mentioned.
          </p>

          <p className="mt-10 font-semibold text-gray-900">StayAtlas</p>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
