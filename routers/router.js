const express = require('express');
const router = express.Router();
var path = require('path');
const requer = require("../utils/config");
//const middleware = require("../utils/middleware");
const controller = require("../api/arts/controller")
const { requiresAuth } = require('express-openid-connect');
const middleware =  require("../utils/middleware")


router.get("/presupuestos", (req,res) => {
  res.sendFile(path.resolve("./public/presupuestos.html"))
})
//ENTRANDO A "/login y /logout" te logueas y deslogueas
router.get("/", (req,res) => {

  //DETECTAR IPHONE O SAFARI
  const esIPhone = verAgente(req)
  const login = req.oidc.isAuthenticated() ? true : false
  let pedidos = 0
  
  if(login){ 
      (async () => {       
          const controller = require("../api/auth/controller")
          pedidos = await controller.leer(req.oidc.user)
          
          res.render('index', {
              categRes: false,
              data: " ",
              faq: false,
              iphone: esIPhone,
              login: {
                  isLog: login,
                  pedidos: pedidos
              }
            });
      })()        
  }else{
      res.render('index', {
          categRes: false,
          data: " ",
          faq: false,
          iphone: esIPhone,
          login: {
              isLog: login,
              pedidos: pedidos
          }
        });
  }
})

//ver el profile con la informacion del logueado
router.get('/profile', requiresAuth(), (req, res) => {
  const profile = JSON.stringify(req.oidc.user)
  const data = {user: profile}
  res.send(data);
});

//-----CATEGS-----------
router.get("/categoria/", async (req, res) => {  
  //DETECTAR IPHONE
  //const userAgent = req.headers['user-agent'];
  const login = req.oidc.isAuthenticated() ? true : false
  // Verificar si la cadena del agente de usuario contiene "iPhone"
  const esIPhone = verAgente(req)//anterior userAgent.includes('iPhone');
  
  const categOrganicer =  require("../utils/cargarCategoria"); 

  const categIO = req.query.categ
  const categ = req.query.categ.toLowerCase()
  const tagCheck = req.query.tag
  
  let io = require('../io.js').get();  
  io.once('connect', socket => {    
    (async () => {
        socket.emit("loading")
        let result = await categOrganicer(categ);        
        result.categ = categIO
        socket.emit("categ-result", result);
        if(tagCheck){ 
          const tag = tagCheck.replace(" ", "-")//%20   
          const tagEmit = tag.toLowerCase();            
          socket.emit("tag-result", tagEmit); 
        }
    })();
  })   
  if(login){ 
    (async () => {       
        const controller = require("../api/auth/controller")
        pedidos = await controller.leer(req.oidc.user)
        
        res.render('index', {
            categRes: true,
            data: " ",
            faq: false,
            iphone: esIPhone,
            login: {
                isLog: login,
                pedidos: pedidos
            }
          });
    })()        
}else{
    res.render('index', {
      categRes: true, 
      faq: false,
      iphone: esIPhone,
      login: req.oidc.isAuthenticated() ? true : false,    
    });  
  }
})

//Generador de pedidos a mano
router.get('/generar-pedidos', (req, res) => {

  const esIPhone = verAgente(req)

  res.render('index', {
    categRes: false,
    data: "pedidos",
    faq: false,
    iphone: esIPhone,
    login: req.oidc.isAuthenticated() ? true : false
  });
});

//-----BUSCADOR-----
router.get("/buscador", (req, res) => {
  //DETECTAR IPHONE  
  const esIPhone = verAgente(req)

  let io = require('../io.js').get();  
  io.once('connect', socket => {
    (async () => {      
        const buscar = req.query.buscar.toLocaleLowerCase()
        
        if(req.query.buscar.length == 0){
          socket.emit("resultado-vacio");
          return
        }
        const result = await controller.buscarArticulo(buscar) 
        if(result.length == 0){
          const sinTilde = buscar.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
          const result = await controller.buscarArticulo(sinTilde)
          const data = { result: result, query: buscar}       
          socket.emit("resultado-busqueda", data);
          return
        }
        const data = { result: result, query: buscar}       
        socket.emit("resultado-busqueda", data);
        return
    })();
  })   
  res.render('index', {
    categRes: true, 
    faq: false, 
    iphone: esIPhone,
    login: req.oidc.isAuthenticated() ? true : false,    
  });  
})



