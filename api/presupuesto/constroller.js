
const { async } = require("rxjs");
const store = require("./store");
const fs = require("fs")

controller = {
    ingresar: async function (data) {
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
    actuCodigo: async function (code, newCode) {
        await store.updateCode(code, newCode)
        return
    }   
}

module.exports = controller;