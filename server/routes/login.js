const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

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


/**
 * Exports modules
 */
 module.exports = app;