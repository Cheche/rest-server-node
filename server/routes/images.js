const express = require('express');
const fs = require('fs');
const path = require('path');

let app = express();  

// Middlewares
const { tokenImgVerification } = require('../middlewares/authentication');


/**
 * Resolve image routes and return img File.
 * 
 * @param {String} type     Type of resource  [users, products].
 * @param {String} img      Name of file.
 * @return {img}            Requested image file or an image file for not found.
 */
app.get('/images/:type/:img', tokenImgVerification,(req, res) => {
    let type = req.params.type;
    let img = req.params.img;

    let pathImg = path.resolve( __dirname, `../../uploads/${ type }/${ img }`);
    
    if ( fs.existsSync(pathImg) ) {
        res.sendFile(pathImg);
    } else { 
        // return not found img
        let noImgPath = path.resolve( __dirname, '../assets/no-image.jpg');
        res.sendFile(noImgPath);
    }    

});



module.exports = app;