import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

// ✅ Health check route (for Render & monitoring)
app.get("/healthz", (req, res) => {
    res.status(200).json({ status: "ok" });
});

//import routes
import userRouter from "./routes/user.route.js";
import villaRoutes from './routes/villa.route.js';
import bookingRouter from "./routes/booking.route.js";
import adminRouter from "./routes/adminAction.route.js";
import reviewRoutes from "./routes/review.route.js";
import offerRoutes from "./routes/offer.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import bookingSearchRoutes from "./routes/bookingSearchRoutes.js";
// import experienceRouter from "./routes/experience.route.js";
import PaymentRouter from "./routes/payment.route.js"


//route declaration 
app.use("/api/v1/users", userRouter);
app.use('/api/v1/villas', villaRoutes);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/reviews', reviewRoutes);
app.use("/api/v1/villas", bookingSearchRoutes);
app.use("/api/v1/offers", offerRoutes);
// app.use('/api/v1/shareexperience', experienceRouter);
app.use('/api/v1/payments', PaymentRouter)

app.get("/", (req, res) => {
    res.send("🚀 StayAtlas Backend is live. Visit /api/v1 for API routes.");
  });  

app.use(errorHandler);
export { app };
