const mongoose = require('mongoose');
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

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;