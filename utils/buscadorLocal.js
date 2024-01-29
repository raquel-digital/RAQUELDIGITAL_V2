function buscador(query){
    //limpia cache del modulo precios
    delete require.cache[require.resolve("../public/system/dir/allArts.json")];
    //vuelve a cargarlo en caso que se actualice
    const arts = require("../public/system/dir/allArts.json")
    
    let res = arts.filter(e => {
        if(e.codigo.includes(query.toUpperCase()) && e.mostrar == true){
            return e
        }
        if(e.nombre.includes(query.toUpperCase()) && e.mostrar == true){            
            return e
        }
        const checkNom2 = e.nombre2.toUpperCase()
        if(checkNom2.includes(query.toUpperCase()) && e.mostrar == true){            
            return e
        }
    })
        
    return res
}

module.exports = buscador