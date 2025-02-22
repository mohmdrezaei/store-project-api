const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: 
    {
      type: String,
      required: true,
      unique: true,
    },
  password: {
    type: String,
    required: true,
  },
}, {timestamps : true});
userSchema.virtual("id").get(function(){
    this._id.toHexString()
})

userSchema.set('toJSON',{
    virtuals:true
})
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });

  // userSchema.methods.comparePassword = async function (password) {
  //   return await bcrypt.compare(password, this.password);
  // };

exports.User = mongoose.model("User", userSchema);
