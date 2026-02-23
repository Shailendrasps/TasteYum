const mongoose = require('mongoose');

// Stores the last used sequence number for each counter name.
// findOneAndUpdate with $inc is atomic — safe under concurrent requests.
const CounterSchema = new mongoose.Schema({
    _id:  { type: String, required: true },  // counter name e.g. "orderId"
    seq:  { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', CounterSchema);
