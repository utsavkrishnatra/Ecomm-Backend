const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6, // You can adjust the minimum length as needed
//   },
// });
const Schema=mongoose.Schema;
const userSchema = new Schema({
  email: { type: String, required: true, unique: true,trim: true,
    lowercase: true,
    match: /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // You can adjust the minimum length as needed
  },
  role: { type: String, required: true, default:'user' },
  addresses: { type: [Schema.Types.Mixed] }, 
  // TODO:  We can make a separate Schema for this
  name: { type: String },
  orders: { type: [Schema.Types.Mixed] }
});

let virtual=userSchema.virtual('id')
virtual.get(function(){
  return this._id;
})

userSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function(doc,ret){
        delete ret._id;
    }
})

 const User = mongoose.model('user', userSchema);

 exports.User=User
