import { User } from "../models/user.model.js";
import { Villa } from "../models/villa.model.js";
import Booking  from "../models/booking.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/paginate.js";
import { AdminVillaSchema } from "../validators/villa.validator.js";
import { VillaReview } from "../models/review.model.js";
import sendEmail from "../utils/sendEmail.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllPendingVillas = asyncHandler(async(req,res)=>{
    const {page, limit, skip} = getPagination(req)

    const pendingVillas = await Villa.find(
        {approvalStatus:"pending",isDeleted:false}
    )
    .populate("ownerId","firstName lastName phoneNumber email")
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
     
    //console.log(pendingVillas)
    if(!pendingVillas.length){
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    count:pendingVillas.length
                },
                "NO PENDING VILLAS PRESENT"
            )
        )
    }

    const totalCount = await Villa.countDocuments(
        {
            approvalStatus:"pending",isDeleted:false
        }
    )
    //console.log(totalCount)
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                villas:pendingVillas,
                page,
                totalpage:Math.ceil(totalCount/limit),
                totalCount
            },
            "Pending Villas"
        )
    )
})

const getAllApprovedVillas = asyncHandler(async(req,res)=>{
    const {page, limit, skip} = getPagination(req)

    const approvedVillas = await Villa.find(
        {approvalStatus:"approved",
            // isDeleted:false
        }
    )
    .populate("ownerId","firstName lastName phoneNumber email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

    if(!approvedVillas.length){
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "NO APPROVED VILLAS PRESENT"
            )
        )
    }

    const totalCount = await Villa.countDocuments(
        {
            approvalStatus:"approved",isDeleted:false
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                villas:approvedVillas,
                page,
                totalpage:Math.ceil(totalCount/limit),
                totalCount
            },
            "Approved Villas"
        )
    )
})

const getAllRejectedVillas = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req);

  const rejectedVillas = await Villa.find({
    approvalStatus: "rejected"
  })
    .populate("ownerId", "firstName lastName phoneNumber email")
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);

  if (!rejectedVillas.length) {
    return res.status(200).json(
      new ApiResponse(200, [], "NO VILLAS ARE REJECTED")
    );
  }

  const totalCount = await Villa.countDocuments({
    approvalStatus: "rejected"
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        villas: rejectedVillas,
        page,
        totalPage: Math.ceil(totalCount / limit), 
        totalCount
      },
      "Rejected Villas"
    )
  );
});


const reviewPendingVillas = asyncHandler(async(req,res)=>{
    const { id:villaId } = req.params;

    if (!villaId) {
        throw new ApiError(400,"Villa id is required")
    }

    const villa = await Villa.findOne({
        _id: villaId,
        isDeleted: false,
        approvalStatus:"pending"
    }).select("-_id -ownerId");

    if (!villa) {
        throw new ApiError(404,"Villa not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            villa,
            "Villa for review"
        )
    )
})

