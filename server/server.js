/**
 * Server File.
 * Express, Mongoose and others are configured in this file
 * 
 */


require('./config/config');                     // config file
const express = require('express');             // express
const mongoose = require('mongoose');           // mongoose -> mongodb
const bodyParser = require('body-parser');      // bodyparser for request
const path = require('path');                   // manager for paths and urls

const app = express();                          // Express App

/**
 * Middlewares
 */

app.use( express.static( path.resolve(__dirname , '../public') ) );    // public folder...
app.use( bodyParser.urlencoded( { extended:false } ) ); // Parser x-www-form-urlencoded
app.use( bodyParser.json() );                           // Parse application/json
app.use( require('./routes/index') );                   // Import All routes

/**
 * Connect Mongoose
 * change url if you need...
 */
mongoose.connect( process.env.URLDB, 
                  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
                  (err, res) => {

  // Check errors
  if ( err ) {
    console.log('Error', err);
    throw err;
  }
  
  // All Good, no erros
  console.log('DataBase Online.');
});



/**
 * Server listening
 * When server is ready notify the port configuration
 */
app.listen( process.env.PORT, () => {
    console.log("Server ready. Listening on port:", process.env.PORT);
})