const fs = require("fs");
const db = require("../db");
const dotenv = require('dotenv').config();
db(process.env.mongo);
const store = require("../api/arts/store")
let artBase;

(async () => {
    const allArts = await store.leer()
    artBase = allArts[0]
    loadCateg()     
})()

async function loadCateg(){
    await filtrar(["AF","AG","AT","BA","GA"], "alfileres_y_agujas");
    await filtrar(["AJ"], "abrojos");
    await filtrar(["AB","AC","AE","AD","AR","RE/estampado"], "aplicaciones");
    await filtrar(["CM","CP","MU","MO","LE"], "bijou");
    await filtrar(["ST","LE","MO","GL","NA","AD"], "brillos");
    await filtrar(["BB","RB","TP-BORDADO","CS-BORDADO","HI/mouline","HI/coloris","HI/variacion","HI/HI0317","HI/bordado","TZ"], "bordado");
    await filtrar(["BO","BP","BR","BS","CS-BROCHE"], "botones_y_broches");
    await filtrar(["CE"], "cierres");
    await filtrar(["CI","GB","GL","GP","NA","CI/VIVOS","CI/TALLES-REPARACION"], "cintas");
    await filtrar(["CD","TE"], "cordones");
    await filtrar(["CR"], "cortineria");
    await filtrar(["CS","CS-BROCHE","TR"], "costura");
    await filtrar(["EL","EN"], "elásticos");
    await filtrar(["PF"], "flecos");
    await filtrar(["FL","FR"], "flores");
    await filtrar(["AH","AP","MQ","HE","HH","RC","RR","TE"], "herrajes");
    await filtrar(["CS","TJ","MH","PA","PE"], "herramientas");
    await filtrar(["HI","HI/HI8100","HI/HI0901","HI/HI9000"], "hilos");
    await filtrar(["AN","CA","HO","HC","PA","VS/INDUMENTARIA"], "indumentaria");
    await filtrar(["LA","AT"], "lanas");
    await filtrar(["RC","RR","EL"], "lenceria");
    await filtrar(["AN","AL","CM","CP","MU","MH/manualidades","VS/manualidades","RV","CS-BORDADO","LE","MO","PA"], "manualidades");
    await filtrar(["BU","BR","BS","CR","CS-BROCHE"], "matrices_e_insumos");
    await filtrar(["PE"], "pegamentos");
    await filtrar(["PL"], "plumas");
    await filtrar(["PY","PU","BX","PW","PT","PZ","PR"], "puntillas");
    await filtrar(["AN","HO","GA","RE","TP","TR","CI/VIVOS","VS/INDUMENTARIA"], "reparacion_ropa");//EL SE VA A SUBDIVIDIR EN BRETELES
    await filtrar(["BB","CS-BORDADO","RV","VS/manualidades"], "telar");
    await filtrar(["HC","VS","PA","VS/INDUMENTARIA"], "otros");

  return  console.log("Operacion Terminada")
}

async function filtrar(arr, categ){
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
    
    fs.writeFileSync(`../public/system/categ/${categ}.json`, JSON.stringify(categArr[categ].sort(), null, 2));

    return console.log("Categoria", categ, "Generada")
}
