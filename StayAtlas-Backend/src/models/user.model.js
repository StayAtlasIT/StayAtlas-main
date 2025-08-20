import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import crypto from "crypto"

dotenv.config()
const userSchema = new Schema(
    {
        firstName:{
            type:String,
            required:true,
            lowercase:true,
            trim:true,
            index:true
        },
        lastName:{
            type:String,
            require:true,
            lowercase:true,
            trim:true,
            sparse:true,
            index:true 
        },
       
        username: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            lowercase: true,
            required: function() { return this.authProvider === 'local'; }, 
        },
        phoneNumber: {
            type: String,
            required: function() { return this.authProvider === 'local'; },
            match: [/^\d{10}$/, 'Phone number must be 10 digits'], 
            unique: true, 
            sparse: true, 
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true, 
            unique: true,
        },
        password: {
            type: String,
            required: function() { return this.authProvider === 'local'; }
        },
        role: {
            type: String,
            enum: ['defaultUser', 'villaOwner', 'admin'],
            required: true,
            default: 'defaultUser'  
        },
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local',
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
            select: false,
        },
        googleProfile: {
            id: String,
            email: String,
            firstName: String,
            lastName: String,
            picture: String,
        },
        refreshToken: {
            type: String
        },
        resetPasswordToken:{
            type: String
        },
        resetPasswordExpire:{
            type: Date
        },
        notifications: [
        {
            message: String,
            date: { type: Date, default: Date.now },
            isRead: { type: Boolean, default: false }
        },
        ],
        
        isBanned: { type: Boolean, default: false },
        banReason: { type: String, default: "" },
        bannedAt: { type: Date },

        bookingHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        }
        ],
        recentlyViewed: [
            {
                villaId: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'Villa' 
                },
                viewedAt: { 
                    type: Date, 
                    default: Date.now 
                }
            }
        ],
    },
    {
        timestamps:true,
        versionKey:false
    }
)

userSchema.pre('save', async function(next){
    if (this.authProvider === 'local' && this.isModified("password")) {
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    if (this.authProvider === 'local' && this.password) {
        return await bcrypt.compare(password, this.password);
    }
    return false;
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
          _id: this._id,
          email: this.email,
          phoneNumber: this.phoneNumber,
          role: this.role,
          username: this.username, 
            
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; 

    return resetToken;
};
export const User = mongoose.model("User",userSchema)
