const fs = require("fs");
const controller = require("../api/arts/controller");
const db = require("../db");//conexion con mongo
const dotenv = require('dotenv');
const { connectableObservableDescriptor } = require("rxjs/internal/observable/ConnectableObservable");

dotenv.config();
console.log(process.env.mongo)
db(process.env.mongo);

(async () => {
    try{
       let leer = await controller.leerArticulos();
       //let leer = await controller.ultimos20subidos();
        
        //pasamos el dato que queremos chequear y el estado que necesitamos saber
        if(process.argv[2] === "check"){
            await checkArticulos(leer);
            return;
        }
        await crearReporte(leer);//
        console.log("PROCESO TERMINADO");
    }        
    catch(err){            
        console.log(err + "Error Lectura");  
    }
 })();
 

 function crearReporte(base){
    const res = []
    
     base.map(e => {   
        //consulta normal 
        //const precio = Number(e.precio.replace(",", "."))
        if(e.codigo == "CI5000"){
            
                res.push(e)
            
        }
     })
    // **********CHEQUEAR QUE STORE UPDATE FROM FILE ESTE BIEN CONFIGURADO!!!!***************
    /* SI USAMOS PARA ACTUALIZAR ARTICULOS MODIFICAR TEMPORALMENTE 
    EL updateFromFile EN STORE */    
    // **********CHEQUEAR QUE STORE UPDATE FROM FILE ESTE BIEN CONFIGURADO!!!!***************
    
    fs.writeFileSync("./result.json", JSON.stringify(res.sort(), null, 2));
    console.log("REPORTE CREADO");

    //consulta con filter
    // const cosdigosFiltrar = ["PY", "PZ", "PW", "PU", "BX", "PT"]
    // const res = base[0].filter(e => {
    //     cosdigosFiltrar.includes(e.codigo) 
    //     return e.codigo
    // })
    // fs.writeFileSync("./1reporte/result.json", JSON.stringify(res.sort(), null, 2));
    // console.log("REPORTE CREADO");
 }

 function checkArticulos(base){
    const check = require("../../articulos/chequear articulos/checkArts.json");
    const mostrado = [];
    const paraSubir = [];
    const actu = [];
           
    for(let c of check){        
        let exist = false;
        base[0].map(b => {
        //condicion que queremos chequear
        if(c.codigo.includes(b.codigo)){
            mostrado.push({codigo: c.codigo})
            if(!b.mostrar){
                actu.push({codigo: b.codigo, mostrar: true})
            }
            exist = true;
        }
        });
        if(!exist){
            paraSubir.push({codigo: c.codigo});
        }
    }

    //********** 
    //*baja solo puede usarse cuando sabes 100% que la categoria chequeada
    //*abarca todos los archivos que se pasen en lista sino hay riesgo de ocultar
    //*artículos que esten disponibles para venta
    //***********

    const baja = [];  

    for(let b of base[0]){
      let exist = false;
      let categC; 
      let categB;
        for(let c of check){
            if(categC === undefined){
                categC = c.codigo.slice(0, 2);
            }
            categB = b.codigo.slice(0, 2); 

            if(b.codigo.includes(c.codigo)){
                exist = true;
            }
        }
       if(!exist && categC === categB){
        baja.push(b.codigo);
        actu.push({codigo: b.codigo, mostrar: false})
       }     
    }
    

    if(mostrado.length > 0){
        console.log("[ ARTICULOS EN EXISTENCIA ] " + mostrado.length)        
        fs.writeFileSync("./1reporte/articulosEnExistencia.json", JSON.stringify(mostrado, null, 2));
    }
    if(paraSubir.length > 0){
        console.log("[ ARTICULOS PARA SUBIR ] " + paraSubir.length)        
        fs.writeFileSync("./1reporte/articulosParaSubir.json", JSON.stringify(paraSubir, null, 2));
    }
    if(actu.length > 0){
        console.log("[ ARTICULOS PARA ACTUALIZAR ] " + actu.length)        
        fs.writeFileSync("./1reporte/result.json", JSON.stringify(actu, null, 2));
    }
    if(baja.length > 0){
        console.log("[ CHEQUEAR ARTICULOS PARA BAJAR ] " + baja.length);        
        fs.writeFileSync("./1reporte/articulosParaBajar.json", JSON.stringify(baja, null, 2)); 
    }
 }







//OLD
 function replace(base){
    const str = "auto avion barco"
    const s = str.split("")
    let newS = []
    s.forEach(e => {

        if(e == " ")
            e = "-"
       newS.push(e)
    })
    
    newS = newS.join("")
    console.log(newS)

    const res = []

    base[0].forEach(e => {
        if(e.codigo.includes(" ")){
            newS = []
            const strArr = e.codigo.split("")
            strArr.forEach(s => {
            if(s == " "){
                s = "-";
            }
            newS.push(s)
        })
            const codigoMod =  newS.join("")
            
            res.push({codigo: e.codigo, codigoMod: codigoMod})
        }
    })

    fs.writeFileSync("./1reporte/result.json", JSON.stringify(res, null, 2));
 }

 

 function checkNull(check, state, base){
    const result = base[0].filter(e => e[check] == state);
 }

 function checkImagenesNull(check, state, base){
    const img = []
    const result = base[0].map(async e => {
        const imgCheck =  `../../public/img/${e.categorias}/${e.imagendetalle}`;
        const pathCheck = await checkFileExists(imgCheck);
        
        if(pathCheck == false){
            img.push({codigo: e.codigo, img: e.imagendetalle})
            fs.writeFileSync("./1reporte/result.json", JSON.stringify(img, null, 2));
        }
        
    });
    console.log(img)
    fs.writeFileSync("./1reporte/result.json", JSON.stringify(img, null, 2));
 }

 function checkFileExists(file) {
    return fs.promises.access(file, fs.constants.F_OK)
             .then(() => true)
             .catch(() => false)
  }

  function split(base){
    const res = []
   base[0].forEach(e => {
    
    if(e.codigo != undefined || e.codigo != " "){
        // const arrCheck = ["VS0018","VS0052","VS0050","VS0006","VS0007","VS0005","VS0051","VS0100","VS8502","VS0101","VS0900","VS6681","VS7202","VS0102","VS5140","VS7201","VS4915","VS4920","VS1000","VS7204","VS0110","VS0053","VS7203","PA0005","PA0001"]//,"HI2500","HI0791","HI0517","HI1072","HI8100","HI0901","HI1120","HI0317","HI8102","HI2060","HI2901","HI0417","HI0451","HI2900"]
        //     arrCheck.forEach(cod => {
        //         if(e.codigo.includes(cod)){
        //             let str = e.imagendetalle.split(".");
        //             if(str[1] != undefined){
        //                 str[1] = str[1].toLowerCase()//str[1].toUpperCase()//
        //                 str = str.join(".")
        //                 res.push({codigo: e.codigo, imagendetalle: str})
        //             }
        //         }  
        //     })
        
        
        if(e.categorias == "BB"){ // || e.categorias == "CP" || e.categorias == "CM"){
            let str = e.imagendetalle.split(".");
            if(str[1] != undefined){
                str[1] = str[1].toLowerCase()//str[1].toUpperCase()//
                str = str.join(".")
                res.push({codigo: e.codigo, imagendetalle: str})
            }
        }
    }
})
    
   fs.writeFileSync("./result.json", JSON.stringify(res, null, 2));
 }