const jwt = require('jsonwebtoken');

/**
 * Verificar token
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


 module.exports = {
     tokenVerification
 }