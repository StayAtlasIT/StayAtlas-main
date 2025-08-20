import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema(
    {
        villa: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Villa",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        checkIn: {
            type: Date,
            required: true
        },

        checkOut: {
            type: Date,
            required: true
        },

        guests: {
            adults: { type: Number, default: 1, min: 1 },
            pets: { type: Number, default: 0 },
            children: { type: Number, default: 0 }
        },

        pricePerNightAtBooking: {
            type: mongoose.Types.Decimal128,
            required: true
        },

        nights: {
            type: Number,
            required: true
        },

        discountPercentApplied: {
            type: Number,
            default: 0
        },

        couponCode: {
            type: String
        },
        
        couponDiscountAmount: {
            type: Number,
            default: 0
        },

        totalAmount: {
            type: mongoose.Types.Decimal128,
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["Credit Card", "UPI", "Paypal", "Cash"],
            default: "Credit Card"
        },

        isPaid: {
            type: Boolean,
            default: false
        },

        paidAt: {
            type: Date
        },

        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
            default: "Pending"
        },

        cancellationReason: {
            type: String,
            default: null
        },

        cancelledAt: {
            type: Date,
            default: null
        },

        // Additional charges when total people > max allowed
        additionalCharges: {
            type: Number,
            default: 0
        },

        /* ------------------------------
         * Razorpay Payment Tracking Fields
         * ------------------------------ */
        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        razorpayPaymentId: {
            type: String,
            sparse: true,
            index: true
        },

        razorpaySignature: {
            type: String,
            sparse: true
        },

        paymentStatus: {
            type: String,
            enum: ["created", "processing", "paid", "failed", "refunded"],
            default: "created",
            required: true
        },

        paymentGateway: {
            type: String,
            default: "razorpay"
        },

        paymentAmount: {
            type: Number, // in paise
            required: true
        },

        paymentCurrency: {
            type: String,
            default: "INR"
        },

        userContact: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^\+?[1-9]\d{1,14}$/.test(v);
                },
                message: "Invalid phone number format"
            }
        },

        // Idempotency and retry handling
        idempotencyKey: {
            type: String,
            unique: true,
            sparse: true
        },

        paymentAttempts: {
            type: Number,
            default: 0
        },

        lastPaymentError: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

// Virtual to populate villa details
bookingSchema.virtual("villaDetails", {
    ref: "Villa",
    localField: "villa",
    foreignField: "_id",
    justOne: true
})

// Indexes
bookingSchema.index({ villa: 1, checkIn: 1 })
bookingSchema.index({ user: 1, status: 1 })

export default mongoose.model("Booking", bookingSchema)
