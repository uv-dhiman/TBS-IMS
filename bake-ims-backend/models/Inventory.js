const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  ingredientName: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, default: 'Sufficient' }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema); 