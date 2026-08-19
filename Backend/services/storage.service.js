const { ImageKit } = require('@imagekit/nodejs');

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

/**
 * Uploads an in-memory buffer to ImageKit
 * @param {Buffer} buffer - File buffer from Multer
 * @param {string} [originalName='image.jpg'] - Original file name
 * @returns {Promise<object>} ImageKit upload result object containing url and fileId
 */
async function uploadFile(buffer, originalName = 'image.jpg') {
    const result = await imagekit.files.upload({
        file: buffer.toString('base64'),
        fileName: originalName
    });
    return result;
}

/**
 * Deletes a file from ImageKit by fileId
 * @param {string} fileId - ImageKit unique file ID
 * @returns {Promise<void>}
 */
async function deleteFile(fileId) {
    if (!fileId) return;
    try {
        await imagekit.files.delete(fileId);
    } catch (error) {
        console.error(`[ImageKit] Failed to delete file ${fileId}:`, error.message);
    }
}

module.exports = {
    uploadFile,
    deleteFile
};
