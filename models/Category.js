const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
})

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;