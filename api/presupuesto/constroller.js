
const { async } = require("rxjs");
const store = require("./store");
const artController = require("../arts/controller")
const fs = require("fs")

controller = {
    ingresar: async function (data) {
       console.log(data)
       await store.write(data)

       const read = await store.read()
        read.forEach(data => {
            if(data.tipo == "PRESUPUESTO BASICO"){ 
                fs.writeFileSync(`./public/system/presupuestos/presupuesto-basico.json`, JSON.stringify(data.presupuesto, null, 2));
            }
            if(data.tipo == "PRESUPUESTO MEDIANO"){
                fs.writeFileSync(`./public/system/presupuestos/presupuesto-medio.json`, JSON.stringify(data.presupuesto, null, 2));
            }
            if(data.tipo == "PRESUPUESTO PREMIUM"){
                fs.writeFileSync(`./public/system/presupuestos/presupuesto-premium.json`, JSON.stringify(data.presupuesto, null, 2));
            }
        });
    },
    leer: async function () {
        const read = await store.read()        
        
        // read.forEach(data => {
        //     if(data.tipo == "PRESUPUESTO BASICO"){ 
        //         fs.writeFileSync(`./public/system/presupuestos/presupuesto-basico.json`, JSON.stringify(data.presupuesto, null, 2));
        //     }
        //     if(data.tipo == "PRESUPUESTO MEDIANO"){
        //         fs.writeFileSync(`./public/system/presupuestos/presupuesto-medio.json`, JSON.stringify(data.presupuesto, null, 2));
        //     }
        //     if(data.tipo == "PRESUPUESTO PREMIUM"){
        //         fs.writeFileSync(`./public/system/presupuestos/presupuesto-premium.json`, JSON.stringify(data.presupuesto, null, 2));
        //     }
        // });
        return read
    },
    actuCodigo: async function (code, newCode) {
        await store.updateCode(code, newCode)
        return
    },
    update: async function (data) {
        data.forEach( e => {
            store.update(e)
        })
        
        return
    },  
}

module.exports = controller;