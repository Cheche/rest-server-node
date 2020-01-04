const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

// Schemas
const User = require('../models/user');
const Product = require('../models/product');


// MIDDLEWARES
// default options
app.use(fileUpload()); 


/**
 * Upload files.
 * 
 * @param {String}  type - [users, products] With what class to associate the file. 
 * @param {String}  id   -                   Id to wich the file must be associated.
 * @param {File}    file -                   File upload for associate. Accepted types: jpg, jpeg, png.
 * @return {JSON}                            Response errors or succesfull upload
 */
app.put('/upload/:type/:id', function(req, res) {
    
    let type = req.params.type;
    let id = req.params.id;

    // if not file return error
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            err: { message: 'No files were uploaded.'}
        });
    }

    // validate type [products, users]. 
    // Have same name inside of uploads folder.
    let permitedType = ['products', 'users'];
    if (permitedType.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Type associative error. Only accept ' + permitedType.join(', '),
                received: type
            }
        });
    }

    // The name of the input field (i.e. "file") is used to retrieve the uploaded file
    let file = req.files.file;

    // Validate extension type
    let typeFilesAccepted = ['png','jpg','jpeg'];
    let fileNameExtension = file.name.split('.');
    let extension = fileNameExtension[fileNameExtension.length -1];

    if (typeFilesAccepted.indexOf( extension ) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extension Type file error. Only accept ' + typeFilesAccepted.join(', '),
                received: extension
            }
        });
    }


    // new name for file upload, prevent overwrite files
    // format userid-milliseconds e.g.  iduser-12313.jpg
    let renamedFile = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // Use the mv() method to place the file somewhere on your server
    // example uploads/users/imgfile    uploads/products/imgfile 
    file.mv(`uploads/${type}/${ renamedFile }`, (err) => {
        
        if (err) { // error to place file.
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        // File saved on folder
        if ( type === 'users' ) {
            imgUser(id,res, renamedFile);
        } else {
            imgProduct(id,res, renamedFile);
        }


    });
    
});


/**
 * Associate img upload with user.
 * 
 * @param {String} id       User id to wich the file must be associated.
 * @param {Object} res      Response callback from app.put router
 * @param {String} fileName FileName upload
 * @return {JSON}           Response errors or succesfull associate file
 */
function imgUser(id, res, fileName) {

    User.findById(id, (err, userDB) =>{
        
        if( err ){
            deleteFile(fileName, 'users');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if (!userDB){
            deleteFile(fileName, 'users');
            return res.status(404).json({
                ok: false,
                err: { message: 'User not found'}
            });
        }

        deleteFile(userDB.img, 'users');

        userDB.img = fileName;
        userDB.save((err,userSaved) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                user: userSaved,
                img: fileName
            });
        });

    });
};



/**
 * Associate img upload with a product.
 * 
 * @param {String} id       Product id to wich the file must be associated.
 * @param {Object} res      Response callback from app.put router
 * @param {String} fileName FileName upload
 * @return {JSON}           Response errors or succesfull associate file
 */
function imgProduct(id, res, fileName) {

    Product.findById(id, (err, productDB) =>{
        
        if( err ){
            deleteFile(fileName, 'products');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if (!productDB){
            deleteFile(fileName, 'products');
            return res.status(404).json({
                ok: false,
                err: { message: 'Product not found'}
            });
        }

        deleteFile(productDB.img, 'products');

        productDB.img = fileName;
        productDB.save((err,productSave) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: productSave,
                img: fileName
            });
        });

    });
};


/**
 * Remove the physical file inside the UPLOADS folder
 * 
 * @param {String} fileName         Name of file for delete
 * @param {String} subDirectory     SubDirectory on uploads/XXX 
 */
function deleteFile(fileName, subDirectory) {
    let pathImg =  path.resolve(__dirname, `../../uploads/${ subDirectory }/${ fileName }`);
    if ( fs.existsSync(pathImg) ) {  //img exist.
        fs.unlinkSync(pathImg);     //remove file
    }
};


module.exports = app;