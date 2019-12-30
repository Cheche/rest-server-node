const express = require('express');             // express
const app = express();  


/**
 * All Routes declares
 */
app.use( require('./users') );                   // Import users routes
app.use( require('./login') );                   // Import login routes
app.use( require('./category') );                   // Import login routes



/**
 * Exports modules
 */
module.exports = app;