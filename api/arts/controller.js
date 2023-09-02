
const { async } = require("rxjs");
const store = require("./store");

controller = {
    nuevoArticulo: function (art){
        try{
            const result = [];
            let dateId = { id: 0}
            let i = 1;
            for(let a of art){
                (async () => {
                    if(dateId.id == 0){
                        dateId = await store.lastDateAndId();
                    }
                    
                    dateId.id = dateId.id + i;
                    i++;
                    a.id = dateId.id;
                    //console.log(a.codigo, dateId.id)
                    const split = dateId.fechaModificacion.split(" ");
                    const splitPuntos = split[1].split(":")
                    splitPuntos[2] = parseInt(splitPuntos[2]) + 1
                    split[1] = splitPuntos.join(":")
                    dateId.fechaModificacion = split.join(" ")                    
                    a.fechaModificacion =  dateId.fechaModificacion;
                    const date = new Date();
                    a.fechaDeIngreso = date.toLocaleString;
                    if(!a.stock) {
                        a.stock = 10;
                    }
                    a.imgActualizada  = true;
                    //****a mano****//
                        //a.mostrar = false
                        //a.id = ids;
                    //*****//
                    const ingreso = await store.ingresar(a);
                    result.push(ingreso);
                })();
            }
            return result;
           
        }catch(err){
            return { result: err}
        }        
    },

    leerArticulos: function (){
        let base
        return base = store.leer();
    },

    actualizarArticulos: async function(data){
       try{
        //console.log(data)
        let result;
        const arrayRes = [];

        for(const e of data){
            if(e._id){
                result = await store.updateColor(e);
                arrayRes.push(result);
            }else{                
                result = await store.update(e);
                arrayRes.push(result);
            }
        }
        
        const finalmente = arrayRes.filter(e => !e.status);

        if(finalmente.length > 0){
          return finalmente;
        }else{
          console.log("[ CONTROLLER ] ACTUALIZACION EXITOSA " + result)  
          return { message: "Articulos actualizados correctamente" };
        }
       }catch(err){
        console.log("[ ERROR EN CONTROLLER UPDATE ] " + err);
       }
    },

    actualizarDesdeArchivo: async function(data){
        try{
         //console.log(data)
         let result;
         const arrayRes = [];
 
         for(const e of data){             
            result = await store.updateFromFile(e);
            arrayRes.push(result);           
         }
         
         const finalmente = arrayRes.filter(e => !e.status);
 
         if(finalmente.length > 0){
           return finalmente;
         }else{
           console.log("[ CONTROLLER ] ACTUALIZACION EXITOSA " + result)  
           return { message: "Articulos actualizados correctamente" };
         }
        }catch(err){
         console.log("[ ERROR EN CONTROLLER UPDATE ] " + err);
        }
     },

    buscarArticulo: async function(query){
       const result = await store.search(query);
       return result;
    },

    cargarCateg: async function(categ){
        try{      
           return await store.loadCateg(categ);
        }catch(err){
            return console.log("[ CONTROLLER NO PUDO CARGAR LA CATEGORÍA ] " + err );
        }
    },

    ultimos20subidos: async function() {
        let result;
        return result = await store.last20(result);
    },

    ultimaFecha_ID: async function() {
       const res = store.lastDateAndId();
       return res;
    },     

    borrarArt: async function(arts) {
        if(Array.isArray(arts)) {
            for(a of arts) {
                store.delete(a);
            }
        }else {
            store.delete(arts);
        }

        return "Articulos Eliminados"
    },

    actualizarPrecios: async function(data) {
        try{
          if(Array.isArray(data)){
            for(const d of data){
                await store.updatePrices(d);
            }
          }else{
           await store.updatePrices(data);            
          }           
          return true;
        }catch(err){
            console.log(" [ERROR EN CONTROLLER ACTUALIZAR PRECIOS ] " + err);
            return false;
        }
    },
    agregarColores: async function(data) {
        
            //***********OLD**************
            //try{
            //let res;
            

            // for (let i = 0; i < data.length; i++) {
            //     let d = data[i]
            //     d.id = i

            //     const split = d.codigo.split("-");
            //     const code = split[0];
            //     res = store.addColor(code, d);
            //   }
            //     for(let d of data){
            //         const split = d.codigo.split("-");
            //         const code = split[0];
            //         res = store.addColor(code, d);
            //     }
            //     return res;
            // }catch(err){
            //     console.log("[ ERROR EN STORE funcion agregarColores() ] " + err);
            //     return false;
            // } 
            //***************************** */
            try{
                let res;            
                for(let d of data){
                    const split = d.codigo.split("-");
                    if(split.length>2){
                        const code = split[0]+"-"+split[1];
                        res = store.addColor(code, d);
                    }else{
                        const code = split[0];
                        res = store.addColor(code, d);
                    }
                }
            }catch(err){
                console.log("[ ERROR EN STORE funcion agregarColores() ] " + err);
                return false;
            } 
                
                return res;       
    },
    agregarColoresPreexistentes: async function(data) {
        try{
            let res;            
            for(let d of data){
                let code;
                if(d.codigo[6] == "-"){
                    const split = d.codigo.split("-");
                    code = split[0];
                }
                if(d.codigo[6] == "_"){
                    const split = d.codigo.split("_");
                    code = split[0];
                }
                
                res = store.addColor(code, d);
            }
            return res;
        }catch(err){
            console.log("[ ERROR EN STORE funcion agregarColores() ] " + err);
            return false;
        }        
    },
}

module.exports = controller;