const ApprovePendingVillas = asyncHandler(async (req, res) => {
  const { id: villaId } = req.params;

  if (!villaId) {
    throw new ApiError(400, "Villa id is required");
  }

  // Populate owner details
  const villa = await Villa.findOne({ _id: villaId, isDeleted: false });

  if (!villa) {
    throw new ApiError(404, "Villa not found");
  }

  if (villa.approvalStatus === "approved") {
    throw new ApiError(400, "Villa is already approved");
  }

  // Review and edit villa details before approval
  const parsed = AdminVillaSchema.safeParse(req.body);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map(e => e.message).join(", ");
    throw new ApiError(400, errorMessage);
  }

  const validParsedData = parsed.data;
  Object.assign(villa, validParsedData);

  // Approve villa
  villa.approvalStatus = "approved";
  villa.approvedAt = new Date();
  villa.approvedBy = req.user._id;

  await villa.save();

  // Check if it's the user's first approved villa
  const approvedCount = await Villa.countDocuments({
    ownerId: villa.ownerId,
    approvalStatus: "approved",
  });

  if (approvedCount === 1) {
    // First approved villa — upgrade user role
    await User.findByIdAndUpdate(villa.ownerId, { role: "villaOwner" });
  }

  // ======= EMAIL TO OWNER =======
 // ======= EMAIL TO OWNER =======
await sendEmail({
  to: villa.email, // owner email from villa schema
  subject: `Your Villa "${villa.villaName}" is Approved!`,
  html: `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f2f2f2; padding: 16px;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; font-family: 'Segoe UI', sans-serif;">
            <tr>
              <td style="padding: 24px;">

                <!-- Logo + Header -->
                <div style="text-align: center; margin-bottom: 20px;">
                  <img src="cid:logo" alt="StayAtlas Logo" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 10px;" />
                  <h2 style="color: #006A4E; font-size: 20px; margin: 0;">Villa Approved!</h2>
                  <p style="color: #555; font-size: 12px;">Congratulations on your listing with StayAtlas</p>
                </div>

                <!-- Villa Summary -->
                <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; border-left: 4px solid #006A4E; margin-bottom: 24px;">
                  <h3 style="color: #333; margin-bottom: 12px; text-align: center; text-transform: uppercase; font-size: 16px;">
                    Villa Details
                  </h3>
                  <table style="width: 100%; font-size: 12px; color: #333;">
                    <tr><td style="padding: 6px 0;"><strong>Villa Name:</strong></td><td>${villa.villaName}</td></tr>
                    <tr><td style="padding: 6px 0;"><strong>Owner Name:</strong></td><td>${villa.villaOwner}</td></tr>
                    <tr><td style="padding: 6px 0;"><strong>Email:</strong></td><td>${villa.email}</td></tr>
                    <tr><td style="padding: 6px 0;"><strong>Phone:</strong></td><td>${villa.phoneNumber || "N/A"}</td></tr>
                    <tr><td style="padding: 6px 0;"><strong>Address:</strong></td><td>${villa.address.street}, ${villa.address.landmark || ''}, ${villa.address.city}, ${villa.address.state}, ${villa.address.country} - ${villa.address.zipcode}</td></tr>
                  </table>
                </div>

                <!-- Note -->
                <p style="color: #333; font-size: 13px;">
                  Your villa has been successfully approved by our admin team and is now live on StayAtlas. Guests can now book your villa. 
                  Thank you for listing your property with us!
                </p>

                <!-- Footer -->
                <div style="text-align: center; margin-top: 24px;">
                  <p style="color: #aaa; font-size: 11px;">&copy; ${new Date().getFullYear()} StayAtlas. All rights reserved.</p>
                </div>

              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `,
   attachments: [
          {
            filename: "stay-15xAdS51.jpg",
            path: "./public/stay-15xAdS51.jpg",
            cid: "logo",
          },
        ],
});

  // ======= EMAIL END =======

  return res.status(200).json(
    new ApiResponse(200, villa, "Villa approved successfully")
  );
});




//for modification of prise discount prise images etc
const editVillaDetailsById = asyncHandler(async (req, res) => {
    const {id:villaId} = req.params; 
    if (!villaId) {
      throw new ApiError(400, "villaId is required!");
    }
  
    const villa = await Villa.findById(villaId);
  
    if (!villa) {
      throw new ApiError(404, "Villa not found!");
    }
  
    // Update the villa details
    const parsed = AdminVillaSchema.safeParse(req.body)
    if(!parsed.success){
        const errorMessage = parsed.error.issues.map(e=>e.message).join(',')
        throw new ApiError(400,errorMessage)
    }
    const villaUpdatedData = parsed.data
    const restrictedFields = [
        "approvalStatus",
        "approvalComment",
        "ownerId",
        "villaOwner",
        "_id",
        "isDeleted",
        "updatedBy",
        "phoneNumber",
        "email"
      ];
      
      restrictedFields.forEach(field => {
        if (field in villaUpdatedData) {
          delete villaUpdatedData[field];
        }
      });
    Object.assign(villa, villaUpdatedData)
    villa.updatedBy = req.user._id
    await villa.save();
  
    // Return the updated villa details in the response
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            villa,
            "villa details updated successfully"
        )
    );
  });
  
  const deleteVillaById = asyncHandler(async (req, res) => {
  const { id: villaId } = req.params;

    // Find the villa by its ID
    const villa = await Villa.findById(villaId);
  
    if (!villa) {
        throw new ApiError(400,"villaId is required!")
    }
  
    // Soft Delete: Set the villa as deleted
    // villa.isDeleted = true;
    villa.approvalStatus = "rejected"
    villa.rejectedReason = req.body.rejectedReason || "Deleted by admin"
    await villa.save();
  
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "villa deleted successfully"
        )
    );
})

