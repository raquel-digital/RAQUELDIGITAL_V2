const { async } = require("rxjs");
const model = require("./model");

const store = {
    read: async function (historial) {
        try{
            if(historial){
                return await model.find({ _id: "65b50646015f742499348960"})
            }else{
                return await model.find({ _id: "65b3c896043620990da4cf7a"})
            }
        }catch(err){
            console.log("[ ERROR EN READ ", err)
        }
    },
    write:  async function (data, historial) {
        try{
            if(historial){
                await model.updateOne({_id: "65b50646015f742499348960"}, 
                    { 
                        $set: { agenda: data }
                    })
                return await model.find({ _id: "65b50646015f742499348960"})
            }else{
                await model.updateOne({_id: "65b3c896043620990da4cf7a" }, 
                    { 
                        $set: { agenda: data }
                    })
                return await model.find({ _id: "65b3c896043620990da4cf7a"})
            }
        }catch(err){
            console.log("[ ERROR EN WRITE ", err)
        }
    },
}

module.exports = store