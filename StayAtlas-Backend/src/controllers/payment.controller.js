import Razorpay from 'razorpay';
import crypto from 'crypto';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Booking from '../models/booking.model.js';

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Enhanced create order with idempotency
const createOrder = asyncHandler(async (req, res) => {
    const { amount, currency, receipt, notes, idempotencyKey } = req.body;
    
    // Validation
    if (!amount || amount <= 0) {
        throw new ApiError(400, "Invalid amount");
    }
    
    if (!idempotencyKey) {
        throw new ApiError(400, "Idempotency key required");
    }
    
    // Check if order already exists with this idempotency key
    const existingBooking = await Booking.findOne({ 
        idempotencyKey,
        user: req.user._id 
    });
    
    if (existingBooking && existingBooking.razorpayOrderId) {
        return res.status(200).json(
            new ApiResponse(200, {
                orderId: existingBooking.razorpayOrderId,
                amount: existingBooking.paymentAmount,
                currency: existingBooking.paymentCurrency
            }, "Existing order returned")
        );
    }
    
    const options = {
        amount: Math.round(amount), // Ensure integer
        currency: currency || "INR",
        receipt: receipt || `receipt_${Date.now()}`,
        notes: notes || {}
    };
    
    try {
        const order = await instance.orders.create(options);
        
        // Create initial booking record with "created" status
        const bookingData = {
            ...req.body.bookingData,
            user: req.user._id,
            razorpayOrderId: order.id,
            paymentStatus: "created",
            paymentAmount: order.amount,
            paymentCurrency: order.currency,
            idempotencyKey,
            checkIn: new Date(req.body.bookingData.checkIn),
            checkOut: new Date(req.body.bookingData.checkOut)
        };
        
        const newBooking = await Booking.create(bookingData);
        
        return res.status(201).json(
            new ApiResponse(201, {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                bookingId: newBooking._id
            }, "Order created successfully")
        );
        
    } catch (error) {
        console.error("Razorpay order creation failed:", error);
        throw new ApiError(500, "Failed to create payment order");
    }
});

// Enhanced verify and book with proper transaction handling
const verifyAndBook = asyncHandler(async (req, res) => {
    const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature,
        bookingId 
    } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
        throw new ApiError(400, "Missing payment verification details");
    }
    
    // Find the booking
    const booking = await Booking.findOne({
        _id: bookingId,
        razorpayOrderId: razorpay_order_id,
        user: req.user._id
    });
    
    if (!booking) {
        throw new ApiError(404, "Booking not found or unauthorized");
    }
    
    // Check if already processed
    if (booking.paymentStatus === "paid") {
        return res.status(200).json(
            new ApiResponse(200, {
                bookingId: booking._id,
                paymentStatus: "already_verified"
            }, "Payment already verified")
        );
    }
    
    // Verify signature
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
    
    if (expectedSignature !== razorpay_signature) {
        // Update booking with failed status
        await Booking.findByIdAndUpdate(bookingId, {
            paymentStatus: "failed",
            lastPaymentError: "Signature verification failed",
            $inc: { paymentAttempts: 1 }
        });
        
        throw new ApiError(400, "Payment signature verification failed");
    }
    
    // Update booking with successful payment
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                paymentStatus: "paid",
                isPaid: true,
                paidAt: new Date(),
                status: "pending",
                $inc: { paymentAttempts: 1 }
            },
            { new: true }
        );
        
        if (!updatedBooking) {
            throw new ApiError(500, "Failed to update booking after payment verification");
        }
        
        return res.status(200).json(
            new ApiResponse(200, {
                bookingId: updatedBooking._id,
                paymentStatus: "verified",
                bookingStatus: "Confirmed"
            }, "Payment verified and booking confirmed")
        );
        
    } catch (error) {
        console.error("Error updating booking after payment:", error);
        
        // Mark as failed for manual review
        await Booking.findByIdAndUpdate(bookingId, {
            paymentStatus: "failed",
            lastPaymentError: "Database update failed after successful payment",
            $inc: { paymentAttempts: 1 }
        });
        
        throw new ApiError(500, "Payment verified but booking update failed - please contact support");
    }
});

export { createOrder, verifyAndBook };