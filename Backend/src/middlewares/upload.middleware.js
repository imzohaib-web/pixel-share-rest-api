const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.bmp', '.avif', '.heic'];

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB maximum file size
    },
    fileFilter: (req, file, cb) => {
        const mime = (file.mimetype || '').toLowerCase();
        const ext = path.extname(file.originalname || '').toLowerCase();

        if (mime.startsWith('image/') || allowedExtensions.includes(ext)) {
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
