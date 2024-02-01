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
            console.log("[ ERROR EN READ ")
        }
    },
    write:  async function (data, historial) {
        try{
            if(historial == "historial"){
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
            console.log("[ ERROR EN WRITE ]", err, data)
        }
    },
    writeAgenda:  async function (data) {
        try{                       
            await model.updateOne({_id: "65bba89071fb7942eb89299e"}, 
            { 
                $set: { agenda: data }
            })
        return await model.find({ _id: "65bba89071fb7942eb89299e"})     
            
        }catch(err){
            console.log("[ ERROR EN WRITE HISTORIAL]", err, data)
        }
    },
    readAgenda: async function () {
        try{           
                return await model.find({ _id: "65bba89071fb7942eb89299e"})
            
        }catch(err){
            console.log("[ ERROR EN READ ")
        }
    },
}

module.exports = store