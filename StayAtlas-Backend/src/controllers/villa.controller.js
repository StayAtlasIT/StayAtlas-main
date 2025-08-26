import sendEmail from "../utils/sendEmail.js";
import { Villa } from "../models/villa.model.js";
import Booking from "../models/booking.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import { OwnerVillaSchema, AdminVillaSchema, UpdateAdminVillaSchema, UpdateOwnerVillaSchema } from "../validators/villa.validator.js";
import {User} from "../models/user.model.js";
import { uploadMultipleImagesParallel } from "../utils/cloudinary.js";

// Create a new villa (owners limited, admin full)
export const createVilla = asyncHandler(async (req, res) => {
  const files = req.files || [];
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not authenticated");
  }

  if (!Array.isArray(files) || files.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  const localPathArray = files.map(file => file.path);

  // Upload concurrently with backpressure safety
  const cloudinaryResponse = await uploadMultipleImagesParallel(localPathArray, "villa");

  if (cloudinaryResponse.length < req.files.length) {
    return res.status(400).json(
      new ApiResponse(
        200,
        { failedUploads: req.files.length - cloudinaryResponse.length },
        "Some images failed to upload. Please try again."
      )
    );
  }

  const publicUrls = cloudinaryResponse.map(res => res.secure_url);
  req.body.images = publicUrls;

  const parsed = OwnerVillaSchema.safeParse(req.body);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map(e => e.message).join(", ");
    throw new ApiError(400, errorMessage);
  }

  const validatedData = parsed.data;

  const villa = await Villa.create({
    ...validatedData,
    ownerId: userId,
    images: publicUrls,
    status: "pending" 
  });

  // ======= EMAIL FLOW START =======

// ======= 1️⃣ Mail to Admin =======
await sendEmail({
  to: process.env.ADMIN_EMAIL,
  subject: `New Villa Submitted: ${villa.villaName}`,
  html: `
    <h3>New Villa Submitted by ${villa.villaOwner}</h3>
    <p><strong>Villa Name:</strong> ${villa.villaName}</p>
    <p><strong>Owner:</strong> ${villa.villaOwner} (${villa.email})</p>
    <p><strong>Phone:</strong> ${villa.phoneNumber || "N/A"}</p>
    <p><strong>Address:</strong> ${villa.address.street}, ${villa.address.landmark || ''}, ${villa.address.city}, ${villa.address.state}, ${villa.address.country} - ${villa.address.zipcode}</p>
    <p><strong>Submission Date:</strong> ${new Date().toLocaleString()}</p>
    <p>Please review this villa </p>
  `,
});

// ======= 2️⃣ Mail to Owner =======
await sendEmail({
  to: villa.email,
  subject: `Your Villa "${villa.villaName}" is Under Review`,
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
                  <h2 style="color: #006A4E; font-size: 20px; margin: 0;">Villa Submission Received!</h2>
                  <p style="color: #555; font-size: 12px;">Thank you for listing your villa with StayAtlas</p>
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
                  Our admin team will review your villa submission within 2-3 working days. You will be notified once the villa is approved or rejected. Please ensure all details are accurate.
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

});

// Update villa by ID
export const updateVilla = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isAdmin = req.user.role === "ADMIN";

  const existingVilla = await Villa.findById(id);
  if (!existingVilla || existingVilla.isDeleted) {
    throw new ApiError(404, "Villa not found");
  }

  const isOwner = existingVilla.ownerId.toString() === req.user._id.toString();
  if (!isAdmin && !isOwner) {
    throw new ApiError(403, "You are not authorized to update this villa");
  }

  const schema = isAdmin ? UpdateAdminVillaSchema : UpdateOwnerVillaSchema;
  const validatedData = schema.parse(req.body);

  // Owners' updates reset approval status
  if (!isAdmin) {
    validatedData.approvalStatus = "pending";
    validatedData.approvalComment = "";
  }

  const updatedVilla = await Villa.findByIdAndUpdate(id, validatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(
    new ApiResponse(200, updatedVilla, "Villa updated successfully")
  );
});

// Soft delete a villa
export const deleteVilla = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const villa = await Villa.findById(id);

  if (!villa || villa.isDeleted) {
    throw new ApiError(404, "Villa not found");
  }

  const isOwner = villa.ownerId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You are not authorized to delete this villa");
  }

  villa.isDeleted = true;
  await villa.save();

  res.status(200).json(
    new ApiResponse(200, null, "Villa deleted successfully")
  );
});

