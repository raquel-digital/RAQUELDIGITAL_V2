const fs = require("fs");
const db = require("../db");
const dotenv = require('dotenv').config();
const path = require('path');

db(process.env.mongo);

//COMANDOS: depurar crea JSON con todos los tags // categ: crea carpetas con las categorias

if(process.argv[2] == "depurar"){
    depurar ()
}
else if(process.argv[2] == "categ"){
    crearCategs ()
}
else if(process.argv[2] == "filtrar"){
    loadCateg()
}    
else{
    console.log('Escribi un comando: ')
    console.log('"depurar" crea JSON con todos los tags')
    console.log('"categ" crea carpetas con las categorias')
    console.log('"filtrar" crea JSON con las categorias')
}

async function depurar () {     
    console.log("depurando")

    const store = require("../api/arts/store")
    const allArts = await store.leer()
    
    const tags = require("../public/system/tags.json")

    for(const t2 of allArts[0]){
        const split = t2.tags.split(" ")

        split.forEach(objeto1 => {
            if(objeto1 != ""){
                if (!tags.some(objeto2 => objeto2.categoria === t2.categorias && objeto2.tags === objeto1)) {
                    console.log("AGREGANDO: ",  t2.categorias, objeto1)
                    tags.push({categoria: t2.categorias, tags: objeto1});
                }
            }
        });
    }

    fs.writeFileSync("../public/system/tags.json", JSON.stringify(tags, null, 2));
    console.log("LISTO")
}

async function crearCategs () {  
    const store = require("../api/arts/store")
    const allArts = await store.leer()    
    const tags = require("../public/system/tags.json")
    const directorioBase = '../public/system';

    const categArr = {}

    //CREAR CARPETAS
    for(const t of tags){
        // const rutaCarpeta = path.join(directorioBase, t.categoria);
        // if (!fs.existsSync(rutaCarpeta)) {
        //     try{
        //         fs.mkdirSync(rutaCarpeta);
        //         console.log(`Carpeta creada: ${rutaCarpeta}`);
        //     }catch(err){
        //         console.log("No se pudo crear carpeta " + rutaCarpeta)
        //     }
        // }

        if(!categArr[t.categoria]){            
            categArr[t.categoria] = []
            categArr[t.categoria].push(t.tags)
        }else{
            categArr[t.categoria].push(t.tags)
        }        
    }

    for(const t of tags){
        fs.writeFileSync(`../public/system/${t.categoria}.json`, JSON.stringify(categArr[t.categoria], null, 2));
    }
    
}

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
}

function filtrar(arr, query){
    const arrFiltrado = []
    for(const a of arr){
        try{
            const repl = a.replace("/", "1")
            const categ = require("../public/system/"+ a + ".json")
            if(categ){
                categ.forEach(e => {
                    if(!arrFiltrado.includes(e)){
                        arrFiltrado.push(e)
                    }else{
                        console.log("No se encontro ", e)
                    }
                })
            }
        }catch(err){
            console.log("No se encontro articulo", err)
        }
    }

    fs.writeFileSync(`../public/system/categ/${query}.json`, JSON.stringify(arrFiltrado, null, 2));
}






