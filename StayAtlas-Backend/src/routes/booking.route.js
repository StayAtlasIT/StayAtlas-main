import express from 'express';
import {
  checkBookingAvailability,
  createBooking,
  getBookingById,
  getUserBookings,
  getBookingByIdAdmin,
  getAllBookingAdmin,
  cancelBooking,
  confirmPayment,
  getAllVillaOwnerBookings
} from '../controllers/booking.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();


//  Public: Check villa availability
router.get('/check-availability/:villaId', checkBookingAvailability);

//  Authenticated users only
router.post('/', verifyJWT, createBooking);

//  Authenticated users only (can only see own booking)
router.get('/customer/:id', verifyJWT, getBookingById);

//  Authenticated users can see their own bookings
router.get('/user', verifyJWT, getUserBookings); //previosly /user/:userId

//  Admin only: View a booking by ID
router.get('/admin/:id', verifyJWT, isAdmin, getBookingByIdAdmin);

//  Admin only: View all booking 
// This route was not working as expected, so I commented it out.
// router.get('/admin', verifyJWT, isAdmin, getAllBookingAdmin); 
router.get('/', verifyJWT, isAdmin, getAllBookingAdmin);


//  Authenticated users can cancel
router.patch('/:id/cancel', verifyJWT, cancelBooking);

//  Authenticated users confirm payment
router.patch('/:id/pay', verifyJWT, confirmPayment);


// get all villa owner bookings
router.get("/villaowner",verifyJWT,getAllVillaOwnerBookings)


export default router;