export const deleteVillaByAdmin = asyncHandler(async (req, res) => {
  const { villaId } = req.params;
console.log("Incoming ID:", villaId);
  const villa = await Villa.findById(villaId);
  console.log("Found villa: ", villa);
  if (!villa) {
    throw new ApiError(404, "Villa not found");
  }

  await villa.deleteOne();

  res.status(200).json(
    new ApiResponse(200, {}, "Villa deleted successfully by admin")
  );
});

export const rejectVillaByAdmin = asyncHandler(async (req, res) => {
  const { villaId } = req.params;
  const { reason } = req.body;

  const villa = await Villa.findById(villaId);
  if (!villa) {
    throw new ApiError(404, "Villa not found");
  }

  villa.approvalStatus = "rejected";
  villa.approvalComment = reason || "Rejected by admin";
  villa.approvedAt = null;
  villa.approvedBy = req.user?._id;

  await villa.save();

  res.status(200).json(
    new ApiResponse(200, villa, "Villa rejected successfully")
  );
});


//totalvilla approved pending rejected
const totalCountOfVillasByApprovalStatus = asyncHandler(async(req,res)=>{
    // Get total count of villas for each status
    const approvedCount = await Villa.countDocuments({
        approvalStatus: "approved",
        isDeleted: false,
      });
  
      const pendingCount = await Villa.countDocuments({
        approvalStatus: "pending",
        isDeleted: false,
      });
  
      const rejectedCount = await Villa.countDocuments({
        approvalStatus: "rejected",
        isDeleted: false,
      });
  
      const totalVillaOnStayAtlas = approvedCount+pendingCount+rejectedCount
      // Return the counts as a response
      return res
      .status(200)
      .json(
        new ApiResponse(
            200,
            {
                approved: approvedCount,
                pending: pendingCount,
                rejected: rejectedCount,
                totalVillas: totalVillaOnStayAtlas
            },
            "success"
        )
      );
})

const getUserCount = asyncHandler(async (req, res) => {
    const count = await User.countDocuments();

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            { 
                userCount: count 
            },
            count === 0 ? "No users found." : "User count fetched successfully."
        )
    );
});



