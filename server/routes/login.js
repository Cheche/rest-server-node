const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


/**
 * Login Controller
 * 
 */

app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne( { email: body.email }, (err, userDB) =>{
        
        if (err) { // error
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !userDB ) { // user error...
            return res.status(400).json({
                ok: false,
                err: {
                    message: "User or Password are wrong."
                }
            });
        }

        if ( !bcrypt.compareSync(body.password, userDB.password) ) { // password are wrong
            return res.status(400).json({
                ok: false,
                err: {
                    message: "User or Password are wrong."
                }
            });
        } 

        // Generate Token
        let token = jwt.sign(
                    { user: userDB },
                    process.env.JWT_SH,
                    { expiresIn: process.env.JWT_TTE }
                    );

        // All good for response
        res.json({
            ok: true,
            user: userDB,
            token
        });

    });

});


// config google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    // user google data
    const payload = ticket.getPayload();
    
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
  

// google signin validation
app.post('/google', async (req, res) => {
    
    let token = req.body.idtoken;

    let googleUser = await verify(token)
            .catch( e => {
                return res.status(403).json({
                    ok: false,
                    err: e
                });
            });
    
    User.findOne( {email: googleUser.email }, (err, userDB) => {
       if (err) {
           return res.status(500).json({
               ok: false,
               err
           });
       }

       if (userDB) { // user exist

         if (userDB.google === false) { // user is not google acount
           
            return res.status(400).json({
             ok: false,
             err: {
               message: "Use traditional authentication."
             }
           });

         } else { // user is google account

           let token = jwt.sign(
               { user: userDB }, 
               process.env.JWT_SH, 
               { expiresIn: process.env.JWT_TTE }
            );

           return res.json({
             ok: true,
             user: userDB,
             token: token
           });
         }

       } else { // new user first time with google

         let user = new User();
         user.name = googleUser.name;
         user.email = googleUser.email;
         user.img = googleUser.img;
         user.google = true;
         user.password = ':)';

         user.save( (err, userDB) => {
             if (err) {
                 return res.status(500).json({
                     ok:false,
                     err
                 });
             }

             let token = jwt.sign(
                { user: userDB }, 
                process.env.JWT_SH, 
                { expiresIn: process.env.JWT_TTE }
             );
 
            return res.json({
              ok: true,
              user: userDB,
              token: token
            });
         });

          
       }

    });

});


/**
 * Exports modules
 */
 module.exports = app;