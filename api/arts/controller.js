
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
                    // const split = dateId.fechaModificacion.split(" ");
                    // const splitPuntos = split[1].split(":")
                    // splitPuntos[2] = parseInt(splitPuntos[2]) + 1
                    // split[1] = splitPuntos.join(":")
                    // dateId.fechaModificacion = split.join(" ")                    
                    // a.fechaModificacion =  dateId.fechaModificacion;

                    const date = new Date();
                    const fecha = date.toLocaleString();
                    const fechaSplit = fecha.split(",") 
                    a.fechaDeIngreso = fechaSplit[0]
                    a.fechaModificacion = fechaSplit[0]
                    if(!a.stock) {
                        a.stock = 10;
                    }
                    a.imgActualizada  = true;                    
                    const ingreso = await store.ingresar(a);
                    result.push(ingreso);
                })();
            }
            return result;
           
        }catch(err){
            return { result: err}
        }        
    },

    leerArticulos: async function (){
        let base
        return base = store.leer();
    },

    actualizarArticulos: async function(data){
       try{
        
        let result;
        const arrayRes = [];

        for(const e of data){            
            if(e._id || e.descripcion == "color"){
                if(e.descripcion == "color"){
                    const split = e.codigo.split("-")
                    e.stock = 10
                    if(split.length > 2){
                        e.codigo = split[0]+"-"+split[1]
                    }else{
                        e.codigo = split[0]
                    }                   
                    e._id = e.nombre2
                }                
                result = await store.updateColor(e);                
                arrayRes.push(result);
            }else{
                const date = require("../../utils/fecha")
                e.fechaModificacion = date()
                result = await store.update(e);
                arrayRes.push(result);
            }
        }
        
        const finalmente = arrayRes.filter(e => !e.status);        

        if(finalmente.length > 0){
          return finalmente;
        }else{
          console.log("[ CONTROLLER ] ACTUALIZACION EXITOSA ")  
          return { message: "Articulos actualizados correctamente", update: arrayRes.map(e => e.upd)};
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
       //const result = await store.search(query);
       const buscador = require("../../utils/buscadorLocal")
       const result = await buscador(query, "admin")
       return result;
    },
    buscarArticuloPorColor: async function(query){
        const split = query.split(" ")
        const result = await store.search(split[0]);
        const colorQuery = []
        result.map(e => e.colores.filter(f => {
            const check = f.codigo.toLocaleLowerCase()
            if(check.includes(split[2])){
                colorQuery.push({
                    codigo: f.codigo, 
                    categorias: e.categorias, 
                    tags: e.tags,
                    imagendetalle: f.color,
                    mostrar: f.mostrar,
                    precio: e.precio,                    
                    nombre: e.nombre,
                    nombre2: f._id,
                    descripcion: "color",
                    stock: e.stock
                })
            }
        }))   
        
        return colorQuery
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
                return res;
            }catch(err){
                console.log("[ ERROR EN STORE funcion agregarColores() ] " + err);
                return false;
            } 
                
                       
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
    actualizarPedido: async function (data){ 
        
        for(let d of data){
            const r = await store.updateOrder(d)
            const check = Number(r.precio.replace(",", "."))
            if(check != d.precio){
                d.precio = check               
            }
        }  
        
        return data
    },
    busquedaMasiva: async function (data){
        
        const res = await store.findMassUpdate(data)
        data.res = res
        
        return data
    },
    cambiosMasivos: async function (data){
        const ant = []
        const upd = []
        
        for(const d of data){
            const r = await store.updateMass(d)
            ant.push(r)
            const u = await store.search(d.codigo)
            upd.push(u[0])
        }          
        
        const res = {
            anterior: ant,
            update: upd
        }
        return res
    },
    actuStock: async function (send){        
      const res = await store.updateStock(send)
      return res
    },
    stockControl: async function (compra){        
        compra.forEach(c => {
            store.stockControl(c)
        })
    }
}

module.exports = controller;