const approvePendingBookingById = asyncHandler(async (req, res) => {
  try {
    const { id: bookingId } = req.params;

    if (!bookingId) {
      throw new ApiError(400, "Booking ID is required!");
    }

    const booking = await Booking.findById(bookingId)
      .populate("villa")
      .populate("user");

    if (!booking) {
      throw new ApiError(404, "Booking not found!");
    }

    if (booking.status === "Completed") {
      return res.status(400).json({
        message: "Booking Already Completed!",
      });
    }

    // ✅ Extract details
    const villaDetails = booking.villa;
    const userDetails = booking.user;

    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);

    const timeDiff = Math.abs(checkOutDate - checkInDate);
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const guests = booking.guests;

    // ✅ Ensure totalAmount is a valid number
    const totalAmountRaw = booking.totalAmount;
    const totalAmount =
      typeof totalAmountRaw === "number"
        ? totalAmountRaw
        : parseFloat(totalAmountRaw) || 0;

    const paymentMethod = booking.paymentMethod || "Manual/Offline";

    // ✅ Update booking
    booking.status = "Confirmed";
    booking.isPaid = true;

    // 🔥 Required fields ka fix (agar missing ho to set kar de)
    booking.paymentAmount = booking.paymentAmount || totalAmount;
    booking.razorpayOrderId =
      booking.razorpayOrderId || "MANUAL-" + Date.now();
    booking.userContact =
      booking.userContact || userDetails.phoneNumber || "N/A";

    await booking.save();

    // ✅ Send confirmation email
    try {
      await sendEmail({
        to: userDetails.email,
        subject: `Booking Confirmed at ${
          villaDetails?.name || villaDetails?.villaName || "your selected villa"
        }`,
        html: `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f2f2f2; padding: 16px;">
  <tr>
    <td align="center">
      <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; font-family: 'Segoe UI', sans-serif;">
        <tr>
          <td style="padding: 24px;">

            <!-- Logo + Header -->
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="cid:logo" alt="StayAtlas Logo" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 10px;" />
              <h2 style="color: #006A4E; font-size: 20px; margin: 0;">Your Booking is Confirmed!</h2>
              <p style="color: #555; font-size: 12px;">Thank you for booking with StayAtlas</p>
            </div>

            <!-- Booking Summary -->
            <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; border-left: 4px solid #006A4E; margin-bottom: 24px;">
              <h3 style="color: #333; margin-bottom: 12px; text-align: center; text-transform: uppercase; font-size: 16px;">
                Booking Summary
              </h3>
              <table style="width: 100%; font-size: 12px; color: #333;">
                <tr><td style="padding: 6px 0;"><strong>Booking ID:</strong></td><td>STAY${booking._id.toString().slice(-7).toUpperCase()}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Villa:</strong></td><td>${villaDetails?.name || villaDetails?.villaName || "N/A"}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Check-in:</strong></td><td>${checkInDate.toDateString()} at 1:00 PM</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Check-out:</strong></td><td>${checkOutDate.toDateString()} at 11:00 AM</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Total Nights:</strong></td><td>${nights} Night${nights > 1 ? "s" : ""}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Guests:</strong></td><td>${
                  typeof guests === "object"
                    ? `Adults: ${guests?.adults || 0}, Children: ${guests?.children || 0}, Pets: ${guests?.pets || 0}`
                    : guests
                }</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Total Amount:</strong></td><td>₹${totalAmount.toFixed(2)}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Payment Method:</strong></td><td>${paymentMethod}</td></tr>
              </table>
            </div>

            <!-- User Details -->
            <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
              <h3 style="color: #333; margin-bottom: 12px; text-align: center; text-transform: uppercase; font-size: 16px;">
                Booked By
              </h3>
              <table style="width: 100%; font-size: 12px; color: #333;">
                <tr><td style="padding: 6px 0;"><strong>Name:</strong></td><td>${[userDetails.firstName, userDetails.lastName].filter(Boolean).join(" ")}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Email:</strong></td><td>${userDetails.email}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Phone:</strong></td><td>${userDetails.phoneNumber || "N/A"}</td></tr>
              </table>
            </div>

            <!-- Footer Note -->
            <p style="font-size: 11px; color: #777; margin-top: 20px; text-align: center;">
              You will receive further updates regarding your stay. If you have any questions, contact our team anytime.
            </p>

            <!-- Copyright -->
            <div style="text-align: center; margin-top: 24px;">
              <p style="color: #aaa; font-size: 11px;">&copy; ${new Date().getFullYear()} StayAtlas. All rights reserved.</p>
            </div>

          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  `,
        attachments: [
          {
            filename: "stay-15xAdS51.jpg",
            path: "./public/stay-15xAdS51.jpg",
            cid: "logo",
          },
        ],
      });
    } catch (emailError) {
      console.error("Email send failed:", emailError.message);
    }

    return res.status(200).json({
      message: "Booking approved successfully!",
      statusCode: 200,
      booking,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error in approving booking",
      error: err.message,
    });
  }
});







