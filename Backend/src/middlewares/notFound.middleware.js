const ApiError = require('../utils/ApiError');

/**
 * 404 Route Not Found Middleware
 */
function notFoundMiddleware(req, res, next) {
    next(new ApiError(404, 'Route not found'));
}

module.exports = notFoundMiddleware;
