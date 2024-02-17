const {createProduct,fetchAllProducts,fetchProductById,updateProduct,deleteProduct}=require("../controller/Products");
const express = require("express");
const productRouter = express.Router()


productRouter.post('/',createProduct)
.get('/',fetchAllProducts)
.get('/:id',fetchProductById)
.patch('/:id',updateProduct)
.delete('/:id',deleteProduct)



module.exports=productRouter;