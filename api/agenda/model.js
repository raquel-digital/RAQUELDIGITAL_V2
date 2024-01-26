const mongoose = require("mongoose");

const schema = mongoose.Schema;

const newSchema = new schema({

        agenda: String
        
})

const model = mongoose.model("Agenda", newSchema);

module.exports = model;