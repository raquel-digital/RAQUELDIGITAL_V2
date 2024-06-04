
const { async } = require("rxjs");
const store = require("./store");

controller = {
    ingresar: async function (data) {
        store.write(data)
    }
}

module.exports = controller;