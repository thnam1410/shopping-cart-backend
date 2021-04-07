require('dotenv').config()
const express = require("express");
const router = express.Router();

// const multer = require('multer')
// const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    bucket: process.env.AWS_BUCKET_NAME,
})
// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: process.env.AWS_BUCKET_NAME,
//         acl: "public-read",
//         metadata: function (req, file, cb) {
//             cb(null, {fieldName: file.fieldname});
//         },
//         key: function (req, file, cb) {
//             const newFileName = Date.now() + "-" + file.originalname;
//             const fullPath = 'uploads/'+ newFileName;
//             cb(null, fullPath);
//         }
//     })
// })
// const uploadFields = upload.fields([
//     { name: "mainImage", maxCount: 1 },
//     { name: "subImages[]", maxCount: 4 },
// ]);
router.get("/test",(req, res) => {
    let deleteParam = {
        Bucket: 'soa-storage',
        Delete: {
            Objects: [
                {Key: 'fog.jpg'},
            ]
        }
    };
    s3.deleteObjects(deleteParam, function(err, data) {
        if (err) console.log(err, err.stack);
        else console.log('delete', data);
    });
    res.send('ok')
})

module.exports = router