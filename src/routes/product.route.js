const express = require("express");
const productController = require("../controllers/product.controller");
const multer = require("multer");
const path = require("path")
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./upload/");
    },
    filename: function (req, file, callback) {
        callback(
            null,
            new Date().toISOString().replace(/:/g, "-") +
                "_" +
                path.extname(file.originalname)
        );
    },
});
const upload = multer({ storage: storage });
const uploadFields = upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages[]", maxCount: 4 }
    ])
const router = express.Router();

router.get("/", productController.index);
router.get("/category_name", productController.getCategory);
router.get("/:id", productController.getItem);
router.post(
    "/create",
    uploadFields,
    productController.create
);

module.exports = router;
