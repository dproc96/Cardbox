const mongoose = require('mongoose');
const User = require("./User");
const Category = require("./Category");
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    color: {
        type: String,
        require: true,
        default: "#ffffff"
    },
    html: {
        type: String,
        require: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: "Category"
    }]
})

NoteSchema.methods.alterHtml = function(value) {
    this.html = value;
}

NoteSchema.methods.attachToUser = async function(userId) {
    const user = await User.findOne({ _id: userId })
    if (user) {
        this.author = userId
        user.notes.push(this._id);
        await user.save();
    }
    else {
        throw new Error("User not found")
    }
}

NoteSchema.methods.attachCategory = async function(categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    if (category) {
        this.categories.push(categoryId);
        category.notes.push(this._id);
        await category.save();
    }
    else {
        throw new Error("Category not found")
    }
}

NoteSchema.methods.removeCategory = async function(categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    const indexInNote = this.categories.indexOf(categoryId);
    const indexInCategory = category.indexOf(this._id)
    if (category) {
        if (indexInNote > -1) {
            this.categories.splice(indexInNote)
        }
        if (indexInCategory > -1) {
            category.notes.splice(indexInCategory)
        }
        await category.save();
    }
    else {
        throw new Error("Category not found")
    }
}


NoteSchema.pre("save", async function(next) {
    if (this.isModified("author")) {
        try {
            await this.attachToUser(this.author)
        }
        catch (error) {
            throw new Error(error.message)
        }
    }
    next()
})

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;