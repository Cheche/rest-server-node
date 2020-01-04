const jwt = require('jsonwebtoken');

/**
 * Check token
 * req: request
 * res: response
 * next: continue program exec
 */
 let tokenVerification = ( req, res, next) => {

    let token = req.get('Authorization'); // get header token
    
    // verify valid token
    jwt.verify(token, process.env.JWT_SH, (err, decoded) => {

        if(err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decoded.user;
        next();

    });

 };

/**
 * Check Role 
 * 
 */
let adminRoleVerification = (req, res, next) => {
    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'User does not have enought permissions.'
            }
        });
    }

};


/**
 * Verify Token Img
 */
let tokenImgVerification = (req, res, next) => {

    let token = req.query.token; // token on URL
    // verify valid token
    jwt.verify(token, process.env.JWT_SH, (err, decoded) => {

        if(err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decoded.user;
        next();

    });    

};


 module.exports = {
     tokenVerification,
     adminRoleVerification,
     tokenImgVerification
 }