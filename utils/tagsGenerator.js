const fs = require("fs");
//const db = require("../db");
//const dotenv = require('dotenv').config();
//db(process.env.mongo);
const store = require("../api/arts/store")
let artBase;

// (async () => {
//     const allArts = await store.leer()
//     artBase = allArts[0]
//     loadCateg()     
// })()

async function loadCateg(){
    const allArts = await store.leer()
    let artBase = allArts[0]

    await filtrar(["AF","AG","AT","BA","GA"], "alfileres_y_agujas", artBase);
    await filtrar(["AJ"], "abrojos", artBase);
    await filtrar(["AB","AC","AE","AD","AR","RE/estampado"], "aplicaciones", artBase);
    await filtrar(["CM","CP","MU","MO","LE"], "bijou", artBase);
    await filtrar(["ST","LE","MO","GL","NA","AD"], "brillos", artBase);
    await filtrar(["BB","RB","TP-BORDADO","CS-BORDADO","HI/mouline","HI/coloris","HI/variacion","HI/HI0317","HI/bordado","TZ"], "bordado", artBase);
    await filtrar(["BO","BP","BR","BS","CS-BROCHE"], "botones_y_broches", artBase);
    await filtrar(["CE"], "cierres", artBase);
    await filtrar(["CI","GB","GL","GP","NA","CI/VIVOS","CI/TALLES-REPARACION"], "cintas", artBase);
    await filtrar(["CD","TE"], "cordones", artBase);
    await filtrar(["CR"], "cortineria", artBase);
    await filtrar(["CS","CS-BROCHE","TR"], "costura", artBase);
    await filtrar(["EL","EN"], "elásticos", artBase);
    await filtrar(["PF"], "flecos", artBase);
    await filtrar(["FL","FR"], "flores", artBase);
    await filtrar(["AH","AP","MQ","HE","HH","RC","RR","TE"], "herrajes", artBase);
    await filtrar(["CS","TJ","MH","PA","PE"], "herramientas", artBase);
    await filtrar(["HI","HI/HI8100","HI/HI0901","HI/HI9000"], "hilos", artBase);
    await filtrar(["AN","CA","HO","HC","PA","VS/INDUMENTARIA"], "indumentaria", artBase);
    await filtrar(["LA","AT"], "lanas", artBase);
    await filtrar(["RC","RR","EL"], "lenceria", artBase);
    await filtrar(["AN","AL","CM","CP","MU","MH/manualidades","VS/manualidades","RV","CS-BORDADO","LE","MO","PA"], "manualidades", artBase);
    await filtrar(["BU","BR","BS","CR","CS-BROCHE"], "matrices_e_insumos", artBase);
    await filtrar(["PE"], "pegamentos", artBase);
    await filtrar(["PL"], "plumas", artBase);
    await filtrar(["PY","PU","BX","PW","PT","PZ","PR"], "puntillas", artBase);
    await filtrar(["AN","HO","GA","RE","TP","TR","CI/VIVOS","VS/INDUMENTARIA"], "reparacion_ropa", artBase);//EL SE VA A SUBDIVIDIR EN BRETELES
    await filtrar(["BB","CS-BORDADO","RV","VS/manualidades"], "telar", artBase);
    await filtrar(["HC","VS","PA","VS/INDUMENTARIA"], "otros", artBase);

  return  console.log("Categorias Cargadas")
}

async function filtrar(arr, categ, artBase){
    const categArr = {}    

    for(const art of artBase){
        const split = art.tags.split(" ")        
        for(const s of split){
            for(const a of arr){
                if(art.categorias === a && art.mostrar && s != " " && s != ""){
                    if(!categArr[categ]){
                        categArr[categ] = []
                        categArr[categ].push(s)
                    }else{
                        if(!categArr[categ].includes(s)){                
                            categArr[categ].push(s)
                        }
                    }   
                }
            }
        }
    }
    
    fs.writeFileSync(`./public/system/categ/${categ}.json`, JSON.stringify(categArr[categ].sort(), null, 2));

    return
}

module.exports = loadCateg
