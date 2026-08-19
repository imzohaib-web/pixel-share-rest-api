const multer = require('multer');

const storage = multer.memoryStorage();

const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
];

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
            cb(null, true);
        } else {
            const error = new Error('Image must be JPEG, PNG, WEBP, or GIF');
            error.code = 'INVALID_FILE_TYPE';
            cb(error, false);
        }
    }
});

/**
 * Express middleware wrapping Multer file upload
 * Forwards any file validation or size errors directly to next(err) for centralized error middleware handling
 */
function handleImageUpload(req, res, next) {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return next(err);
        }
        next();
    });
}

module.exports = handleImageUpload;
