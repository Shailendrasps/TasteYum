const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Step 1 — Create a Razorpay order (amount is in rupees, converted to paise here)
router.post('/payment/create-order', async (req, res) => {
    try {
        const { amount } = req.body;
        const order = await razorpay.orders.create({
            amount:   Math.round(amount * 100), // paise
            currency: 'INR',
            receipt:  `receipt_${Date.now()}`,
        });
        res.json({ success: true, order });
    } catch (err) {
        console.error('Razorpay create-order error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Step 2 — Verify the payment signature returned by Razorpay
router.post('/payment/verify', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // HMAC-SHA256 of "order_id|payment_id" signed with key_secret
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        res.json({ success: true, paymentId: razorpay_payment_id });
    } else {
        res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
});

module.exports = router;
