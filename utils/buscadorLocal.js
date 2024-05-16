function buscador(query, admin){
    //limpia cache del modulo precios
    delete require.cache[require.resolve("../public/system/dir/allArts.json")];

    //vuelve a cargarlo en caso que se actualice
    const arts = require("../public/system/dir/allArts.json")    
    const consulta = query.toUpperCase()
    const words = consulta.split(" ")

    const res = arts.filter(e => {
        const checkNom2 = e.nombre2.toUpperCase();
    
        if (e.codigo.includes(consulta)
        || e.nombre.includes(consulta)
        || checkNom2.includes(consulta) 
        || words.some(name => e.nombre.includes(name)) 
        || words.some(word => checkNom2.includes(word))) {
            if (admin) {
                return true; 
            } else {
                if (e.mostrar) {
                    return true;
                }
            }
        }
    
         return false; // si ninguna condición se cumple, devuelve false
    
        //OLD
        // if(e.codigo.includes(consulta) 
        // || e.nombre.includes(consulta)
        // || checkNom2.includes(consulta)){

        //     if(admin){
        //         return e
        //     }else{
        //         if(e.mostrar){
        //             return e
        //         }
        //     }
        // }
       
    });

    return res

    //Score estapa de test
    // const resScore = res.map(e => {
    //     let score = 0
    //     if (e.codigo.includes(consulta)){
    //         score += 6
    //     }
    //     if(e.nombre.includes(consulta)){
    //         score += 2
    //     }
    //     if(e.nombre2.includes(consulta)){
    //         score += 2
    //     }
    //     if(words.some(name => e.nombre.includes(name))){
    //         score += 1
    //     }
    //     if(words.some(word => e.nombre2.includes(word))){
    //         score += 1
    //     }
        
    //     return {elemento: e, score: score}
    // });

    // const resSort = resScore.sort((a, b) => b.score - a.score);
    // const orderedResults = resSort.map(item => item.elemento);
       
    // console.log(resSort) 
    // return orderedResults
}

module.exports = buscador