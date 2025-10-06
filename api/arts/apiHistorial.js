const model = require("./modalHistorial")

const api = {
    read: async function() {
        const read = await model.find()
        return read
    }
}

module.exports = api