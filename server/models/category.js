/**
 * Module Category Data for monggose
 * Set properties, types and constraints...
 */

const mongoose = require('mongoose');
let Schema = mongoose.Schema;


/**
 * Category Schema
 */
let categorySchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'La descripcion es requerida.']
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }
});


/**
 * Export Schema
 */
module.exports = mongoose.model( 'Category', categorySchema );