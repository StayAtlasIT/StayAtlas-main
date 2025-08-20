// src/components/PaymentGatewayButton.jsx
import React from 'react';

const PaymentGatewayButton = ({ loading, razorpayLoaded, paymentStatus, onPayClick }) => {
  return (
    <div className="mt-8">
      <button
        onClick={onPayClick}
        disabled={loading || !razorpayLoaded}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50"
      >
        {loading ? 'Processing Payment...' : 'Proceed to Pay'}
      </button>
      {paymentStatus && (
        <p className={`mt-4 text-lg font-medium ${paymentStatus.includes('successful') || paymentStatus.includes('confirmed') ? 'text-green-600' : paymentStatus.includes('failed') ? 'text-red-600' : 'text-gray-600'}`}>
          {paymentStatus}
        </p>
      )}
    </div>
  );
};

export default PaymentGatewayButton;