function buscador(query, admin){
    //limpia cache del modulo precios
    delete require.cache[require.resolve("../public/system/dir/allArts.json")];

    //vuelve a cargarlo en caso que se actualice
    const arts = require("../public/system/dir/allArts.json")    
    const cosulta = query.toUpperCase()

    let res = arts.filter(e => {
        const checkNom2 = e.nombre2.toUpperCase()
        
        if(e.codigo.includes(cosulta) 
        || e.nombre.includes(cosulta)
        || checkNom2.includes(cosulta)){

            if(admin){
                return e
            }else{
                if(e.mostrar){
                    return e
                }
            }
        }
       
    })
        
    return res
}

module.exports = buscador