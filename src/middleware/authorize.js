const pool = require('../config/db');

const authorize = (permission) => {

    return async (req, res, next) => {

        try {

            if( !req.user.permissions.includes(permission) ) {

                return res.status(403).json({
                    message: "Permission Denied"
                });

            }

            next();
            
        } catch (err) {

            return res.status(500).json({
                message: err.message
            });

        }
    }
}

module.exports = authorize;