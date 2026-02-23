const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');
const Counter = require('../models/Counter');

// Order progresses automatically for demo purposes
// Placed → Preparing (20s) → Out for Delivery (60s) → Delivered (120s)
const STAGES = ['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
const DELAYS  = [20000, 60000, 120000];

async function generateOrderId() {
    // Atomic increment — safe under concurrent requests
    const counter = await Counter.findOneAndUpdate(
        { _id: 'orderId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }   // create counter doc if it doesn't exist yet
    );
    // Format as ORD-1001, ORD-1002, ...
    return `ORD-${String(counter.seq + 1000).padStart(4, '0')}`;
}

function simulateOrderProgress(io, orderId, email) {
    DELAYS.forEach((delay, index) => {
        setTimeout(async () => {
            const status = STAGES[index + 1];
            try {
                await OrderStatus.findOneAndUpdate(
                    { orderId },
                    { status, updatedAt: new Date() }
                );
                io.to(email).emit('orderStatusUpdate', { orderId, status });
                console.log(`Order ${orderId} → ${status}`);
            } catch (err) {
                console.error('Status update error:', err);
            }
        }, delay);
    });
}

router.post('/orderData', async (req, res) => {
    const orderId = await generateOrderId();
    const email   = req.body.email;
    let data      = req.body.order_data;

    // Prepend order metadata (date + unique id) as the first element
    data.splice(0, 0, { Order_date: req.body.Order_date, orderId });

    try {
        const existing = await Order.findOne({ email });
        if (!existing) {
            await Order.create({ email, order_data: [data] });
        } else {
            await Order.findOneAndUpdate({ email }, { $push: { order_data: data } });
        }

        // Create a status document and emit initial event
        await OrderStatus.create({ orderId, email, status: 'Order Placed' });

        const io = req.app.get('io');
        io.to(email).emit('orderStatusUpdate', { orderId, status: 'Order Placed' });
        simulateOrderProgress(io, orderId, email);

        res.json({ success: true, orderId });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false });
    }
});

router.post('/myorderData', async (req, res) => {
    try {
        const myData = await Order.findOne({ email: req.body.email });
        if (!myData) return res.json({ orderData: [], statusMap: {} });

        const orders = [...myData.order_data].reverse();

        // Fetch live statuses for all orders
        const orderIds = orders.map(o => o[0]?.orderId).filter(Boolean);
        const statuses = await OrderStatus.find({ orderId: { $in: orderIds } });
        const statusMap = {};
        statuses.forEach(s => { statusMap[s.orderId] = s.status; });

        res.json({ orderData: orders, statusMap });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

module.exports = router;
