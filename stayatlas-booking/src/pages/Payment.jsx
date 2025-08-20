import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';
import VillaDetails from '../components/PaymentVillaDetails';
import PaymentSummary from '../components/PaymentSummary';
import PaymentGatewayButton from '../components/PaymentGatewayButton';
import { ChevronLeft } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};
  const { firstName, lastName, email, userPhone, userId } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [villaDetails, setVillaDetails] = useState(null);
  const [totalPayable, setTotalPayable] = useState(0);

  const [userContact, setUserContact] = useState(userPhone || '');
  const [isEditingContact, setIsEditingContact] = useState(false);

  // NEW: track idempotency & bookingId
  const [idempotencyKey] = useState(() => `${userId}_${Date.now()}_${Math.random()}`);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!bookingData) {
      console.log('No booking data received. Redirecting back to home.');
      navigate('/');
      return;
    }

    // Load Razorpay SDK
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Razorpay SDK!');
        setPaymentStatus('Failed to load payment gateway.');
      };
      document.body.appendChild(script);
    };

    if (!window.Razorpay) {
      loadRazorpayScript();
    } else {
      setRazorpayLoaded(true);
    }

    // Fetch villa details
    const fetchVilla = async () => {
      try {
        const response = await axios.get(`/v1/villas/${bookingData.villa}`);
        setVillaDetails(response.data.data);
      } catch (error) {
        console.error('Failed to fetch villa details:', error);
      }
    };
    fetchVilla();
  }, [bookingData, navigate]);

  // Contact update
  const handleEditClick = () => setIsEditingContact(true);
  const handleSaveClick = async () => {
    if (!userContact) return;
    try {
      const response = await axios.post('/v1/users/update-contact', { userId, userPhone: userContact });
      if (response.data.success) {
        console.log('Contact number updated successfully!');
        setIsEditingContact(false);
      }
    } catch (error) {
      console.error('Error updating contact number:', error);
    }
  };

  // Create order API
  const createRazorpayOrder = async () => {
    setLoading(true);
    setPaymentStatus('Creating payment order...');

    try {
      const response = await axios.post('/v1/payments/create-order', {
        amount: totalPayable * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        idempotencyKey,
        bookingData: {
          ...bookingData,
          userContact,
          user: userId,
        },
        notes: {
          villaId: bookingData.villa,
          userId,
        },
      });

      const { orderId, amount, currency, bookingId: newBookingId } = response.data.data;
      setBookingId(newBookingId);
      setLoading(false);
      setPaymentStatus('Order created. Ready to pay.');
      return { orderId, amount, currency, bookingId: newBookingId };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      setLoading(false);
      setPaymentStatus('Failed to create payment order.');
      return null;
    }
  };

  // Handle payment
  const handleRazorpayPayment = async () => {
    if (!userContact || userContact.trim() === '' || userContact.trim().toLowerCase() === 'n/a') {
      setPaymentStatus('Please provide a valid contact number to proceed.');
      return;
    }
    if (!razorpayLoaded || totalPayable <= 0) {
      setPaymentStatus('Invalid booking amount or Razorpay not ready.');
      return;
    }

    const orderDetails = await createRazorpayOrder();
    if (!orderDetails) return;

    const { orderId, amount, currency, bookingId: currentBookingId } = orderDetails;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount,
      currency,
      name: 'StayAtlas',
      description: 'Villa Booking Payment',
      order_id: orderId,
      handler: async function (response) {
        setPaymentStatus('Payment successful! Verifying...');
        try {
          const verificationResponse = await axios.post('/v1/payments/verify-and-book', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId: currentBookingId,
          });

          if (verificationResponse.data.success) {
            setPaymentStatus('Booking confirmed successfully!');
            navigate('/profile', {
              state: {
                bookingId: verificationResponse.data.data.bookingId,
                paymentSuccess: true,
              },
            });
          }
        } catch (error) {
          setPaymentStatus('Payment successful but verification failed. Please contact support.');
          console.error('Verification error:', error);
        }
      },
      prefill: {
        name: `${firstName || ''} ${lastName || ''}`.trim() || 'Guest User',
        email: email || 'guest@example.com',
        contact: userContact || '9999999999',
      },
      notes: {
        villaId: bookingData?.villa,
        checkIn: bookingData?.checkIn,
        checkOut: bookingData?.checkOut,
        bookingId: currentBookingId,
      },
      theme: { color: '#3399CC' },
      modal: {
        ondismiss: () => setPaymentStatus('Payment cancelled by user.'),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      setPaymentStatus(`Payment failed: ${response.error.description}`);
      console.error('Payment failed:', response.error);
    });
    rzp.open();
  };

  if (!bookingData || !villaDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
        <p className="text-red-500 text-lg">Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-inter">
      <div className="mx-auto">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-5">Complete Your Payment</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Details</h2>
            <VillaDetails bookingData={bookingData} villaDetails={villaDetails} />
          </div>

          <div className="md:col-span-1 bg-gray-50 p-8 rounded-xl shadow-lg h-fit md:sticky md:top-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Summary</h2>
            <PaymentSummary property={villaDetails} setTotalPayable={setTotalPayable} />

            <div className="mt-8">
              <PaymentGatewayButton
                loading={loading}
                razorpayLoaded={razorpayLoaded}
                paymentStatus={paymentStatus}
                onPayClick={handleRazorpayPayment}
              />
            </div>

            <div className="mt-6 pt-4 border-t border-gray-300">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Your Contact Details</h3>
              <div className="space-y-3">
                <div className="flex flex-col">
                  {isEditingContact ? (
                    <>
                      <label className="font-semibold text-sm text-gray-600 mb-1">Contact:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="tel"
                          value={userContact}
                          onChange={(e) => setUserContact(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                          onClick={handleSaveClick}
                          className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600"
                        >
                          Save
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <label className="font-semibold text-sm text-gray-600 mb-1">Contact:</label>
                      <div className="flex items-center justify-between text-sm text-gray-800">
                        <span>{userContact}</span>
                        <button
                          onClick={handleEditClick}
                          className="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                          Edit
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
