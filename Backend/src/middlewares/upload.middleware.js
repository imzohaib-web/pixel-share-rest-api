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
        fileSize: 10 * 1024 * 1024 // 10MB maximum file size
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
 * Express middleware wrapping Multer to handle upload validation errors gracefully
 */
function handleImageUpload(req, res, next) {
    upload.single('image')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'File size must be less than 10MB'
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: 'File upload error'
                });
            }
            if (err.code === 'INVALID_FILE_TYPE' || err.message) {
                return res.status(400).json({
                    success: false,
                    message: err.message || 'Image must be JPEG, PNG, WEBP, or GIF'
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Failed to process uploaded file'
            });
        }
        next();
    });
}

module.exports = handleImageUpload;
