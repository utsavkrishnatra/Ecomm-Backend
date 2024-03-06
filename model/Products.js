const mongoose = require('mongoose');
const {Schema}=mongoose

const productSchema = new Schema({
    title: { type : String, required: true, unique: true},
    description: { type : String, required: true},
    price: { type: Number, min:[1, 'wrong min price'], max:[10000, 'wrong max price']},
    discountPercentage: { type: Number, min:[1, 'wrong min discount'], max:[99, 'wrong max discount']},
    rating: { type: Number, min:[0, 'wrong min rating'], max:[5, 'wrong max rating'], default:0},
    stock: { type: Number, min:[0, 'wrong min stock'], default:0},
    brand: { type : String, required: true},
    category: { type : String, required: true},
    thumbnail: { type : String, required: true},
    colors:{ type : [Schema.Types.Mixed] },
    sizes:{ type : [Schema.Types.Mixed]},
    highlights:{ type : [String] },
    images:{ type : [String], required: true},
    deleted: { type : Boolean, default: false},
})

const virtual=productSchema.virtual('id');
virtual.get(function(){
    return this._id;
})

productSchema.set('toJSON',
{
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        ret.id=ret._id
        delete ret._id
       
    }
})
const ProductModel=mongoose.model('product',productSchema);
module.exports = ProductModel;

// {
//     "id": "1",
//     "title": "iPhone 9",
//     "description": "An apple mobile which is nothing like apple",
//     "price": 700,
//     "discountPercentage": 10,
//     "rating": 4.69,
//     "stock": 193,
//     "brand": "Apple",
//     "category": "smartphones",
//     "thumbnail": "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
//     "images": [
//       "https://i.dummyjson.com/data/products/1/1.jpg",
//       "https://i.dummyjson.com/data/products/1/2.jpg",
//       "https://i.dummyjson.com/data/products/1/3.jpg",
//       "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
//     ],
//     "deleted": true
//   }
