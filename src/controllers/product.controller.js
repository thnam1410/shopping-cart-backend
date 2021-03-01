const Product = require("../models/product");
const Category = require("../models/category");
const mongoose = require("mongoose");

class ProductController {
    // [GET] /product/
    async index(req, res) {
        Product.find({}, (err, products) => {
            if (err) res.status(400).json({ error: "ERROR!!!" });
            res.json(products);
        });
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
        //GET Files from multer middleware
        const { name, price, sizes, category, tags } = req.body;
        const { mainImage, ...subImages } = req.files;

        //Check if client upload subImages
        const subImagePaths = subImages["subImages[]"]
            ? subImages["subImages[]"].map((img) =>
                  img.path.replace(/\\/g, "/")
              )
            : null;

        //Create Model's obj
        const productObj = {
            ...req.body,
            sizes: JSON.parse(sizes),
            mainImage: mainImage[0].path.replace(/\\/g, "/"),
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
                        const productCaterogy = await Category.findOne({
                            name: _category,
                        });
                        if (!productCaterogy) {
                            const category = new Category({
                                name: _category,
                                products: [],
                            });
                            category.save().then(async (categoryAfterSaved) => {
                                await categoryAfterSaved.products.push(res);
                                await categoryAfterSaved.save();
                            });
                            break;
                        }

                        await productCaterogy.products.push(product);
                        await productCaterogy.save();
                    }
                }
            })
            .catch((err) => res.status(500).json(err));
        // if (category) {
        //     for (let _category of category) {
        //         _category = capitalizeFirstLetter(_category);
        //         const productCaterogy = await Category.findOne({
        //             name: _category,
        //         });
        //         if (!productCaterogy) {
        //             const category = new Category({
        //                 name: _category,
        //                 products: [],
        //             });
        //             category.save(async (err, obj) => {
        //                 await obj.products.push(product);
        //             });
        //             break;
        //         }
        //         await productCaterogy.products.push(product);
        //         await productCaterogy.save();
        //     }
        // }
        res.status(200).send({ message: "Done" });
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = new ProductController();
