
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const app = express();
const { tokenVerification } = require('../middlewares/authentication');

/**
 * Users controller...
 */

// Get /user
// args: route, middleware, req-res
app.get('/user', tokenVerification, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit ||  5;
    limit = Number(limit);

    let condition = { state: true };            // filter by ...
    let paramsReturn = '';  // 'name email';    // params to return

    User.find(condition, paramsReturn)
        .limit(limit) // per page
        .skip(from)  // skip n-first items
        .exec( (err, users) =>{
            if (err) { // error on save
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.countDocuments(condition, (err,count) =>{
                // no errors
                res.json({
                    ok: true,
                    total: count,
                    users
                });
            })
        });
});
  
  
// Post /user
app.post('/user', function (req, res) {

    let body = req.body;
    if (!body.password) return res.status(400).json({ok:false, message:'Password is required.'});
    const hashPassword = bcrypt.hashSync(body.password, 10);

    let user = new User({
        name: body.name,
        email: body.email,
        password: hashPassword,
        role: body.role
    });

    user.save( (err, userDB) => {
    
        if (err) { // error on save
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // no errors
        res.json({
            ok: true,
            user: userDB
        });

    });

});
  
  
// Put /user/:id
app.put('/user/:id', function (req, res) {
    let id = req.params.id;
    
    // delete object attribures with lib underscore
    let body = _.pick( req.body, ['name', 'email', 'img', 'role', 'state']);

    // Using mongoose
    const opt = {
        new: true,              // return modified object
        runValidators: true     // run validators declared on schema
    };

    // delete object attributes manualy
    // its ok for few attributes
    // delete body.google;
    // delete body.password;
    
    User.findByIdAndUpdate( id, body, opt, (err, userDB) => {
        
        if (err) { // error on update
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // All ok
        res.json({
            ok: true,
            user: userDB
        })
    });


});


// Delete /user/id
app.delete('/user/:id', function (req, res) {
    
    let id = req.params.id;

    // mark record as deleted
    let changeStatus = {
        state: false
    };
    
    User.findByIdAndUpdate(id, changeStatus, { new: true } ,(err, userDelete) => {
        if (err) { // error on change status
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found...'
                }
            });
        }

        // all ok
        res.json({
            ok: true,
            user: userDelete
        });

    });


    // delete physical record
    // User.findByIdAndRemove(id, (err, userDelete) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if ( !userDelete ) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'User not found...'
    //             }
    //         });
    //     }

    //     // all ok
    //     res.json({
    //         ok: true,
    //         user: userDelete
    //     });
    // });

});
  

/**
 * Exports modules
 */
module.exports = app;