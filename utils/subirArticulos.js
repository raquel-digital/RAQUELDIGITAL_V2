const controller = require("../api/arts/controller")

async function subirPrecios(artActu){
    let success = true;
    try{
       
        for(let e of artActu){
          if(!e.hasOwnProperty('mostrar')){
            e.mostrar = true;
          }
          let price = e.precio.replace(",",".");
          e.precio = Number(price);
        }
        const result = await controller.nuevoArticulo(artActu);   
        
        console.log(result)
        result.forEach(e => {
          if(!e.result){
            success = false;
          }
        });

        console.log(" [ SUBIDA LOCAL A MONGO ] ", result);
      }catch(err){    
           console.log(" [ ERROR: SUBIDA LOCAL A MONGO ] ", err)
           success = false;
      }
      
      console.log("[ ARTICULOS YA SUBIDOS ]");
  
      if(success){
        console.log("[ ARTICULOS SUBIDOS EXITOSAMENTE!! ]");
        return {count: artActu.length , state: true}
      }else{
        console.log("[ FALLO PROCESO INTENTE NUEVAMENTE ]");
        return {state: false};
      }
}

module.exports = subirPrecios