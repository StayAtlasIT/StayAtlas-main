import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createBookingSchema } from "../validators/booking.validator.js";
import Booking from "../models/booking.model.js";
import {Villa} from '../models/villa.model.js';
import {User} from '../models/user.model.js';

//  desc    Create a new booking
//  route   POST /api/v1/bookings
//  access  Private

export const createBooking = asyncHandler(async (req, res) => {
  const {
    villa,
    checkIn,
    checkOut,
    guests,
    pricePerNightAtBooking,
    nights,
    discountPercentApplied = 0,
    couponCode,
    couponDiscountAmount = 0,
    paymentMethod,
    additionalCharges
  } = req.body;

  console.log(req.body)

  // ✅ Step 1: Validate input using Zod schema
  const parsedData = createBookingSchema.safeParse({
    villa,
    checkIn,
    checkOut,
    guests,
    pricePerNightAtBooking,
    nights,
    discountPercentApplied,
    couponCode,
    couponDiscountAmount,
    paymentMethod,
    additionalCharges
  });

  console.log(parsedData.error)

  if (!parsedData.success) {
    throw new ApiError(400, parsedData.error.errors[0].message);
  }

  // ✅ Step 2: Date conversion and logic check
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    throw new ApiError(400, "Check-out date must be after check-in date");
  }

 // ✅ Step 3: Overlapping booking check
const existingBooking = await Booking.findOne({
  villa,
  status: { $ne: "Cancelled" },
  $or: [
    {
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate }
    }
  ]
});

if (existingBooking) {
  return res.status(400).json({
    success: false,
    message: "Villa is already booked in the selected date range. Please select a different date.",
  });
}


  // ✅ Step 4: Calculate total amount
  const price = parseFloat(pricePerNightAtBooking);
  // const subTotal = price * nights * guests;
  const subTotal = price * nights ;
  const discount = subTotal * (discountPercentApplied / 100);
  const gst = (subTotal - discount - couponDiscountAmount) * 0.18;
  const totalAmount = (subTotal - discount - couponDiscountAmount + gst) + additionalCharges;
  console.log("Total Amount:",totalAmount)
  // Fetch villa details
  const villaDetails = await Villa.findById(villa);

  // Fetch user details
  const userDetails = await User.findById(req.user._id);


  // ✅ Step 5: Create booking
  const booking = await Booking.create({
    villa,
    user: req.user._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests,
    pricePerNightAtBooking,
    nights,
    discountPercentApplied,
    couponCode,
    couponDiscountAmount,
    totalAmount,
    paymentMethod,
    additionalCharges
  });

  // ✅ Step 5.1: Push booking._id into User's bookingHistory
await User.findByIdAndUpdate(req.user._id, {
  $push: { bookingHistory: booking._id }
});

  // ✅ Step 6: Send response
  res.status(201).json(
    new ApiResponse(201, {
      booking,
      calculation: {
        subTotal,
        discount,
        gst,
        additionalCharges,
        totalAmount
      },
      villaDetails, 
      userDetails, 
    }, "Booking created successfully")
  );
});

//  desc    Get a single booking by ID
//  route   GET /api/v1/bookings/:id

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'firstName lastName email phoneNumber')
    .populate('villa', 'villaName location images numberOfRooms address description amenities');
    // .populate(
    //   {
    //     path:'VillaReview',
    //     select:'title rating description experienceImages',
    //     match:{status: 'approved'}
    //   }
    // )
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  res.status(200).json(new ApiResponse(200, booking));
});


//  desc    Get all bookings for a specific user
//  route   GET /api/v1/bookings/user/:userId

export const getUserBookings = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { type } = req.query;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today (00:00)
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Start of next day

  let filter = { user: userId };

  if (type === 'past') {
    // Past bookings (check-in and check-out already done)
    filter = {
      user: userId,
      checkIn: { $lte: today },
      checkOut: { $lte: tomorrow },
      status: { $in: ['Confirmed', 'Completed'] },
    };

    let bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .populate('villa', 'villaName address images numberOfRooms');

    //  Auto-update status from Confirmed to Completed
    const updatePromises = bookings.map(async (booking) => {
      if (booking.status === 'Confirmed' && new Date(booking.checkOut) < today) {
        booking.status = 'Completed';
        await booking.save();
      }
      return booking;
    });

    const updatedBookings = await Promise.all(updatePromises);

    return res.status(200).json(new ApiResponse(200, updatedBookings));

  } else if (type === 'upcoming') {
    // Upcoming bookings (check-in strictly after today)
    filter = {
      user: userId,
      checkIn: { $gte: tomorrow },
      status: 'Confirmed',
    };
  } else if (type === 'incomplete') {
    // Bookings that are still pending or cancelled
    filter = {
      user: userId,
      status: { $in: ['Pending', 'Cancelled'] },
    };
  }

  // For upcoming/incomplete bookings
  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .populate('villa', 'villaName address images numberOfRooms');

  res.status(200).json(new ApiResponse(200, bookings));
});

