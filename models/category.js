const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  color: {
    type: String,
    required: true,
  },
});

exports.Category = mongoose.model("Category" ,categorySchema)
