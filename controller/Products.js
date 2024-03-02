const  Product  = require('../model/Products');

exports.createProduct = async (req, res) => {
  // this product we have to get from API body
  const product = new Product(req.body);
  try {
    console.log(" i HAVE HIT THE PRODUCT ENDPOINT");
    const doc = await product.save();
    console.log("product added ",JSON.stringify(doc));
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  // TODO : we have to try with multiple category and brands after change in front-end
  let condition = {}
  console.log("the person requesting query is:",req.user);
  if(!req.user.role){
      condition.deleted = {$ne:true}
  }
  
  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProductsQuery = totalProductsQuery.find({
      category: req.query.category,
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
  }
  //TODO : How to get sort on discounted Price not on Actual price
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set('X-Total-Count', totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {new:true});
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};


// //update fetch all products
// exports.fetchAllProducts = async (req, res) => {
//   let condition = {};
//   if (!req.query.admin) {
//     condition.deleted = { $ne: true };
//   }
  
//   let query = Product.find(condition);
//   let totalProductsQuery = Product.find(condition);

//   if (req.query.category) {
//     const categories = Array.isArray(req.query.category) ? req.query.category : [req.query.category];
//     query = query.find({ category: { $in: categories } });
//     totalProductsQuery = totalProductsQuery.find({ category: { $in: categories } });
//   }
//   if (req.query.brand) {
//     const brands = Array.isArray(req.query.brand) ? req.query.brand : [req.query.brand];
//     query = query.find({ brand: { $in: brands } });
//     totalProductsQuery = totalProductsQuery.find({ brand: { $in: brands } });
//   }

//   if (req.query._sort && req.query._order) {
//     query = query.sort({ [req.query._sort]: req.query._order });
//   }

//   const totalDocs = await totalProductsQuery.countDocuments().exec();

//   if (req.query._page && req.query._limit) {
//     const pageSize = req.query._limit;
//     const page = req.query._page;
//     query = query.skip(pageSize * (page - 1)).limit(pageSize);
//   }

//   try {
//     const docs = await query.exec();
//     res.set('X-Total-Count', totalDocs);
//     res.status(200).json(docs);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

//delete product by id
exports.deleteProduct= async (req, res,next) => {
  const {id}=req.params;
  try {
    const product = await Product.findByIdAndDelete(id, req.body, {new:true});
    console.log("Product deleted: ", product);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }

}