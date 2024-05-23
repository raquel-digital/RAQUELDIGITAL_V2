const fs = require("fs")

const allArts = require("../public/system/dir/allArts.json")
const res = []

function read(){
    allArts.forEach(element => {
        fs.access("../public/img/"+element.categorias+"/"+element.imagendetalle, fs.constants.F_OK, (err) => {
            if (err) {
                // El archivo no existe
                res.push({codigo: element.codigo, img: element.imagendetalle})
                //return console.log('Image not found ' + element.codigo);
            }
        });
    });
    write()
}

function write(){
    console.log(res)  
    if(res.length > 0){    
        fs.writeFileSync(`./resImagen.json`, JSON.stringify(res, null, 2));
    }
}

read()

//const img = require("../public/img/AB/AB0013.JPG")

