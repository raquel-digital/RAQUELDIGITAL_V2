//const fs = require("fs");

const controller = require("../api/arts/controller");

async function actu(base, actu){    
    try{
        console.log("[ ACTUALIZANDO PRECIOS ]")
        const result = [];
        base.forEach(art => {
            actu.forEach(precio => {
                if(art.codigo.includes(precio.Codigo) && precio.Precio != art.precio){
                    const repArt = art.precio.replace(",",".");
                    const repActu = precio.Precio.replace(",",".");
                    const artPrice = Number(repArt);
                    const actuPrice = Number(repActu);
                    let baja = false                    
                    if(artPrice > actuPrice){                        
                        baja = true;
                    }                
                    const actu = { codigo: art.codigo, precio: precio.Precio, baja: baja, precioViejo: art.precio};
                    result.push(actu);
                }
            })
        })
        
        
        console.log("[ HAY " + result.length + " ARTÍCULOS PARA ACTUALIZAR ]");
        
        console.log("[ ACTUALIZANDO VA A LLEVAR UN TIEMPO .... ]");
        
        //fs.writeFileSync("./utils/local/1reporte/result.json", JSON.stringify(result, null, 2));
        
        await controller.actualizarPrecios(result);
        return result;
    }catch(err){
        console.log("[ ERROR EN FUNCION ACTU ] " + err);
        console.log("[ ERROR EN FUNCION ACTU ] " + err + art.codigo);
        return false;
    }
    

    
}


async function exportar(nuevosPrecios){
    try{
        const base = await controller.leerArticulos();
        const result = await actu(base[0], nuevosPrecios)
        return result;
    }catch(err){
        console.log("error actualizar precio " + err);
        return false;
    }
}

module.exports = exportar;