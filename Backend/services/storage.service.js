const {ImageKit} = require('@imagekit/nodejs')

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function uploadFile(buffer){
    const result = await imagekit.files.upload({
        file: buffer.toString('base64'),
        fileName: 'image.jpg'
    })
    return result
}

module.exports = uploadFile;

//ye function buffer mange ga aur ye function image ko upload karega imagekit pe aur uska url return karega
