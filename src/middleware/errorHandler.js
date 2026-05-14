const errorHandler = (err, req, res, next) => {

    console.log(err);

    // PostgreSQL foreign key violation
    if(err.name === "23503") {

        return res.status(400).json({
            success: false,
            message: "Foreign Key constraint error",
            detail: err.detail
        });

    }

    // JWT errors
    if(err.name === "JsonWebTokenError") {

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }


    // JWT expired
    if(err.name === "TokenExpiredError") {

        return res.status(401).json({
            success: false,
            message: "Token expired"
        });
    }


    // Validation errors
    if(err.name === "ValidationError") {

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }

    // Default server error
    return res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

}

module.exports = errorHandler;