const mongoose = require("mongoose");

module.exports = {
    connect: async function() {
        await mongoose.connect("mongodb://localhost/cardbox-test", { useNewUrlParser: true, useUnifiedTopology: true });
        await mongoose.connection.db.dropDatabase();
    },
    disconnect: async function() {
        await mongoose.disconnect();
    }
}