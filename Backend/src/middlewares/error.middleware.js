const multer = require('multer');

/**
 * Centralized Express Error Handling Middleware
 * Catches all operational, database, validation, file upload, and unexpected errors.
 * Returns consistent JSON response while protecting sensitive credentials and stack traces.
 */
function errorMiddleware(err, req, res, next) {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';

    // 1. Mongoose Invalid ObjectId (CastError)
    if (err.name === 'CastError') {
        statusCode = 404;
        message = 'Post not found';
    }

    // 2. Mongoose Schema ValidationError
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // 3. Mongoose Duplicate Key Error
    else if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    // 4. Multer File Size Limit Error
    else if (err instanceof multer.MulterError) {
        statusCode = 400;
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'File size must be less than 10MB';
        } else {
            message = 'File upload error';
        }
    }

    // 5. Custom Upload File Type Error
    else if (err.code === 'INVALID_FILE_TYPE') {
        statusCode = 400;
        message = err.message || 'Image must be JPEG, PNG, WEBP, or GIF';
    }

    // 6. Malformed JSON Body Error
    else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        statusCode = 400;
        message = 'Invalid JSON request payload';
    }

    // 7. ImageKit / Cloud Storage Error (Sanitized to hide API keys/credentials)
    else if (err.name === 'ImageKitError' || (err.message && err.message.toLowerCase().includes('imagekit'))) {
        statusCode = 500;
        message = 'Failed to process media on cloud storage';
    }

    // Log internal server errors securely to server log (never exposed to client)
    if (statusCode === 500) {
        console.error('[SERVER ERROR]:', err);
    }

    // Sanitize response to client (never leak stack traces or private keys)
    return res.status(statusCode).json({
        success: false,
        message: message
    });
}

module.exports = errorMiddleware;
