const express = require('express');
const { tokenVerification } = require('../middlewares/authentication');

let app = express();
let Product = require('../models/product');


app.get('/products', tokenVerification, (req, res) => {
    
    let from = Number(req.query.from) || 0;

    Product.find({avalaible: true})
           .skip(from)
           .limit(5)
           .populate('user', 'name email')
           .populate('cactegory', 'description')
           .exec( (err, products) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    product: products
                });

           });
});



app.get('/products/:id', tokenVerification, (req, res) => {

    let id = req.params.id;

    Product.findById(id)
           .populate('user', 'name email')
           .populate('category', 'name')
           .exec( (err, productDB) => {
       
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!productDB) {
                    return res.status(400).json({
                        ok: false,
                        err: { message: 'Product not found'}
                    });
                }

                res.json({
                    ok: true,
                    product: productDB
                });
    });
});


// search
app.get('/products/search/:q', tokenVerification, (req,res) => {

    let q = req.params.q;

    let regex = new RegExp(q, 'i');

    Product.find( { name: regex } )
           .populate('category', 'name')
           .exec((err,product) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    product
                });

           });

});


app.post('/products', tokenVerification, (req, res) => {
    
    let body = req.body;

    let product = new Product({
        user: req.user._id,
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        avalaible: body.avalaible,
        category: body.category
    });

    product.save( (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            product: productDB
        });
    });

});


app.put('/products/:id', tokenVerification, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDB) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Id not found.'}
            });
        }

        productDB.name = body.name;
        productDB.unitPrice = body.unitPrice;
        productDB.category = body.category;
        productDB.avalaible = body.avalaible;
        productDB.description = body.description;

        productDB.save( (err, productSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                product: productSaved
            });
        });

    });
});



app.delete('/products/:id', tokenVerification, (req, res) => {

    let id = req.params.id;

    Product.findById(id, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Product not found'}
            });
        }

        productDB.avalaible = false;

        productDB.save((err, productDelete) => {
        
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            res.json({
                ok: true,
                product: productDB,
                message: 'Product are delete'
            });
        });
    });

});


module.exports = app;