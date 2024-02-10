const express = require('express');
const {  auth, requiresAuth } = require('express-openid-connect');

const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const requer  = require("./utils/config")
const controller = require("./api/arts/controller");
const fs = require("fs")

//socket
const io = require('./io.js').init(http);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require('path');
const logger = require('morgan');

//cargar tags nuevos
const loadCategs = require("./utils/tagsGenerator")

const nodemailer = require('nodemailer');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:8080',
    clientID: 'KLMYKNTCOXdY4xnFo6BIaJ6S0L7M0mDi',
    issuerBaseURL: 'https://dev-mrcujunoqv0mgprk.us.auth0.com'
  };

  // auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
// // Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
    res.locals.user = req.oidc.user;
    next();
  });

 


io.on('connect', socket => {

    (async () => {
        try{
            const res = await controller.ultimos20subidos()
            socket.emit("productos", res);
        }        
        catch(err){            
            console.log(err + " Error en inciar articulos WEB");  
        }
     })();

    //GUARDAR PEDIDO
    socket.on("guardar-pedido-usuario", data => {
        (async ()=>{
            const controller = require("./api/auth/controller")
            const res = await controller.guardarPedido(data)
            socket.emit("guardar-pedido-usuario-res", res)
        })()
    }) 
    //BORRAR PEDIDO
    socket.on("borrar-pedido", data => {
        (async ()=>{
            const controller = require("./api/auth/controller")
            const res = await controller.borrarPedido(data)
            socket.emit("borrar-pedido-res", res)
        })()
    }) 
    //ACTUALIZAR PRECIOS DE CARGA DE COMPRA DE USUARIO
    socket.on("chequear-compra", data => {
        (async ()=>{            
            const controller = require("./api/arts/controller")
            const res = await controller.actualizarPedido(data)
            socket.emit("chequear-compra-res", res)
        })()
    })
    
    //CHECK OUT    
    socket.on("mail", data =>{        
        (async () => {
            //ingresamos pedido a la base de datos
            const controller = require("./api/users/controller")
            await controller.ingresar(data)

            //enviamos mail
            await mailEmit(data);
        })()    
    })    
    
    //ADMIN PEDIDOS
    socket.on("chequear-pedidos-admin", () => {        
        const userController = require("./api/pedidos/controller");
        (async () => {            
         const result = await userController.buscar();
         socket.emit("nuevos-pedidos", result);
        })();        
    });
    
    socket.on("update-pedido", pedidos => {
        const controller = require("./api/pedidos/controller");
        (async () => { 
            const res = await controller.updatePedidos(pedidos);
            socket.emit("update-pedido-res", res);
        })();
    });

    socket.on("borrar-pedido", orden => {
        const controller = require("./api/pedidos/controller");
        (async () => { 
            const res = await controller.borrarPedidos(orden);  
            socket.emit("borrar-pedido-res", res)          
        })();
    });
    socket.on("nuevo-pedido-local", pedido => {
        const controller = require("./api/pedidos/pedidosLocal/controller");
        (async () => { 
            const res = await controller.ingresar(pedido);     
            socket.emit("nuevo-pedido-local-res",res)       
        })();
    })
    socket.on("buscar-pedidos-local", () => {
        const controller = require("./api/pedidos/pedidosLocal/controller");
        (async () => { 
            const res = await controller.buscar();
            socket.emit("buscar-pedidos-local-res", res)            
        })();
    })
    socket.on("update-pedido-local", pedidos => {
        const controller = require("./api/pedidos/pedidosLocal/controller");
        (async () => { 
            const res = await controller.updatePedidos(pedidos);
            socket.emit("update-pedido-local-res", res);
        })();
    });
    socket.on("borrar-pedido-local", orden => {
        const controller = require("./api/pedidos/pedidosLocal/controller");
        (async () => { 
            const res = await controller.borrarPedidos(orden);
            socket.emit("update-pedido-local-res", res);
        })();
    });
    socket.on("pedidos-anteriores", () => {
        const controller = require("./api/pedidos/pedidosLocal/controller");
        (async () => { 
           const res = await controller.pedidosAnteriores();
           socket.emit("pedidos-anteriores-res", res);
        })();
    })
    socket.on("findOld", query => {
        const controller = require("./api/pedidos/pedidosLocal/controller");
        (async () => { 
           const res = await controller.buscarPedidoAnterior(query);
           socket.emit("findOld-res", res);
        })();
    })
    socket.on("busqueda-pedido", num_orden => {
        const userController = require("./api/users/controller");
        (async () => {
          const res = await userController.buscar(num_orden)
          socket.emit("busqueda-pedido-reponse", res)
        })();
    })
    //---------------
    //ADMIN SEARCH
    socket.on("busqueda-admin", query => {       
        (async () => {
            if(Array.isArray(query)){
                const result = []
                 for(let q of query){
                    const split = q.codigo.split("-")
                    const res = await controller.buscarArticulo(split[0]);
                    result.push(res)
                 }
                 socket.emit("res-busqueda-upload", result[0]);
            }else{
                let result;
                if(query.includes("color")){
                    result = await controller.buscarArticuloPorColor(query);
                }else{
                    result = await controller.buscarArticulo(query);
                }
                            
                socket.emit("resultado-busqueda", result);
            }            
        })();
    })
    //ADMIN PRECIOS
    socket.on("actuPrecios", data => {
        (async () => {
            const actuPrecios = require("./utils/preciosActu");
            const result = await actuPrecios(data);            
            if(result){
                loadCategs()
                socket.emit("actuPreciosRes", (result));
            }
        })();        
    })
    //ADMIN ARTICULOS
    socket.on("delete", data => {
        loadCategs()
        controller.borrarArt(data);
    })
    socket.on("cambio-en-articulos", cambiosEnArticulos => {                
        (async () => {
            const result = await controller.actualizarArticulos(cambiosEnArticulos);
            loadCategs()
            socket.emit("result-actu", result);
        })();
    })
    //ADMIN SUBIR ARTICULO NUEVO
    socket.on("nuevos-articulos", articulos => {
        const subirArchivo = require("./utils/subirArticulos");
        (async ()=> {
          const result = await subirArchivo(articulos);
          loadCategs()
          socket.emit("nuevos-articulos-res", result);
        })();
    })
    //ADMIN SUBIR COLORES
    socket.on("upload-colors", colores => {
        (async () => {
          const res = await controller.agregarColores(colores);
          loadCategs()
          socket.emit("upload-colors-res", res);
        })();
    })
    //Update Masivo de articulos
    socket.on("update-masivo", data => {
        (async () => {
            const res = await controller.busquedaMasiva(data);        
            socket.emit("update-masivo-res", res);
        })();
    })
    //Update Masivo de articulos CONFIRMAR CAMBIOS
    socket.on("update-masivo-ok", data => {
        (async () => {
            const res = await controller.cambiosMasivos(data);    
            loadCategs()    
            socket.emit("update-masivo-ok-res", res);
        })();        
    })
    //ADMIN seleccionar categorias
    socket.on("categ-seleccionada", categ => {
        (async () => { 
            const categOrganicer = require("./utils/cargarCategoria")
            const result = await categOrganicer(categ);
            socket.emit("categ-result", result);
        })();
    }); 
    //AGENDA    
    socket.on("req-cli", async () => {
        delete require.cache[require.resolve("./utils/agenda/clientes.json")];        
        const clientes = require("./utils/agenda/clientes.json")

        //MONGO BORRA RESULTADOS
        // const store = require("./api/agenda/store")        
        // const resMongo = await store.readAgenda()
        // const res = JSON.parse(clientes)

        socket.emit("req-cli-res", clientes)
    })
    socket.on("nuevo-cliente", async agenda =>{
        delete require.cache[require.resolve("./utils/agenda/clientes.json")];
        fs.writeFileSync(`./utils/agenda/clientes.json`, JSON.stringify(agenda, null, 2));
        const clientes = require("./utils/agenda/clientes.json")

        //MONGO
        // const store = require("./api/agenda/store")        
        // const resMongo = await store.writeAgenda(JSON.stringify(agenda))
        // const res = JSON.parse(clientes)

        socket.emit("req-cli-res", clientes)
    })
    socket.on("agenda-inicio", async () => {
        delete require.cache[require.resolve("./public/system/dir/tareasPendientes.json")];
        const update = require("./public/system/dir/tareasPendientes.json")

         const store = require("./api/agenda/store")        
         const resMongo = await store.read()
         const res = JSON.parse(resMongo[0].agenda)
        socket.emit("agenda-inicio-res", update)
    })

    socket.on("tarea-nueva", async data => {
               
        let ruta;
        let res
        const store = require("./api/agenda/store")
        const dataString = JSON.stringify(data)
        if(data[data.length - 1].borrado){        
            console.log("Borrarr")    
           //escribimos en historial 
           ruta = "./public/system/dir/historialTareas.json"
           res = await store.write(dataString, "historial")
        }else{
           //escribimos en tareas pendientes
           ruta = "./public/system/dir/tareasPendientes.json"
           res = await store.write(dataString)
        }

        fs.writeFileSync(ruta, JSON.stringify(data, null, 2));
        
        //LOCAL
        delete require.cache[require.resolve("./public/system/dir/tareasPendientes.json")];
        const update = require("./public/system/dir/tareasPendientes.json")
        //MONGO
        res = JSON.parse(res[0].agenda) 
        socket.emit("tarea-nueva-res", update)
    })
    socket.on("art-borrado", async artBorrado => {        
         delete require.cache[require.resolve("./public/system/dir/historialTareas.json")];
         const historial = require("./public/system/dir/historialTareas.json")
         
        const store = require("./api/agenda/store")
        const mongo = await store.read("historial")
        //CUANDO TRABAJEMOS EN MONGO HABILITAR!! CUIDADO
        //const historialMongo = JSON.parse(mongo[0].agenda)
        //console.log(historial)  

        historial.push(artBorrado[0])
        const noInlcuir = ["Modificaciones en web", "Actualizacion Articulos Web", "Mantenimiento Agenda", "Revisar Precio", "Redes Sociales"]
        const filtrar = historial.filter(e => !noInlcuir.includes(e.tipo_de_tarea))
        
        const upload = JSON.stringify(filtrar)
        fs.writeFileSync(`./public/system/dir/historialTareas.json`, JSON.stringify(filtrar, null, 2));
        await store.write(upload, "historial")
    })
    socket.on("art-borrado-historial", async historialBorrado => {  
        const upload = JSON.stringify(historialBorrado)      
        const store = require("./api/agenda/store")  
        console.log(upload)      
        await store.write(upload, "historial")
    })
    socket.on("historial-tareas", async () => {
        delete require.cache[require.resolve("./public/system/dir/historialTareas.json")];
        const historial = require("./public/system/dir/historialTareas.json")
        
        const store = require("./api/agenda/store")        
        const resMongo = await store.read("historial")
        const res = JSON.parse(resMongo[0].agenda)
        socket.emit("historial-tareas-res", historial)
    })
    socket.on("busqueda-agenda", async tareas => {
        const store = require("./api/agenda/store")
        const resMongo = await store.read("historial")
        const res = JSON.parse(resMongo[0].agenda)
        const agenda = [...tareas, ...res];
        socket.emit("busqueda-agenda-res", agenda)
    })
    socket.on("borrar-cliente-lista", cliente => {
        delete require.cache[require.resolve("./utils/agenda/clientes.json")];        
        const clientes = require("./utils/agenda/clientes.json")
        const filter = clientes.filter(e => e != cliente)
        fs.writeFileSync(`./utils/agenda/clientes.json`, JSON.stringify(filter, null, 2));
        socket.emit("req-cli-res", filter)
    })
})


//ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));



//**** */
const router = require("./routers/router");
app.use(router);

const db = require("./db");//conexion con mongo

db(process.env.mongo);

async function mailEmit(data){

    const datos = data;
    let compra;

    data.sys.compra.forEach(e => {
        compra +=`
        <tr>
        <td><img src="https://raqueldigital.herokuapp.com/${e.imagen}" alt="imagen table" widht="60px" height="60px"></td>
        <td>${e.codigo}</td>
        <td>${e.titulo}<td>
        <td>${e.cantidad}</td>
        <td>${e.precio}</td>
        </tr>       
        `
       
    })
    
    const store = require("./api/users/store");
    let orden = await store.numero_orden();
    orden++ 

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {            
            user: requer.mail,
            pass: requer.pmail
        },
        tls: {
            rejectUnauthorized: false//importante para que no rebote la conexccion
        }
    })
    let mailOptions;
    if(datos.sys.checked.retiro){
        console.log("retira")
        mailOptions = {
            from: 'SITIO WEB',
            to: 'raqueldigitalweb@gmail.com',            
            subject: 'Pedido Raquel Digital N° orden:' + orden,
            html: ` <h1> NUEVO PEDIDO N° ${orden} </h1>
                    <h3>NOMBRE Y APELLIDO: ${datos.nombreApellido}</h3>
                    <h3>FORMA DE ENVIO: ${datos.retira}</h3>                    
                    <h3>FORMA DE CONTACTO: ${datos.formaDeContacto.contacto} ${datos.formaDeContacto.numero}</h3>
                    <h3>FACTURACION: ${datos.facturacion.tipo} RazonSocial: ${datos.facturacion.RazonSocial} CUIT: ${datos.facturacion.CUIT}</h3>
                    <h3>FORMA DE PAGO: ${datos.formaDePago}</h3>
                    <h1> COMPRA</h1>  
                    <hr>
                    <thead>
               <tr>
                   <th>codigo</th>
                   <th>titulo</th>
                   <th>cantidad</th>
                   <th>precio unitario</th>                   
                   <th>total</th>
               </tr>
              </thead>
              <tbody class="resumen-check-out">
              ${compra}
              </tbody>
              <tfoot >
                <tr class="total-compra-final">
                  TOTAL DEL PEDIDO: ${data.sys.totalCompra.toFixed(2)}
                  TOTAL DEL PEDIDO + ENVIO: ${data.sys.totalCompra.toFixed(2) + data.tipoDeEnvio.Costo}
                </tr>
          </tfoot>
            `
        }
    }
    
    if(datos.sys.checked.expreso || datos.sys.checked.correo || datos.sys.checked.moto){        
        const costo_envios = Number(data.sys.totalCompra) + Number(data.tipoDeEnvio.Costo)
            mailOptions = {
                from: 'SITIO WEB',
                to: 'raqueldigitalweb@gmail.com',
                subject: 'Pedido Raquel Digital N° orden:' + orden,
                html: ` <h1> NUEVO PEDIDO N° ${orden} </h1>
                        <h3>NOMBRE Y APELLIDO: ${datos.nombreApellido}</h3>
                        <h3>FORMA DE ENVIO: ${datos.retira}</h3>                   
                        <h3>TIPO DE ENVIO: ${datos.tipoDeEnvio.forma_de_envio}</h3>
                        <h3>FORMA DE PAGO: ${datos.formaDePago}</h3>

                        <h3>DIRECCION DE ENVIO: 
                        <ul>                        
                            <li>
                                PROVINCIA: ${datos.tipoDeEnvio.Provincia}
                            </li>
                            <li>
                                LOCALIDAD: ${datos.tipoDeEnvio.Localidad}
                            </li>
                            <li>
                                TRANSPORTE: ${datos.tipoDeEnvio.Empresa}
                            </li>
                            <li>
                                CALLE: ${datos.tipoDeEnvio.Calle} ALTURA: ${datos.tipoDeEnvio.Altura} PISO: ${datos.tipoDeEnvio.Piso}
                            </li>
                            <li>
                                CP: ${datos.tipoDeEnvio.CP} DNI: ${datos.tipoDeEnvio.DNI}
                            </li>
                            <li>
                                COSTO: ${datos.tipoDeEnvio.Costo}
                            </li>                            
                        </ul></h3>
                        <h3>FORMA DE CONTACTO: ${datos.formaDeContacto.contacto} ${datos.formaDeContacto.numero}</h3>
                        <h3>FACTURACION: ${datos.facturacion.tipo} RazonSocial: ${datos.facturacion.RazonSocial} CUIT: ${datos.facturacion.CUIT}</h3>
                        <h1> COMPRA</h1>  
                        <hr>
                        <thead>
               <tr>
                   <th>codigo</th>
                   <th>titulo</th>
                   <th>cantidad</th>
                   <th>precio unitario</th>                   
               </tr>
              </thead>
              <tbody class="resumen-check-out">
              ${compra}
              </tbody>
              <tfoot >
                <tr class="total-compra-final">
                    TOTAL DEL PEDIDO: ${data.sys.totalCompra.toFixed(2)}                    
                </tr>
                <tr class="total-compra-final">
                    TOTAL DEL PEDIDO + ENVIO: ${costo_envios.toFixed(2)}
                </tr>
          </tfoot>
                        
                `
            }
    }    

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
            return err
        }
        console.log("[ MAIL ENVIADO EXITOSAMENTE ]")
    })

}

//rutas de respuesta mercadopago
app.get("/success", (req, res) => {
    res.sendFile("./public/check-out-success.html", {root: __dirname })
})
app.get("/failure", (req, res) => {
    res.sendFile("./public/check-out-failure.html", {root: __dirname })
})
app.get("/pending", (req, res) => {
    res.sendFile("./public/check-out-pending.html", {root: __dirname })
})

const port = process.env.PORT || 8080

if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
    config.baseURL = `http://localhost:${port}`;
}

http.listen(port, () => {
    console.log(`servidor escuchando en http://localhost:${port}`);
    //carga las categorias nuevas al inicio
    loadCategs()
});
//en caso de memory leaks por el emmiter
process.on('warning', e => console.warn(e.stack));
// en caso de error, avisar
http.on('error', error => {
    console.log('error en el servidor:', error);
});







