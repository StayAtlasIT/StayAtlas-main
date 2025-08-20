import { body, validationResult } from 'express-validator';

export const validateCreateOrder = [
    body('amount').isNumeric().isInt({ min: 100 }).withMessage('Amount must be at least ₹1'),
    body('idempotencyKey').isString().isLength({ min: 10 }).withMessage('Invalid idempotency key'),
    body('bookingData.villa').isMongoId().withMessage('Invalid villa ID'),
    body('bookingData.checkIn').isISO8601().withMessage('Invalid check-in date'),
    body('bookingData.checkOut').isISO8601().withMessage('Invalid check-out date'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];