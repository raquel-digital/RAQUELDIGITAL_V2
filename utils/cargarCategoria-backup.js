//const productos = require("../articulos/Articulos-Web.json");
const controller = require("../api/arts/controller")


async function loadCateg(query){
      if(query == "Elásticos"){
            query = "elasticos"; 
      }
      const categ = query.toLowerCase();
      
      if(categ == "alfileres y agujas"){
       const result = await filtrar(["AF","AG","AT","BA","GA"]);
       
       if(result.length > 0){
        return { succes: true, result: result }; 
       }
      }
      if(categ == "abrojos"){
       const result = await filtrar("AJ");
       
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }
      if(categ == "aplicaciones"){
       const result = await filtrar(["AB","AC","AE","AD","AR","RE/estampado"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }       
      }
      if(categ == "brillos"){                 
       const result = await filtrar(["ST","LE","MO"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }       
      }
      if(categ == "bordado"){
       const result = await filtrar(["BB","RB","TP-BORDADO","CS-BORDADO","HI/mouline","HI/coloris","HI/variacion","HI/HI0317","HI/bordado"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }       
      }
      if(categ == "botones y broches"){
       const result = await filtrar(["BO","BP","BR","CS-BROCHE"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }       
      }
      if(categ == "cierres"){        
       const result = await filtrar("CE");
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }
      if(categ == "cintas"){        
       const result = await filtrar(["CI","GB","GL","GP","NA","CI/VIVOS","CI/TALLES-REPARACION"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }
      if(categ == "cordones"){        
       const result = await filtrar(["CD","TE"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }
      if(categ == "costura"){        
            const result = await filtrar(["CS","CS-BROCHE","TR"]);
            if(result.length > 0){
             return { succes: true, result: result } 
            }
      }
      if(categ == "elásticos"){        
       const result = await filtrar(["EL","EN"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }
      if(categ == "flores"){        
       const result = await filtrar(["FL","FR"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }
      if(categ == "herrajes"){      
       const result = await filtrar(["AH","AP","MQ","HE","HH","RC","RR","TE"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }
      if(categ == "herramientas"){      
       const result = await filtrar(["TJ","MH","PE"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }
      if(categ == "hilos"){      
       const result = await filtrar(["HI","HI/HI8100","HI/HI0901","HI/HI9000"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }
      if(categ == "indumentaria"){      
            const result = await filtrar(["AN","CA","HO","HC","GL","GP","LE","MO","PF","PL","RC","RR","RE","TA","TE","FB","TP","TR","CI/VIVOS","VS/INDUMENTARIA","CS-BROCHE","CI/TALLES-REPARACION"]);
            if(result.length > 0){
             return { succes: true, result: result } 
            }
      }
      if(categ == "lanas"){      
       const result = await filtrar(["LA","AT"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }
      if(categ == "manualidades"){      
       const result = await filtrar(["AL","CM","CP","MU","MH/manualidades","VS/manualidades","RV","CS-BORDADO"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }
      if(categ == "matrices e insumos"){      
       const result = await filtrar(["BU","BR","BS","CR","CS-BROCHE"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }
      if(categ == "puntillas"){      
       const result = await filtrar(["PY","PU","BX","PW","PT","PZ","PR"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }      
      if(categ == "tapices"){
       const result = await filtrar("TZ");
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }    
      if(categ == "telar"){
       const result = await filtrar("BB","CS-BORDADO","RV","VS/manualidades");
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }    
      if(categ == "otros"){
       const result = await filtrar(["HC","VS","PA","VS/INDUMENTARIA"]);
       if(result.length > 0){
        return { succes: true, result: result } 
       }
      }
      
      //categorias especiales
      if(categ === "navidad"){
       const result = await filtrar(["NA", "NA/campana", "NA/cascabel"]);
       const controller = require("../api/arts/controller");
       const busqueda = [];     
       let resQuery = [];     
       const queryEspecial = ["ci0140", "gl6023", "GL6027", "cd2013", "cd2012", "cd9000", "fb0623", "FB0647", "FB0641", "fb0004", "fb0352"];
       for(const q of queryEspecial){
           const res = await controller.buscarArticulo(q)
           res.map(e => resQuery.push(e));
       }
       if(resQuery.length > 0){
            resQuery.map(e => result.push(e)) ;
       }  
       if(result.length > 0){
        return { succes: true, result: result } 
       }     
      }

      
      return { succes: false, result: "Categoria no valida" }
}

async function filtrar(categ){          
      const result = await controller.cargarCateg(categ);
      return result;
}

module.exports = loadCateg;