router.get('/preguntas-frecuentes', function (req, res, next) {
  //DETECTAR IPHONE
  //const userAgent = req.headers['user-agent'];
  // Verificar si la cadena del agente de usuario contiene "iPhone"
  const esIPhone = verAgente(req)//anterior userAgent.includes('iPhone');

  res.render('index', { faq: true, iphone: esIPhone, categRes: false, data: " ", login: false });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  //DETECTAR IPHONE
  //const userAgent = req.headers['user-agent'];
  // Verificar si la cadena del agente de usuario contiene "iPhone"
  const esIPhone = verAgente(req)//anterior userAgent.includes('iPhone');

  res.render('profile', {
    iphone: esIPhone,
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});
//************ */


let adminPedidos = false
router.get("/admin", (req, res, next) => {
  const result = middleware.validAdmin(log)
    if(result === "permisos limitados"){
      res.sendFile(path.resolve("./public/index-admin2.html"))
      return
    }

    if(result == true){
      log = undefined; 
      adminPedidos = true     
      res.sendFile(path.resolve("./public/index-admin.html"))
    }else{
      res.redirect("/login-admin");
    }
})

router.get("/admin/pedidos", (req, res) => {
  
  res.sendFile(path.resolve("./public/index-admin-pedidos.html"))
  
})
router.get("/admin/pedidos/local", (req, res) => {
  res.sendFile(path.resolve("./public/index-adminPedidos-local.html"))
})

let log;

router.get("/login-admin", (req,res) => {
  res.sendFile(path.resolve("./public/login-admin.html"))
})




//----POST--------------

router.post("/valid-log", (req,res) => { 
  log = req.body;
  
  const check = middleware.validAdmin(log);
  if(check){
    res.redirect("/admin");
  }else{
    res.redirect("/login-admin");
  }
})

//Pagina de check out
router.post("/check-out", (req, res) => {
  //DETECTAR IPHONE
  const userAgent = req.headers['user-agent'];
  // Verificar si la cadena del agente de usuario contiene "iPhone"
  const esIPhone = userAgent.includes('iPhone');

  const carritoAnterior = JSON.parse(req.body.carrito_holder)
  //si el carrito es demasiado grande lo deribamos a la pagina especial
  if(carritoAnterior.length > 399) {
    console.log("INGRESANDO PEDIDO XL")
    const envioPedidoGrande = require("../api/users/controller.js")
    envioPedidoGrande.pedidosExtraGrandes(carritoAnterior)
     return res.render("pedidosXL")
  }

  delete require.cache[require.resolve("../public/system/dir/allArts.json")];
  const actuPrecios = require("../public/system/dir/allArts.json")

  

  const carritoFiltrado = carritoAnterior.filter(producto => {
   const split = producto.codigo.split("-")
   const codigo = split[0]  
   let index = actuPrecios.findIndex(item => item.codigo === codigo);
   if (index == -1) {
    index = actuPrecios.findIndex(item => item.codigo === producto.codigo);
   }
    
    if (index !== -1) {
        console.log("HAY", producto.codigo)
        const actualizado = actuPrecios[index];
        const precio = actualizado.precio.replace(",", ".");
        
        if (producto.precio != precio) {
            producto.precio = precio;
        }
        
        // Conservar solo si mostrar es estrictamente true
        return actualizado.mostrar
    }
      console.log("NO HAY", producto.codigo)
      // Si no está en actuPrecios, se va
      return false;  
  })
  
  
  //REDIRECCION POR IP
  // const miIP = "181.104.123.230"  
  // const ipCliente = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  // if (ipCliente.includes(miIP)) {
  //   return res.render("checkOutNuevo", {carrito: carritoFiltrado, iphone: esIPhone})
  // }

  //res.render("checkOutNuevo", {carrito: carritoFiltrado, iphone: esIPhone})
  res.render("checkOut", { iphone: esIPhone, carrito: carritoAnterior })
})

//CHECK OUT MERCADOPAGO
const mercadopago =  require("mercadopago")
mercadopago.configure({
    access_token: requer.capDb
});

router.post("/mercadopago", (req, res) => {
  //console.log("mercadopgao", req.body.precio)
  let preference = {
    items: [
      {
        title:req.body.titulo,
        unit_price: Number(req.body.precio),
        quantity: 1,
      }
    ],
    
"back_urls": {
  "success": "raqueldigital.herokuapp.com/success",
  "failure": "raqueldigital.herokuapp.com/failure",
  "pending": "raqueldigital.herokuapp.com/pending"
  },
    "auto_return": "approved",
// ...
  };
  mercadopago.preferences.create(preference)
  .then(function(response){    
    res.redirect(response.body.init_point);
  }).catch(function(error){
    console.log(error);
  });
});

//CHECK OUT transferencia y resto
router.post("/success-transferencia", (req, res) => {
  //DETECTAR IPHONE
  const userAgent = req.headers['user-agent'];
  // Verificar si la cadena del agente de usuario contiene "iPhone"
  const esIPhone = userAgent.includes('iPhone');

  const carrito = JSON.parse(req.body.carrito_holder)
  res.render("succesOrder", { iphone: esIPhone, carrito: carrito })
})

function verAgente(req){
  const userAgent = req.headers['user-agent'];  
  // Verificar si la cadena del agente de usuario contiene "iPhone"
  const esIPhone = userAgent.includes('iPhone') || userAgent.includes('Macintosh');
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isMac = /macintosh|mac os x/.test(userAgent);
  if(esIPhone || isIOS || isMac){    
    console.log("IOS ACTIVO")
    return true
  }else{
    console.log("OTRO DISPOSITIVO")
    return false
  }  
}

module.exports = router;