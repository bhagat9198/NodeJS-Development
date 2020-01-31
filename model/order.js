const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  products: [
    {
      product: {type: Object, required: true},
      quantity: {type: Number, required: true}
    },
  ],
  user: {
    // username: {
      email: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }
});

module.exports = mongoose.model('Order', OrderSchema);