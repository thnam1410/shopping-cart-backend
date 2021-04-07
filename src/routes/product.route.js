require('dotenv').config()
const express = require("express");
const productController = require("../controllers/product.controller");
const { authAdmin } = require("../middlewares/auth");
const path = require("path");


const multer = require("multer");
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
})
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "public-read",
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            const newFileName = Date.now() + "-" + file.originalname.replace(/-/g,'').replace(/ /g,'');
            const fullPath = 'uploads/'+ newFileName;
            cb(null, fullPath);
        }
    })
})
// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, "./upload/");
//     },
//     filename: function (req, file, callback) {
//         callback(
//             null,
//             new Date().toISOString().replace(/:/g, "-") +
//                 "_" +
//                 path.extname(file.originalname)
//         );
//     },
// });
// const upload = multer({ storage: storage });
const uploadFields = upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages[]", maxCount: 4 },
]);
const router = express.Router();

router.get("/", productController.index);
router.get("/category_name", productController.getCategory);
router.get("/:id", productController.getItem);

/*
* FormData{
*   mainImage: image
*   subImages: image/images
*   name: string
    price: number
    sizes: string => [
    *                   { size: xx, quantity: xx }
    *                   { size: xx, quantity: xx }
    *                ]    Truyền xuống = JSON.Stringify, backend tự động xử lý
    category: Array[string] VD: ["Sneaker","Adidas"]
    tags: Array[string] VD: ["Sneaker","Adidas"]
* }*/
router.post("/create", authAdmin, uploadFields, productController.create);
/*
* Tương tự trên
* */
router.post("/update", authAdmin, uploadFields, productController.update);
router.delete("/delete/:id", authAdmin, productController.delete);
module.exports = router;








