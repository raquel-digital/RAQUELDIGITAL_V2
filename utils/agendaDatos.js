//  SE USO PARA TOMAR LOS PEDIDOS LOCALES Y GENERAR UN LISTADO DE CLIENTES

const MongoClient = require('mongodb').MongoClient;
const fs = require("fs")
const dotenv = require('dotenv');
const db = require("../db");//conexion con mongo
dotenv.config();
db(process.env.mongo);


(async () => {
    //Bajamos pedidos local activos    
    const modelPedidosLocal = require("../api/pedidos/pedidosLocal/model")
    const collection = await modelPedidosLocal.find()
    fs.writeFileSync(`./agenda/pedidosLocal.json`, JSON.stringify(collection, null, 2));

    //Bajamos pedidos local terminados
    const modelPedidosLocalTerminados = require("../api/pedidos/pedidosLocal/modelDelete")
    const collectionTerminados = await modelPedidosLocalTerminados.find()
    fs.writeFileSync(`./agenda/pedidosLocalTerminados.json`, JSON.stringify(collectionTerminados, null, 2));

    collectionTerminados.forEach(e => collection.push(e))
    
    const clientes = []
    collection.forEach(e => {

        if(e.cliente[0] == " "){
            e.cliente = e.cliente.slice(1)
        }
        if(e.cliente.includes(" ")){
            e.cliente = e.cliente.replace(/\s/g, '_');
        }
        const cli = e.cliente.toUpperCase()
        if(!clientes.includes(cli)){
            clientes.push(cli)
        }
    })

    fs.writeFileSync(`./agenda/clientes.json`, JSON.stringify(clientes.sort(), null, 2));
})()


//codigo que use para depurar la lista
// const agenda = require("./agenda/clientes.json")
// const fs = require("fs")
// const data = []

// agenda.forEach(e => {
//     if(!data.includes(e)){
//         data.push(e)
//     }
// })

// fs.writeFileSync(`./agenda/clientes.json`, JSON.stringify(data.sort(), null, 2));