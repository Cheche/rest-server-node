var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: { type: String, required: [true, 'Name field is required'] },
    unitPrice: { type: Number, required: [true, 'Unit price field is required'] },
    description: { type: String, required: false },
    img: { type: String, required: false },
    avalaible: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Product', productSchema);