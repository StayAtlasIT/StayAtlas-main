import mongoose from "mongoose"

const addressSchema = new mongoose.Schema(
    {
        street: { type: String, required: true },
        landmark: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipcode: { type: String, required: true }
    },
    { _id: false }
)

const availabilitySchema = new mongoose.Schema(
    {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
        isAvailable: { type: Boolean, default: true }
    },
    { _id: false }
)

const pricingSchema = new mongoose.Schema(
    {
        weekday: {
            type: Number,
            default: 0,
            required: true
        },
        weekend: {
            type: Number,
            default: 0,
            required: true
        },
        setBy: {
            type: String,
            enum: ["admin", "owner"],
            default: "admin"
        },
        currency: {
            type: String,
            default: "INR"
        }
    },
    { _id: false }
)

const villaSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        villaOwner: {
            type: String,
            required: true
        },
        villaName: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        description: {
            type: String
        },

        phoneNumber: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        numberOfRooms: {
            type: Number
        },

        numberOfBathrooms: {
            type: Number,
            default: 0
        },

        guestCapacity: {
            type: Number,
            default: function() {
                return this.numberOfRooms ? this.numberOfRooms * 2 : 0;
            }
        },

        images: [
            {
                type: String,
                required: true
            }
        ],

        address: {
            type: addressSchema,
            required: true
        },

        amenities: [
            {
                type: String
            }
        ],

        propertyType: {
            type: String
        },

        pricePerNightBoth: {
            type: pricingSchema
            //required:true
        },

        category: [
            {
                type: String
            }
        ],

        availability: [availabilitySchema],

        rooms: [
            {
                name: String,
                floor: String,
                guests: String,
                equipped: String,
                bathroom: String,
                image: String,
                bedType: String
            }
        ],
        realMoments: [
            {
                video: String,
                name: String,
                date: String
            }
        ],

        discountPercent: {
            type: Number,
            min: 0,
            max: 100
        },

        promotionText: {
            type: String
        },

        isExclusive: {
            type: Boolean,
            default: false
        },

        approvalStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },

        approvalComment: {
            type: String
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        approvedAt: {
            type: Date
        },
        rejectedReason: {
            type: String
        },
        rejectedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        averageRating: {
            type: Number,
            default: 0
        },
        reviewCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

villaSchema.virtual("pricePerNight").get(function () {
    const day = new Date().getDay()
    const isWeekend = day === 0 || day === 6
    return isWeekend
        ? this.pricePerNightBoth?.weekend
        : this.pricePerNightBoth?.weekday
})

export const Villa = mongoose.model("Villa", villaSchema)
