const mongoose = require('mongoose');

const OrderStatusSchema = new mongoose.Schema({
    orderId:   { type: String, required: true, unique: true },
    email:     { type: String, required: true },
    status:    {
        type: String,
        enum: ['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered'],
        default: 'Order Placed'
    },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OrderStatus', OrderStatusSchema);
