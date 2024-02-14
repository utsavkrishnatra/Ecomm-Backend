const {createProduct,fetchAllProducts,fetchProductById,updateProduct}=require("../controller/Products");
const express = require("express");
const productRouter = express.Router()


productRouter.post('/',createProduct)
.get('/',fetchAllProducts)
.get('/:id',fetchProductById)
.patch('/:id',updateProduct)



module.exports=productRouter;