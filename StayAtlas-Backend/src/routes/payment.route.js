import { Router } from 'express';
import { createOrder, verifyAndBook } from '../controllers/payment.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateCreateOrder } from "../middlewares/payment.validation.js";

const router = Router();

router.route("/create-order").post(verifyJWT, validateCreateOrder, createOrder);
router.route("/verify-and-book").post(verifyJWT, verifyAndBook);

export default router;