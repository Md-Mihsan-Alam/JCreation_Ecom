const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      imageGallery,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      stockM,
      stockL,
      stockXL,
      stock2XL,
      stock3XL,
      stock4XL,
      averageReview,
      isNewArrival,
    } = req.body;

    let totalStock =
      (Number(stockM) || 0) +
      (Number(stockL) || 0) +
      (Number(stockXL) || 0) +
      (Number(stock2XL) || 0) +
      (Number(stock3XL) || 0) +
      (Number(stock4XL) || 0);

    const newlyCreatedProduct = new Product({
      image,
      imageGallery,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      stockM,
      stockL,
      stockXL,
      stock2XL,
      stock3XL,
      stock4XL,
      averageReview,
      isNewArrival,
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      imageGallery,
      title,
      description,
      brand,
      price,
      salePrice,
      stockM,
      stockL,
      stockXL,
      stock2XL,
      stock3XL,
      stock4XL,
      averageReview,
      isNewArrival,
      category,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.imageGallery = imageGallery || findProduct.imageGallery;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.stockM = stockM || findProduct.stockM;
    findProduct.stockL = stockL || findProduct.stockL;
    findProduct.stockXL = stockXL || findProduct.stockXL;
    findProduct.stock2XL = stock2XL || findProduct.stock2XL;
    findProduct.stock3XL = stock3XL || findProduct.stock3XL;
    findProduct.stock4XL = stock4XL || findProduct.stock4XL;
    findProduct.totalStock =
      (Number(findProduct.stockM) || 0) +
      (Number(findProduct.stockL) || 0) +
      (Number(findProduct.stockXL) || 0) +
      (Number(findProduct.stock2XL) || 0) +
      (Number(findProduct.stock3XL) || 0) +
      (Number(findProduct.stock4XL) || 0);
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;
    findProduct.isNewArrival = isNewArrival !== undefined ? isNewArrival : findProduct.isNewArrival;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
