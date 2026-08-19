/**
 * Higher-order wrapper function to catch rejected promises in async route handlers and forward them to next()
 * @param {Function} fn - Async controller function
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
