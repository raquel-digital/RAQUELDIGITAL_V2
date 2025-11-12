const model = require("./modelDelete")

const store = {
    restore: async function (data) {
        try{
           const res = await model.find( { num_orden: data.orden, fecha: data.fecha } )
           return res[0]
        }catch(err){
            console.log("[ ERROR EN STORE PAPELERA ] ", err )
        }
    },
    delete: async function (data) {
        try{
           const res = await model.deleteOne( { num_orden: data.orden, fecha: data.fecha } )
           return res[0]
        }catch(err){
            console.log("[ ERROR EN STORE PAPELERA ] ", err )
        }
    },
}

module.exports = store