// Get all approved, non-deleted villas
export const getAllApprovedVillas = asyncHandler(async (req, res) => {
const { city, minPrice, maxPrice, amenities, rooms } = req.query;

const filters = {
approvalStatus: "approved",
isDeleted: { $ne: true },
};

if (city?.trim()) {
  filters["address.city"] = { $regex: new RegExp(`^${city.trim()}$`, "i") };
}


if (minPrice || maxPrice) {
filters.pricePerNight = {};
if (minPrice) filters.pricePerNight.$gte = Number(minPrice);
if (maxPrice) filters.pricePerNight.$lte = Number(maxPrice);
}

if (rooms) {
filters.numberOfRooms = { $gte: Number(req.query.rooms) };
}

// amenities: comma-separated values
if (amenities) {
  const amenityArray = amenities
    .split(",")
    .map((a) => a.trim())
    .filter((a) => a.length > 0);

  filters.$and = amenityArray.map((val) => ({
    amenities: {
      $elemMatch: {
        $regex: new RegExp(`^${val.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
      },
    },
  }));
}


const villas = await Villa.find(filters);

res.status(200).json(
new ApiResponse(200, villas, "Approved villas fetched successfully")
);
});

// Get one approved, non-deleted villa by ID
export const getApprovedVillaById = asyncHandler(async (req, res) => {
  // console.log(req.params)
  const { id } = req.params;
  const userId = req.user?._id; // Optional chaining - user might not exist

  const villaId = id;

  const villa = await Villa.findOne({
    _id: villaId,
    approvalStatus: "approved",
    isDeleted: { $ne: true },
  });

  if (!villa) {
    throw new ApiError(404, "Villa not found or not approved");
  }

  console.log(villa)
  
  // Only update recently viewed if user is authenticated
  if (userId) {
    const user = await User.findById(userId);
    
    if (user) {
      user.recentlyViewed = user.recentlyViewed.filter(
        (v) => v.villaId.toString() !== villaId
      );

      user.recentlyViewed.unshift({ villaId });

      user.recentlyViewed = user.recentlyViewed.slice(0, 10);

      await user.save();
    }
  }

  res.status(200).json(
    new ApiResponse(200, villa, "Approved villa fetched successfully")
  );
});

// Owner can see all their villas whether it is pending, rejected or approved
export const getMyVillas = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const villas = await Villa.find({
    ownerId,
    isDeleted: { $ne: true }, // only show active villas
  }).sort({ createdAt: -1 }); // newest first

  res.status(200).json(
    new ApiResponse(200, villas, "Fetched all villas for current owner")
  );
});


export const getExclusiveVilla = asyncHandler(async (req, res) => {
  const { location, checkIn, checkOut, guests, rooms } = req.query;

  const filters = {
    isExclusive: true,
    isDeleted: { $ne: true }, // still ensure it's not deleted
    approvalStatus: "approved",
  };

  // Filter by location (city)
  if (location?.trim()) {
    filters["address.city"] = { $regex: new RegExp(location.trim(), "i") };
  }

  // Filter by number of rooms
  if (rooms) {
    filters.numberOfRooms = { $gte: Number(rooms) };
  }

  // Filter by guest capacity (if villa has guest capacity field)
  if (guests) {
    // Assuming there's a guestCapacity field in the villa model
    // If not, you might need to add this field to the model
    filters.guestCapacity = { $gte: Number(guests) };
  }

  // Filter by availability dates (checkIn and checkOut)
  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Add availability filter - villas that have availability during the requested dates
    filters.availability = {
      $elemMatch: {
        start: { $lte: checkInDate },
        end: { $gte: checkOutDate },
        isAvailable: true
      }
    };
  }

  const exclusiveVillas = await Villa.find(filters).sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, exclusiveVillas, "Fetched exclusive villas with search filters")
  );
});


// export const viewVilla = asyncHandler(async (req, res) => {
//   const { villaId } = req.params;
//   const userId = req.user._id;

//   const user = await User.findById(userId);

 
//   user.recentlyViewed = user.recentlyViewed.filter(
//     (v) => v.villaId.toString() !== villaId
//   );

 
//   user.recentlyViewed.unshift({ villaId });


//   user.recentlyViewed = user.recentlyViewed.slice(0, 10);

//   await user.save();

//   return res
//   .status(200)
//   .json(
//     new ApiResponse(
//       200,
//       [],
//       "success"
//     )
//   );
// });

export const getRecentlyViewed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const recentlyViewedVillas = await Promise.all(
    user.recentlyViewed.map((item) =>
      Villa.findOne({
        _id: item.villaId.toString(),
        approvalStatus: "approved",
        isDeleted: { $ne: true },
      }).select(
        'averageRating reviewCount villaName numberOfRooms images address amenities pricePerNight'
      )
    )
  );

  // Filter out nulls (i.e., rejected/deleted villas)
  const filteredVillas = recentlyViewedVillas.filter(Boolean);

  return res.status(200).json(
    new ApiResponse(
      200,
      filteredVillas,
      "All recently viewed villas"
    )
  );
});

export const getAvailableWeekendVillas = async (req, res) => {
  try {
    // Get upcoming Saturday and Sunday
    const today = new Date();
    const day = today.getDay();
    const daysUntilSaturday = (6 - day + 7) % 7; // Saturday = 6
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + daysUntilSaturday);
    saturday.setHours(0, 0, 0, 0);

    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);
    sunday.setHours(23, 59, 59, 999);

    // Find villas booked during weekend
    const bookedVillas = await Booking.find({
      status: { $in: ["Pending", "Confirmed"] },
      $or: [
        { checkIn: { $lte: sunday }, checkOut: { $gte: saturday } }
      ]
    }).distinct("villa");

    // Get available villas
    const availableVillas = await Villa.find({
      _id: { $nin: bookedVillas },
      approvalStatus: "approved",
      isDeleted: false
    });

    // Separate normal & exclusive
    const normalVilla = availableVillas.find(v => !v.isExclusive);
    const exclusiveVillas = availableVillas.filter(v => v.isExclusive).slice(0, 2);

    res.status(200).json({
      success: true,
      weekendRange: { saturday, sunday },
      normalVilla: normalVilla || null,
      exclusiveVillas
    });
  } catch (error) {
    console.error("Error in getAvailableWeekendVillas:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch weekend villas",
      error: error.message
    });
  }
};

export const searchVillas = async (req, res) => {
  try {
    const { location, start, end, guests, rooms } = req.query;
    console.log("🔍 Incoming Query Params:", { location, start, end, guests, rooms });

    if (!location || !guests) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Step 1: Base filters (match against city + state)
    let filters = {
      $or: [
        { "address.city": { $regex: location, $options: "i" } },
        { "address.state": { $regex: location, $options: "i" } },
        { $expr: { $regexMatch: { input: { $concat: ["$address.city", ", ", "$address.state"] }, regex: location, options: "i" } } },
        { "villaName": { $regex: location, $options: "i" } }
      ]
    };

    // Step 2: Rooms filter
    if (rooms) {
      filters.numberOfRooms = { $gte: Number(rooms) };
    }

    // Step 3: Availability filter
    if (start && end) {
      const bookedVillaIds = await Booking.find({
        $or: [
          { startDate: { $lte: end }, endDate: { $gte: start } }
        ]
      }).distinct("villaId");

      filters._id = { $nin: bookedVillaIds };
    }

    console.log("📌 Pre-filtered Villas Query:", filters);

    // Step 4: Fetch all matching villas first
    let villas = await Villa.find(filters).lean();

    // Step 5: Guests filter (runtime calculation from rooms array)
    // if (guests) {
    //   villas = villas.filter(villa => {
    //     let totalGuests = 0;
    //     if (villa.rooms && villa.rooms.length > 0) {
    //       villa.rooms.forEach(room => {
    //         if (room.guests) {
    //           const match = room.guests.match(/(\d+)/g);
    //           if (match) {
    //             totalGuests += match.reduce((sum, num) => sum + Number(num), 0);
    //           }
    //         }
    //       });
    //     }
    //     return totalGuests >= Number(guests);
    //   });
    // }

    console.log(`✅ Found ${villas.length} villas after guests filter`);
    res.json(villas);
  } catch (error) {
    console.error("❌ Error in villa search:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Lightweight suggestions for search dropdown
// GET /api/v1/villas/suggestions?q=term
export const getVillaSuggestions = asyncHandler(async (req, res) => {
  try {
    const { q } = req.query;

    const query = (q || "").trim();

    const match = query
      ? {
          approvalStatus: "approved",
          isDeleted: { $ne: true },
          $or: [
            { villaName: { $regex: query, $options: "i" } },
            { "address.city": { $regex: query, $options: "i" } },
            { "address.state": { $regex: query, $options: "i" } },
            {
              $expr: {
                $regexMatch: {
                  input: { $concat: ["$address.city", ", ", "$address.state"] },
                  regex: query,
                  options: "i",
                },
              },
            },
          ],
        }
      : {
          approvalStatus: "approved",
          isDeleted: { $ne: true },
        };

    const villas = await Villa.find(match)
      .select("villaName address.city address.state _id")
      .limit(15)
      .lean();

    const suggestions = villas.map((v) => ({
      id: v._id?.toString?.() || v._id,
      villaName: v.villaName,
      city: v.address?.city || "",
      state: v.address?.state || "",
    }));

    return res.status(200).json(new ApiResponse(200, suggestions, "Villa suggestions fetched"));
  } catch (error) {
    console.error("Error in getVillaSuggestions:", error);
    return res.status(500).json(new ApiResponse(500, [], "Failed to fetch suggestions"));
  }
});
