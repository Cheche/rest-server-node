const express = require('express');
let app = express();
let { tokenVerification, adminRoleVerification } = require('../middlewares/authentication');
let Category = require('../models/category');


app.get('/category', tokenVerification, (req,res) => {
   
    Category.find({})
            .exec((err, category) => {

                if (err) { //internal error
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    category
                });

            }); // Category.find

});



app.get('/category/:id', tokenVerification, (req,res) => {
    
    let id = req.params.id;
    
    Category.findById(id, (err, categoryDB) => {

        if (err) { //internal error
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) { //id not found
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'ID not found.'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });

    });

});



app.post('/category', tokenVerification ,(req,res) => {
    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user.id
    });

    category.save( (err, categoryDB) => {
        
        if (err) { //internal error
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) { // error on create data db
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // All ok.. response with data created
        res.json({
            ok: true,
            category: categoryDB
        });

    }); // end category.save

});



app.put('/category/:id', tokenVerification, (req,res) => {
    let id = req.params.id;
    let body = req.body;

    let updateCategory = {
        description: body.description
    }; 

    Category.findByIdAndUpdate( id, updateCategory, { new: true, runValidators: true }, (err, categoryDB) => {

        if (err) { // internal error
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) { // error on create
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });

    });// end findByIdAndUpdate
});



app.delete('/category/:id', [tokenVerification, adminRoleVerification],(req,res) => {
    let id = req.params.id;

    Category.findByIdAndRemove( id, (err, categoryDB) =>{
        
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID not found'
                }
            });
        }
        
        res.json({
            ok: true,
            message: 'Category delete.'
        });
    });
});



module.exports = app;