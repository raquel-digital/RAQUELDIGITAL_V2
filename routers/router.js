const express = require('express');
const router = express.Router();
var path = require('path');
const requer = require("../utils/config");
//const middleware = require("../utils/middleware");
const controller = require("../api/arts/controller")
const { requiresAuth } = require('express-openid-connect');
const middleware =  require("../utils/middleware")



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
  const userAgent = req.headers['user-agent'];
  // Verificar si la cadena del agente de usuario contiene "iPhone"
  const esIPhone = userAgent.includes('iPhone');
  
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
  //res.sendFile(path.resolve("./public/categ.html"))
  //EJS pero carga desde JS
  //TODO descomentar codigo en INDEX
  res.render('index', {
    categRes: true, 
    faq: false,
    iphone: esIPhone,
    login: req.oidc.isAuthenticated() ? true : false,    
  });  
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
  const userAgent = req.headers['user-agent'];
  // Verificar si la cadena del agente de usuario contiene "iPhone"
  const esIPhone = userAgent.includes('iPhone');

  let io = require('../io.js').get();  
  io.once('connect', socket => {
    (async () => {      
        const buscar = req.query.buscar.toLocaleLowerCase(); 
        if(req.query.buscar.length == 0){
          socket.emit("resultado-vacio");
          return
        }
        const result = await controller.buscarArticulo(buscar); 
        const data = { result: result, query: buscar}       
        socket.emit("resultado-busqueda", data);
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
  const userAgent = req.headers['user-agent'];
  // Verificar si la cadena del agente de usuario contiene "iPhone"
  const esIPhone = userAgent.includes('iPhone');

  res.render('index', { faq: true, iphone: esIPhone, categRes: false, data: " ", login: false });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  //DETECTAR IPHONE
  const userAgent = req.headers['user-agent'];
  // Verificar si la cadena del agente de usuario contiene "iPhone"
  const esIPhone = userAgent.includes('iPhone');

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

  //Cheque precios
  delete require.cache[require.resolve("../public/system/dir/allArts.json")];
  const actuPrecios = require("../public/system/dir/allArts.json");
  // Recorre cada elemento del carrito
  carritoAnterior.forEach(producto => {
      // Verifica si el código del producto está en el array de códigos y precios
      const index = actuPrecios.findIndex(item => item.codigo === producto.codigo);
      if (index !== -1) {
          const precio = actuPrecios[index].precio.replace(",", ".")                
          if(producto.precio != precio){              
              producto.precio = precio;
          }                
      }
  })

  res.render("checkOut", { iphone: esIPhone, carrito: carritoAnterior })
})

//CHECK OUT MERCADOPAGO
const mercadopago =  require("mercadopago")
mercadopago.configure({
    access_token: requer.capDb
});

router.post("/mercadopago", (req, res) => {
  
  let preference = {
    items: [
      {
        title:req.body.titulo,
        unit_price: parseInt(req.body.precio),
        quantity: 1,
      }
    ],
    // ...
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
  
  return esIPhone
}

module.exports = router ;