const rejectPendingBookingById = asyncHandler(async (req, res) => {
    try{
        const { id: bookingId } = req.params;
        if (!bookingId) {
            throw new ApiError(400, "Booking ID is required!");
        }
    
        // Find the booking by its ID
        const booking = await Booking.findById(bookingId);
    
        if (!booking) {
            throw new ApiError(404, "Booking not found!");
        }
        if(booking.status === "Completed"){
          return res.status(400).json({
            message:"Booking Already Completed!"
          })
        }
        // Update the booking status to "rejected"
        booking.status = "Cancelled";
        await booking.save();
    
        return res.status(200).json({
            message: "Booking rejected successfully!",
            statusCode:200,
            booking
        });

    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "Error in Rejecting booking",
            error: err.message
        })
    }
})


// this endpoint provides number of users registered in a particular month also it provides total count of users
const getMonthlyUserStats = asyncHandler(async (req, res) => {
  const usersByMonth = await User.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const formattedStats = usersByMonth.map((d) => ({
    month: d._id,
    count: d.count,
  }));

  const total = formattedStats.reduce((acc, curr) => acc + curr.count, 0);

  res.status(200).json(
    new ApiResponse(200, {
      monthlyStats: formattedStats,
      totalCount: total,
    }, "Monthly user registrations with total count")
  );
});

// this endpoint provides number of villas registered in a particular month also it provides total count of villas
const getMonthlyVillaStats = asyncHandler(async (req, res) => {
  const villasByMonth = await Villa.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const formattedStats = villasByMonth.map((d) => ({
    month: d._id,
    count: d.count,
  }));

  const total = formattedStats.reduce((acc, curr) => acc + curr.count, 0);

  res.status(200).json(
    new ApiResponse(200, {
      monthlyStats: formattedStats,
      totalCount: total,
    }, "Monthly villa creations with total count")
  );
});

// this endpoint provides booking's count based on whether they are pending or anything else and total count of bookings
const getBookingStatusStats = asyncHandler(async (req, res) => {
  const statusCounts = await Booking.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  const formatted = {
    Pending: 0,
    Confirmed: 0,
    Cancelled: 0,
    Completed: 0,
  };

  // Fill counts into formatted object
  for (const entry of statusCounts) {
    formatted[entry._id] = entry.count;
  }

  const totalBookings = Object.values(formatted).reduce((acc, curr) => acc + curr, 0);

  res.status(200).json(
    new ApiResponse(200, {
      ...formatted,
      totalBookings
    }, "Booking status statistics")
  );
});

// this endpoint works for providing expected (pending) revenue and confirmed revenue for year
const getBookingRevenueStats = asyncHandler(async (req, res) => {
  const revenueStats = await Booking.aggregate([
    {
      $match: {
        status: { $in: ["Confirmed", "Pending"] }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          status: "$status"
        },
        totalRevenue: { $sum: { $toDouble: "$totalAmount" } }
      }
    },
    {
      $sort: { "_id.year": 1 }
    }
  ]);

  const yearlyStats = {};
  let totalConfirmed = 0;
  let totalExpected = 0;

  for (const entry of revenueStats) {
    const year = entry._id.year;
    const status = entry._id.status;

    if (!yearlyStats[year]) {
      yearlyStats[year] = {
        year,
        confirmedRevenue: 0,
        expectedRevenue: 0
      };
    }

    if (status === "Confirmed") {
      yearlyStats[year].confirmedRevenue = entry.totalRevenue;
      totalConfirmed += entry.totalRevenue;
    } else if (status === "Pending") {
      yearlyStats[year].expectedRevenue = entry.totalRevenue;
      totalExpected += entry.totalRevenue;
    }
  }

  const result = Object.values(yearlyStats);
  result.push({
    year: "Total",
    confirmedRevenue: totalConfirmed,
    expectedRevenue: totalExpected
  });

  res.status(200).json(
    new ApiResponse(200, result, "Yearly revenue statistics with totals")
  );
});



