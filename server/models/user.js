/**
 * Module User Data for monggose
 * Set properties, types and constraints...
 */

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

/**
 * Roles validator
 * Only accept roles declared in values
 */
let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};


/**
 * User Schema
 */
let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


/**
 * Remove password on method toJSON 
 */
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

/**
 * Set plugins 
 * unique validator for mongoose
 * seting message for error.
 */
userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único.' } );


/**
 * Export Schema
 */
module.exports = mongoose.model( 'User', userSchema );