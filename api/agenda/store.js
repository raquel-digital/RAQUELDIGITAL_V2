const { async } = require("rxjs");
const model = require("./model");

const store = {
    read: async function () {
        try{
            return await model.find()
        }catch(err){
            console.log("[ ERROR EN READ ", err)
        }
    },
    write:  async function (data) {
        try{
            await model.updateOne({_id: "65b3c896043620990da4cf7a" }, 
            { 
                $set: { agenda: data }
            })
            return await model.find()
        }catch(err){
            console.log("[ ERROR EN WRITE ", err)
        }
    },
}

module.exports = store