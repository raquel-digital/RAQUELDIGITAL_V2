const model = require("./model");

const store = {
    ingresar: function (data){
        const sys = new model(data);
        return sys.save();
    },
    actualizar: function (data){
        const user = new model(data);
        return user.save();
    }
 }
 
 module.exports = store;