const updateVillaPricing = asyncHandler(async (req, res) => {
  try {
    const { villaId } = req.params;
    
    const { weekday, weekend, setBy, currency } = req.body;
    if (weekday === undefined && weekend === undefined) {
      return res
      .status(400)
      .json(
        new ApiResponse(
            400,
            [],
            "At least one of weekday or weekend price must be provided."
        )
      );
    }

    const updateFields = {};

    if (weekday !== undefined) updateFields["pricePerNightBoth.weekday"] = weekday;
    if (weekend !== undefined) updateFields["pricePerNightBoth.weekend"] = weekend;
    if (setBy) updateFields["pricePerNightBoth.setBy"] = setBy;
    if (currency) updateFields["pricePerNightBoth.currency"] = currency;

    const updatedVilla = await Villa.findByIdAndUpdate(
      villaId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedVilla) {
      return res
      .status(404)
      .json(
        new ApiResponse(
            404,
            [],
            "Villa not found"
        )
      );
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                pricing: updatedVilla.pricePerNightBot
            },
            "Pricing updated successfully."
        )
    );
  } catch (error) {
    console.error("Error updating villa pricing:", error);
    return res
    .status(500)
    .json(
        { 
            error: "Internal server error" 
        }
    );
  }
});

const getAllReviewOfAllVillaByUser = asyncHandler(async (req, res) => {
    try {
        const reviews = await VillaReview.find({status:'pending'}); 
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                reviews,
                'All villa reviews fetched successfully'
            )
        );
    } catch (error) {
        return res
        .status(500)
        .json(
            new ApiError(
                500,
                [],
                'Failed to fetch villa reviews'
            )
        );
    }
});


const approveOrRejectReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { action, rejectionReason } = req.body;

  // Validate action
  if (!['approve', 'reject'].includes(action)) {
    return res
    .status(400)
    .json(
      new ApiResponse(
            400, 
            {}, 
            "Invalid action. Use 'approve' or 'reject'."
        )
    );
  }

  const review = await VillaReview.findById(reviewId);

  if (!review) {
    return res
    .status(404)
    .json(
      new ApiResponse(404, {}, "Review not found")
    );
  }

  if (action === "approve") {
    review.status = "approved";
    review.rejectionReason = undefined; 
  } else {
    review.status = "rejected";
    review.approvalFalg = false;
    review.rejectionReason = rejectionReason || "Rejected by admin";
  }

  await review.save();

  return res
  .status(200)
  .json(
    new ApiResponse(
            200, 
            review,
            `Review ${action}d successfully`
        )
  );
});

const uploadRealMomentVideo = asyncHandler(async (req, res) => {
  try {
    // Multer memoryStorage will give us req.file.buffer
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No video file uploaded" });
    }

    const cld = await uploadOnCloudinary(req.file.buffer, "real-moment-video");
    // cld.secure_url is the playback URL you can store/show on frontend

    return res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      url: cld.secure_url,
      public_id: cld.public_id,
      duration: cld.duration,
      bytes: cld.bytes,
      width: cld.width,
      height: cld.height,
    });
  } catch (err) {
    console.error("Video upload error:", err);
    return res.status(500).json({
      success: false,
      message: "Video upload failed",
      error: err?.message || "Unknown error",
    });
  }
});

export {
    getAllPendingVillas,
    getAllApprovedVillas,
    getAllRejectedVillas,
    reviewPendingVillas,
    ApprovePendingVillas,
    editVillaDetailsById,
    deleteVillaById,
    totalCountOfVillasByApprovalStatus,
    getUserCount,
    approvePendingBookingById,
    rejectPendingBookingById,
    getAllReviewOfAllVillaByUser,
    approveOrRejectReview,
    getMonthlyUserStats,
    getMonthlyVillaStats,
    getBookingStatusStats,
    getBookingRevenueStats,
    updateVillaPricing,
    uploadRealMomentVideo
}