require('dotenv').config()
const aws = require('aws-sdk')
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    bucket: process.env.AWS_BUCKET_NAME,
})
const Product = require("../models/product");
const Category = require("../models/category");
const fs = require("fs");
const mongoose = require("mongoose");
const { find } = require("../models/product");
class ProductController {
    // [GET] /product
    async index(req, res) {
        try{
            const { page, limit, sort, category } = req.query;
            console.log(sort)
            const options = {
                page: parseInt(page, 10) || 1,
                limit: parseInt(limit, 10) || 10,
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null
            };
            //         const products = await Product.paginate({ category: { $regex: new RegExp(category_name,'i')} }, options);
            const products = category
                                ? await Product.paginate({ category: { $regex: new RegExp(category,'i')} }, options)
                                : await Product.paginate({}, options)
            return res.status(200).json(products);
        }catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Server Error" });
        }
    }
    // [GET] /product/:id
    async getItem(req, res) {
        const { id } = req.params;
        const filter = { _id: id };
        Product.findOne(filter, (err, product) => {
            if (err) {
                console.log(err);
                res.status(404).json({ error: "Product Not Found" });
            }
            res.status(200).json(product);
        });
    }
    // [GET] /product/category_name
    async getCategory(req, res) {
        Category.find({}, (err, caterogy) => {
            if (err) res.status(400).json({ error: "Categories Not Found" });
            const names = caterogy.map((_category) => _category.name);
            res.status(200).json(names);
        });
    }

    // [POST] /product/create
    async create(req, res) {
        try {
            //GET Files from multer middleware
            const { category, tags } = req.body;
            const { mainImage, ...subImages } = req.files;

            //Check if client upload subImages
            // const subImagePaths = subImages["subImages[]"]
            //     ? subImages["subImages[]"].map((img) =>
            //           img.path.replace(/\\/g, "/")
            //       )
            //     : null;
            const subImagePaths = subImages["subImages[]"]
                ? subImages["subImages[]"].map((img) =>
                    img.location
                )
                : null;
            const sizes = JSON.parse(req.body.sizes).map(
                ({ size, quantity }) => ({
                    size: size,
                    quantity: parseInt(quantity),
                })
            );
            //Create Model's obj
            const productObj = {
                ...req.body,
                sizes: sizes,
                mainImage: mainImage[0].location,
                subImages: subImagePaths,
            };
            const product = new Product(productObj);
            // Insert data and insert product into category
            product
                .save()
                .then(async (res) => {
                    const { caterogy } = res;
                    if (category) {
                        for (let _category of category) {
                            _category = capitalizeFirstLetter(_category);
                            const productCategory = await Category.findOne({
                                name: _category,
                            });
                            if (!productCategory) {
                                const category = new Category({
                                    name: _category,
                                    products: [],
                                });
                                category
                                    .save()
                                    .then(async (categoryAfterSaved) => {
                                        await categoryAfterSaved.products.push(
                                            res
                                        );
                                        await categoryAfterSaved.save();
                                    });
                                break;
                            }

                            await productCategory.products.push(product);
                            await productCategory.save();
                        }
                    }
                })
                .catch((err) => res.status(500).json(err));
            res.status(200).send({ message: "Done" });
        } catch (error) {
            console.log(error);
            return res.status(200).json({ error: error });
        }
    }
    // [POST] /product/update
    async update(req, res) {
        try {
            const { id, name, price, category } = req.body;
            const { mainImage, ...subImages } = req.files;
            const sizes = JSON.parse(req.body.sizes).map(
                ({ size, quantity }) => ({
                    size: size,
                    quantity: parseInt(quantity),
                })
            );
            const mainImagePath = mainImage ? mainImage[0].location : null;
            // const subImagePaths = subImages["subImages[]"]
            //     ? subImages["subImages[]"].map((img) =>
            //           img.path.replace(/\\/g, "/")
            //       )
            //     : null;
            const subImagePaths = subImages["subImages[]"]
                ? subImages["subImages[]"].map((img) =>
                    img.location
                )
                : null;
            // Update new value for Product
            const product = await Product.findByIdAndUpdate(
                id,
                {
                    name,
                    price,
                    category,
                    sizes,
                },
                { new: true }
            );
            // Update new imagesPath
            if (mainImagePath) {
                if(product.mainImage) deleteMainImage(product.mainImage);
                product.mainImage = mainImagePath;
            }
            if (subImagePaths) {
                if(product.subImages) deleteSubImages(product.subImages);
                product.subImages = subImagePaths;
            }
            await product.save();

            // Process in Category
            for (let _cate of category) {
                const isExistedCategory = await Category.findOne({
                    name: _cate,
                });
                if (!isExistedCategory) {
                    const newCategory = new Category({
                        name: _cate,
                        products: [],
                    });
                    await newCategory.save();
                }
            }
            // Create Category If Not Exist
            const allCategory = await Category.find({});
            for (let _cate of allCategory) {
                // Remove item Category does not in Item's new Category list
                if (!category.includes(_cate.name)) {
                    _cate.products = _cate.products.filter(
                        (item) => item._id !== id
                    );
                    await _cate.save();
                    continue;
                }
                // Add value to each Category Documents
                const isExistedProductInCategory =
                    _cate.products.filter((item) => item._id == id).length !== 0
                        ? true
                        : false;
                if (!isExistedProductInCategory) {
                    await Category.updateOne(
                        { name: _cate.name },
                        { $push: { products: product } }
                    );
                }
            }

            res.status(200).json({ message: "ok" });
        } catch (error) {
            console.log(error);
            return res.status(200).json({ error: error });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const { mainImage, subImages } = await Product.findById(id);

            await Product.findOneAndRemove({ _id: id });
            if (mainImage) {
                deleteMainImage(mainImage)
            }
            if (subImages) {
                deleteSubImages(subImages)
            }

            res.status(200).json("oke");
        } catch (err) {
            console.log(err);
        }
    }
    // async getItemByCategory(req, res){
    //     try{
    //         const { category_name } = req.params;
    //         const { page, limit, sort } = req.query;
    //
    //         const options = {
    //             page: parseInt(page, 10) || 1,
    //             limit: parseInt(limit, 10) || 10,
    //             sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null
    //         };
    //         const products = await Product.paginate({ category: { $regex: new RegExp(category_name,'i')} }, options);
    //         return res.status(200).json(products);
    //     }catch (e) {
    //         console.log(e);
    //         return res.status(500).json({ message: "Server Error" });
    //     }
    // }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
function deleteMainImage(mainImagePath){
    let obj = mainImagePath.split('/')
    let deleteParam = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: {
            Objects: [
                {Key: obj[obj.length-1]},
            ]
        }
    };
    s3.deleteObjects(deleteParam, function(err, data) {
        if (err) console.log(err, err.stack);
        else console.log('delete', data);
    });
}
function deleteSubImages(subImages){
    let deleteParam = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: {
            Objects: [...subImages.map(path => {
                let obj = path.split('/')
                return {Key: obj[obj.length-1]}
            })]
        }
    };
    s3.deleteObjects(deleteParam, function(err, data) {
        if (err) console.log(err, err.stack);
        else console.log('delete', data);
    });
}
module.exports = new ProductController();
