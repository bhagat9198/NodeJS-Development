// as we have done in past, we have to create one seprate collection for 'orders'.
// thus creating the orders model

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  products: [
    {
      // here we are deifinig 'product' is of type object. if we want we define this product object more in-depth
      product: {type: Object, required: true},
      quantity: {type: Number, required: true}
    },
  ],
  user: {
    username: {
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