//  desc    Get a single booking by ID (Admin)
//  route   GET /api/v1/bookings/admin/:id

export const getBookingByIdAdmin = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email')
    .populate('villa', 'name location images');

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  res.status(200).json(new ApiResponse(200, booking));
});

//  desc    Get all bookings for admin
//  route   GET /api/v1/bookings/admin

export const getAllBookingAdmin = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'firstName lastName email phoneNumber')
    .populate('villa', 'villaName villaOwner location images')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, bookings));
});


//  desc    Cancel a booking with reason
//  route   PATCH /api/v1/bookings/:id/cancel
//  access  Private

export const cancelBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!reason || reason.trim() === '') {
    throw new ApiError(400, 'Cancellation reason is required');
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Allow only if booking is confirmed and check-in date is in future
  const today = new Date();
  const checkInDate = new Date(booking.checkIn);

  if (booking.status !== 'Confirmed') {
    throw new ApiError(400, 'Only confirmed bookings can be cancelled');
  }
 
  if (checkInDate <= today) {
    throw new ApiError(400, 'Cannot cancel past or ongoing bookings');
  }

  booking.status = 'Cancelled';
  booking.cancellationReason = reason;
  booking.cancelledAt = new Date();

  await booking.save();

  res.status(200).json(new ApiResponse(200, booking, 'Booking cancelled successfully'));
});


//  desc    Confirm payment for a booking
//  route   PATCH /api/v1/bookings/:id/pay

export const confirmPayment = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.isPaid) {
    throw new ApiError(400, 'Payment already confirmed');
  }

  booking.isPaid = true;
  booking.paidAt = new Date();
  booking.status = 'Confirmed';
  await booking.save();

  res.status(200).json(new ApiResponse(200, booking, 'Payment confirmed successfully'));
});

//  desc    Check villa availability between given dates
//  route   GET /api/v1/bookings/check-availability

export const checkBookingAvailability = asyncHandler(async (req, res) => {
  // console.log("Checking booking availability...", req.params, req.query);
  const { villaId } = req.params;
  const { checkIn, checkOut } = req.query;

  if (!checkIn || !checkOut) {
    throw new ApiError(400, "Check-in and check-out dates are required");
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Check for overlapping bookings
  const existingBooking = await Booking.findOne({
    villa: villaId,
    status: { $ne: "Cancelled" },
    $or: [
      {
        checkIn: { $lt: checkOutDate },
        checkOut: { $gt: checkInDate }
      }
    ]
  });

  const isAvailable = !existingBooking;

  return res.status(200).json(
    new ApiResponse(
      200,
      { isAvailable },
      isAvailable
        ? "Villa is available for booking"
        : "Villa is already booked in the selected date range"
    )
  );
});



export const getAllVillaOwnerBookings = async(req,res) => {
  try{
    const villaOwnerId = req.user._id;

    const villaUser = await User.findById(villaOwnerId)

    // find all bookings via villa

    if(!villaUser){
      return res.status(400).json({
        statusCode:400,
        message:"Villa Owner not found!"
      })
    }

    const ownedVillas = await Villa.find({ ownerId: villaOwnerId });
    if (!ownedVillas.length) {
      return res.status(404).json({
        statusCode: 404,
        message: "No villas found for this owner."
      });
    }

    const villaIds = ownedVillas.map(v => v._id);

    const bookings = await Booking.find({
      villa: { $in: villaIds }
    })
      .populate('villa','villaName')           
      .populate('user', 'firstName lastName email phoneNumber')  
      .sort({ checkIn: -1 });   
  console.log(bookings)
    
    return res.status(200).json({
      statusCode:200,
      data: bookings,
      message:"Villa bookings fetched successfully!"
    })
    
  }catch(err){
    return res.status(400).json({
      success:false,
      message:"Error in fetching bookings"
    })
  }
}

