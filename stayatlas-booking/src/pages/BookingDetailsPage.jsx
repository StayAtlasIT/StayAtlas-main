import React from "react";
import { useParams } from "react-router-dom";
import BookingDetail from "../components/BookingDetail";

const BookingDetailsPage = () => {
  // URL se villaId aur bookingId dono params le lo
  const { villaId, bookingId } = useParams();

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* BookingDetail ko bookingId bhej rahe hain */}
      <BookingDetail bookingId={bookingId} />
    </div>
  );
};

export default BookingDetailsPage;
