const socket = io.connect();
//const socket = io("ws://localhost:8080", {forceNew: true});
let mostrador =  document.querySelector(".mostrador");
const paginador = document.querySelector(".paginador");
const artOcultos = document.querySelector("#art-ocultos");
const faltaStock = document.querySelector("#falta-stock");
const barraHerramientas =  document.querySelector("#barra-herramientas");

let productosAdmin = undefined;
let categoriasAdmin = undefined;
let mostradorDeArticulos = [];
const indice = 50;//cantidad de items a mostrar
let mailContent;
const toDel = [];
let busqueda = false;

const productosModificados = document.querySelector(".productos-modificados");

socket.on("admin-sock", data => {
  console.log(data)
})

socket.on("prodAdmin", data => {
  productosAdmin = data;  
})

function confirmarCambios(){
  console.log(toDel)
  if(toDel.length > 0){
    socket.emit("delete", toDel);
  }
  socket.emit("cambio-en-articulos", cambiosEnArticulos)
}

socket.emit("changes?");

socket.on("result-actu", result => {
  console.log(cambiosEnArticulos)
  //formulario.value = result.codigo;
  buscador();
  alert("ARTICULOS ACTUALIZADOS");
  cambiosEnArticulos = []
})

socket.on("categorias", categ => {
  categoriasAdmin = categ;
  console.log(categoriasAdmin)
})

socket.on("start", data => {
  productosAdmin = data;
  
    //if(productosAdmin != undefined){
      // let mostrador = []
      // let prodSlice; 

      // //categorias.forEach(e => {
      //   prodSlice = productos["AB"].slice(0,20);
      //   prodSlice.forEach(e => {
      //     mostrador.push(e)
      //   })
        
      // //})

      // showArts(mostrador);
      console.log(productosAdmin)
    //}
})

socket.on("categ-result", arts => {
  
  if(arts.succes){
    if(arts.result.length > indice){
      
      mostradorDeArticulos = arts.result;
      
      if(mostradorDeArticulos.length > indice){        
        crearPaginador(mostradorDeArticulos);
        asignadorPaginador(1, mostradorDeArticulos);
      }
      else{ 
        showArts(mostradorDeArticulos);
      }
    }else{
      showArts(arts.result);
    }
  }else{
    alert(arts.result)
  }

});

function showArts(art){

    mostrador.innerHTML = ""; 

    art.forEach(p => {
      if(faltaStock.checked){               
        if(p.stock < 0){
         mostrador.innerHTML += `
         <div class="cardItem col-4">
         <hr><div class="card border-success">
         <img src="/img/${p.categorias}/${p.imagendetalle}">
           <div class="card-body">
             <h5 class="card-title">${p.nombre}</h5>
             <h6 class="card-subtitle text-muted mb-2">CODIGO: ${p.codigo}</h6>
             <div class="row">
             <div class="col">
             <p>IMAGEN:</p><input value="${p.imagendetalle}">
             <p>CATEG:</p><input value="${p.categorias}">
             <p>TAGS:</p>
             <input type="text" class="input${p.codigo}">
             <a href="#${p.codigo}colapse" data-bs-toggle="collapse" class=" float-left dropdown-toggle btn-outline-info btn-sm bg-info" style="color: white;">Descripcion</a>
             </div>
             </div>
               <div class="collapse" id="${p.codigo}colapse">
                 <hr>
                 <input value="${p.descripcion}">
                 <input value="${p.stock}">
                 <button class="btn btn-danger borrarArticulo" value=${p.codigo}>BORRAR</button>
               </div>
               </div>
               <div class="card-footer row">
                 <div class="precio">
                   <p>Precio: $ ${parseInt(p.precio)}</p> 
                 </div>
                 MOSTRAR               
                 <label class="switch">
                   <input type="checkbox" class="check${p.codigo}">
                   <span class="slider round"></span>
                 </label>              
               </div>
               <button class="botonConfirmar btn btn-primary" value=${p.codigo}>CONFIRMAR</button>
           </div>
         </div>
         `
        }        
       }
      else if(artOcultos.checked){        
       if(p.mostrar == false){
        mostrador.innerHTML += `
        <div class="cardItem col-4">
        <hr><div class="card border-success">
        <img src="/img/${p.categorias}/${p.imagendetalle}">
          <div class="card-body">
            <h5 class="card-title">${p.nombre}</h5>
            <h6 class="card-subtitle text-muted mb-2">CODIGO: ${p.codigo}</h6>
            <div class="row">
            <div class="col">
            <p>IMAGEN:</p><input value="${p.imagendetalle}">
            <p>CATEG:</p><input value="${p.categorias}">
            <p>TAGS:</p>
            <input type="text" class="input${p.codigo}">
            <a href="#${p.codigo}colapse" data-bs-toggle="collapse" class=" float-left dropdown-toggle btn-outline-info btn-sm bg-info" style="color: white;">Descripcion</a>
            </div>
            </div>
              <div class="collapse" id="${p.codigo}colapse">
                <hr>
                <input value="${p.descripcion}">
                <input value="${p.stock}">
                <button class="btn btn-danger borrarArticulo" value=${p.codigo}>BORRAR</button>
              </div>
              </div>
              <div class="card-footer row">
                <div class="precio">
                  <p>Precio: $ ${parseInt(p.precio)}</p> 
                </div>
                MOSTRAR               
                <label class="switch">
                  <input type="checkbox" class="check${p.codigo}">
                  <span class="slider round"></span>
                </label>              
              </div>
              <button class="botonConfirmar btn btn-primary" value=${p.codigo}>CONFIRMAR</button>
          </div>
        </div>
        `
       }        
      }else{
        mostrador.innerHTML += `
      <div class="cardItem col-4">
      <hr><div class="card border-success">
      <img src="/img/${p.categorias}/${p.imagendetalle}">
        <div class="card-body">
          <h5 class="card-title">${p.nombre}</h5>
          <h6 class="card-subtitle text-muted mb-2">CODIGO: ${p.codigo}</h6>
          <div class="row">
          <div class="col">
          <p>IMAGEN:</p><input value="${p.imagendetalle}">
          <p>CATEG:</p><input value="${p.categorias}">
          <p>TAGS:</p>
          <input type="text" class="input${p.codigo}">
          <a href="#${p.codigo}colapse" data-bs-toggle="collapse" class=" float-left dropdown-toggle btn-outline-info btn-sm bg-info" style="color: white;">Descripcion</a>
          </div>
          </div>
            <div class="collapse" id="${p.codigo}colapse">
              <hr>
              <input value="${p.descripcion}">
              <input value="${p.stock}">
              <input value="${p.codigo}">
              <button class="btn btn-danger borrarArticulo" value=${p.codigo}>BORRAR</button>
            </div>
            </div>
            <div class="card-footer row">
              <div class="precio">
                <p>Precio: $ ${parseInt(p.precio)}</p> 
              </div>
              MOSTRAR               
              <label class="switch">
                <input type="checkbox" class="check${p.codigo}">
                <span class="slider round"></span>
              </label>              
            </div>
            <button class="botonConfirmar btn btn-primary" value=${p.codigo}>CONFIRMAR</button>
        </div>
      </div>
      `     
      }
    });

    checkMostrar(art);
}

function checkMostrar(art){
    console.log(art)
    
        art.forEach(e => {  
            let check = document.querySelector(".check"+e.codigo);
            let input = document.querySelector(".input"+e.codigo);
           
            if(check != null){
              check.checked = e.mostrar;              
            }
            if(input != null){
                input.value = e.tags;                 
            }
            //carta colores
            if(e.colores.length > 0){
              cartaColoresShow(e)
            }
        }) 
    
    
}   




//-----------BUSCADOR-----------------
const formulario = document.querySelector("#buscador");
const boton = document.querySelector("#boton");
var resultado = document.querySelector("#mostrador");

const buscador = ()=>{
  mostrador.innerHTML = "";
  paginador.innerHTML = "";

  const query = formulario.value.toLowerCase();
    if(query == "") return;
    mostrador.innerHTML = `<div style="width:100%;height:0;padding-bottom:130%;position:relative;margin-left:60%;"><img src="/img/loading.gif" alt=""> </div>`
  socket.emit("busqueda-admin", query)  
}

formulario.addEventListener("keydown", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {                
    buscador();            
  }
})
boton.addEventListener('click', buscador);

socket.on("loading-search", () => {  
  busqueda = true;
})

socket.on("resultado-busqueda", result => {
  console.log(result)   
  busqueda = false;
    
    if(result.length > 0) {
      if(result.length > indice){        
        mostradorDeArticulos = result//mostrarRes;
        paginador.innerHTML = "";        
        crearPaginador(mostradorDeArticulos);
        asignadorPaginador(1, mostradorDeArticulos);
      }else{
        showArts(result);
      }
    }else{
      mostrador.innerHTML = `<h2>No se encuentran resultados</h2>`
    }

})



//--------Paginador
let previosSelected = undefined;
function asignadorPaginador(i){
  
  if(previosSelected != undefined){
    document.querySelector(previosSelected).parentElement.classList.remove("paginadorSelected");
  }
  document.querySelector(".links"+i).parentElement.classList.add("paginadorSelected");

  previosSelected = ".links"+i;
  let arrayIndiceMap = [];

  const int50 = (i * indice) - indice;
  const indice50 = i * indice;
  //console.log("antes",mostradorDeArticulos)
  arrayIndiceMap = mostradorDeArticulos.slice(int50, indice50); 
  
  showArts(arrayIndiceMap);

}

function crearPaginador(){    
  
  let i = mostradorDeArticulos.length / indice;
  
   paginador.innerHTML =  `
       
      <div class="numPag"></div>
    
      `
      j = 1;
      
      while(i > 0){
          
          paginadorNum = document.querySelector(".numPag")
          paginadorNum.innerHTML +=  `
          <li class="page-items"><a onclick="asignadorPaginador(${j})" class="page-links links${j}" href="#">${j}</a></li>
          `

          if(j==30){
            paginadorNum.innerHTML +=  `<div class="lineBreak"></div>`//document.querySelector(".links"+j).parentElement.classList.add("lineBreak");
          }
          j++;
          
          i--;
      }
}

paginador.addEventListener("click", e => {
  console.log(e.target.parentElement.parentElement)
})

mostrador.addEventListener("click", e => {
    const mouse = e.target;
    if(mouse.classList.contains("botonConfirmar")){
      mouse.classList.remove("btn-primary");
      mouse.classList.add("btn-warning");

      let codigo = mouse.value;     

      const mostrar = mouse.previousElementSibling.childNodes[3].childNodes[1].checked;
      const tags = mouse.parentElement.childNodes[3].childNodes[5].childNodes[1].childNodes[9].value;
      const img = mouse.parentElement.childNodes[3].childNodes[5].childNodes[1].childNodes[2].value;
      const decr = mouse.parentElement.childNodes[3].childNodes[7].childNodes[3].value;
      const stock = mouse.parentElement.childNodes[3].childNodes[7].childNodes[5].value;
      const categ = mouse.parentElement.childNodes[3].childNodes[5].childNodes[1].childNodes[5].value;
      const cambioCodigo = mouse.parentElement.childNodes[3].childNodes[7].childNodes[7].value;
      
      let artChange;

      if(codigo.includes("*")){
        const split = codigo.split("*");
        artChange = {_id: split[1], codigo: split[0], mostrar: mostrar, tags: tags, imagendetalle: img, descripcion: decr, categorias: categ, stock: stock, cambioCodigo: cambioCodigo};
      }else{
        artChange = { codigo: codigo, mostrar: mostrar, tags: tags, imagendetalle: img, descripcion: decr, categorias: categ, stock: stock, cambioCodigo: cambioCodigo};
      }
      
      cambiosArt(artChange);
      
    } 
    if(mouse.classList.contains("borrarArticulo")){
      mouse.classList.add("toDel");
      toDel.push({codigo: mouse.value});
    }
    if(mouse.classList.contains("eliminar-articulo")){
      console.log(mouse.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent)
      const codigo = mouse.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
      for(i=0;i<pedido.length;i++){
        
        if(pedido[i].codigo === codigo){
          pedido.splice(i, 1)
        }
      } 
      
      drawOrder(pedido)
    }
    
})

let cambiosEnArticulos = []

function cambiosArt(art){
    let match = false;
    
    cambiosEnArticulos.forEach(e => {
        if(!art._id){
          if(e.codigo == art.codigo){
            e.mostrar = art.mostrar;
            e.tags = art.tags
            match = true;            
          }  
        }
    })
    if(!match){
        cambiosEnArticulos.push(art)        
    }else{
        return;
    }
    console.log(cambiosEnArticulos);
    //productosModificados.value = cambiosEnArticulos;
    
}



let imagenes;
let selectHTML = [];

socket.on("admin-images", img => {

   imagenes = img;
   img.forEach(e => {
    const inner_html = `<option value="${e.codigo}">${e.codigo}</option>` 
    selectHTML.push(inner_html);
   })
   
})

function newImg(codigo){
  imagenes.forEach(img => {
    if(codigo == img.codigo){
      categoriasAdmin.forEach(categ => {
        productosAdmin[categ].forEach(art => {
          if(art.codigo == img.codigo){
            art.imagendetalle = img.imagen;
          }
        })
      })
    }
  })
}


function actuPrecios(){
 console.log("ENVIANDO PRECIOS")
 const actu = document.querySelector(".actuPrecios");
 const split = actu.value.split(" "); 
 const preJson = [];
 split.map(e => {
  const split = e.split("\t")
  if(split[0] == " " || split[1] == " " || split[0] == undefined || split[1] == undefined || split[1] <= 0){    
    alert("HAY ERRORES EN ARTICULO " + {Codigo: split[0], Precio: split[1]});
    console.log({Codigo: split[0], Precio: split[1]})
  }else{
    const precios = {Codigo: split[0], Precio: split[1]}
    preJson.push(precios);
  }
  
 }); 
 mostrador.innerHTML = `<h1>Actualizando precios esto lleva tiempo</h1>`
 socket.emit("actuPrecios", preJson);
 
}

socket.on("actuPreciosRes", result => {
  if(result){
    console.log(result)
    mostrador.innerHTML = `<ul class="result"></ul>`
    const res = document.querySelector(".result");
   // if(result.length < 100){
      result.forEach(e => {
        if(e.baja){
          res.innerHTML += `<li style="color:red;">CODIGO: ${e.codigo} PRECIO EN BAJA: ${e.precio} PRECIO ANTERIOR: ${e.precioViejo}</li>`
        }else{        
          res.innerHTML += `<li>CODIGO: ${e.codigo} NUEVO PRECIO: ${e.precio}</li>`
        }
      })
    // }
    //else{
    //   result.forEach(e => {
    //     res.innerHTML += `<li>RESULTADO MUY EXTENSO SOLO SE MUESTRAN LAS BAJAS</li>`
    //     if(e.baja){
    //       res.innerHTML += `<li style="color:red;">CODIGO: ${e.codigo} PRECIO EN BAJA: ${e.precio} PRECIO ANTERIOR: ${e.precioViejo}</li>`
    //     }
    //   })
    // }
    alert("PRECIOS ACTUALIZADOS")
  }else{
    alert("ERROR AL ACTUALIZAR PRECIOS")
  }
});

barraHerramientas.addEventListener("click", e => {
  const mouse = e.target;
  if(barraHerramientas.selectedIndex > 0){    
    if(barraHerramientas.selectedIndex == 1){      
      mostrador.innerHTML = `
      <input type="text" class="actuPrecios" style="width:100%;height:100px" placeholder="ingresar codigo y precio"  >
      <button type="button" class="btn btn-danger" onclick="actuPrecios()">enviar</button>
      `        
    }
    if(barraHerramientas.selectedIndex == 2){
      mostrador.innerHTML = `<div class="display"><button type="button" class="btn btn-success" onclick=start()>START</button><button type="button" class="btn btn-danger" onclick=stop()>STOP</button> </div>`
      start();
      checkOrders();   
    }
    if(barraHerramientas.selectedIndex == 3){      
      mostrador.innerHTML = `
      <textarea name="upData" cols="9" wrap="off" class="uploadArts" placeholder="Subir Articulos"></textarea>
      <button type="button" class="btn btn-success" onclick="uploadArts()">enviar</button>
      `        
    }
    if(barraHerramientas.selectedIndex == 4){      
      window.location = "https://raqueldigital.herokuapp.com/admin/pedidos"      
    }
    if(barraHerramientas.selectedIndex == 5){      
      window.location = "https://raqueldigital.herokuapp.com/admin/pedidos/local"      
    }
  }  
})

let upload = []

function uploadArts(){
  const row = document.querySelector(".uploadArts").value.split("\n");
 
  for(let i in row){
      const cell = row[i].split("\t")
      if(cell[0] == "codigo" && cell[1] == "colores") {
        //modo colores       
        ingresarColores(row);
        return;
      }
      if(cell[0] != "" && cell[0] != undefined && cell[0] != null){
        const categSplit = cell[0].split("");
        const categ = categSplit[0]+categSplit[1];
        
        const art = {
          codigo: cell[0],          
          nombre: cell[2],
          nombre2: cell[3],
          CantidadDeVenta: cell[4],          
          precio: cell[6],
          descripcion: cell[7],
          tags: cell[8]          
        }
        const mostrar = cell[9]
        if(mostrar != undefined){
          art.mostrar = mostrar;
        }
        if(cell[1] == undefined  || cell[1] == ""){          
          art.categorias = categ;
        }else{
          art.categorias = cell[1];
        }
        if(cell[5] == undefined  || cell[5] == ""){          
          art.imagendetalle = art.codigo + ".jpg";
        }else{
          art.imagendetalle = cell[5];
        }
        upload.push(art)
        console.log(art)
      }      
    }
          
    socket.emit("busqueda-admin", upload);
  }
  socket.on("res-busqueda-upload", result => {
    console.log(result)
    if(result.length > 0){      
      for(let r of result){
        for(let u of upload){
          const split = u.codigo.split("-")
          const codigo = split[0]
          let match = false;//si no hay coincidencia invertir la busqueda
          if(r.codigo.includes(codigo)){
            u.nombre = r.nombre
            u.nombre2 = r.nombre2
            u.CantidadDeVenta = r.CantidadDeVenta     
            u.precio = r.precio
            u.descripcion = r.descripcion
            u.tags = r.tags
            match = true
          }
          if(!match){
            if(codigo.includes(r.codigo)){
              u.nombre = r.nombre
              u.nombre2 = r.nombre2
              u.CantidadDeVenta = r.CantidadDeVenta     
              u.precio = r.precio
              u.descripcion = r.descripcion
              u.tags = r.tags
              match = true
            }
          }
        }
      }
      preview(upload);
    }else{
      preview(upload);
    }
  });

  function ingresarColores(row){
    const colores = []
    row.shift()
    console.log(row)
    for(let i in row){
      const cell = row[i].split("\t"); 
      
      const art = {
        codigo: cell[0],
        color: cell[1],
        stock: 10,
        mostrar: true
      }
      
      if(art.codigo != " " && art.codigo != undefined && art.color != " " && art.color != undefined){
       colores.push(art);
      }
    }
    
    socket.emit("upload-colors", colores);
  }

  socket.on("upload-colors-res", res => {
    console.log(res);
    if(res){
      alert("COLORES SUBIDOS EXITOSAMENTE")
    }else{
      alert("ERROR INTENTE NUEVAMENTE")
    }
  });

  function preview(art){
    mostrador.innerHTML = "";
    art.forEach(p => {
      mostrador.innerHTML += `
      <div class="cardItem col-4">
      <hr><div class="card border-success">
        <img src="/img/${p.categorias}/${p.imagendetalle}">
        <div class="card-body">
          <h5 class="card-title">${p.nombre}</h5>
          <h6 class="card-subtitle text-muted mb-2">${p.nombre2}</h6>
          <div class="row">
          <div class="col">
          <a href="#${p.codigo}colapse" data-bs-toggle="collapse" class=" float-left dropdown-toggle btn-outline-info btn-sm bg-info" style="color: white;">Descripcion</a>
          <label>Cantidad</label>
          <input class="" id="${p.codigo}" size="1" value="1" class="">
          <span>        
          <i class=" fas fa-plus-circle" aria-hidden="true"></i><i class=" fas fa-minus-circle" aria-hidden="true"></i>        
          </span>
          </div>
          </div>
            <div class="collapse" id="${p.codigo}colapse">
              <hr>
              <p>${p.descripcion}</p><p>Codigo: ${p.codigo}</p><p>Unidad de venta: ${p.CantidadDeVenta}</p>

            </div>
            </div>
            <div class="card-footer row">
              <div class="precio">
                <p>Precio: $ ${p.precio} <br>${p.CantidadDeVenta}</p> 
              </div>               
              <button class="botonComprar col-4 btn btn-primary" value="${p.precio}">COMPRAR</button> 
            </div>
        </div>
      </div>
      `});

      mostrador.innerHTML += `<button class="btn btn-success" onclick="enviarArticulosNuevos()">CONFIRMAR</button><hr><hr><hr><hr><button class="btn btn-danger" onclick="vaciarUpload()">CANCELAR</button>`
    }      
    
  function enviarArticulosNuevos(){
    console.log(upload)
    socket.emit("nuevos-articulos", upload) 
  }

  socket.on("nuevos-articulos-res", result => {
    console.log(result)
    if(result.state){
      alert("NUEVOS ARTICULOS SUBIDOS, HAY " + result.count + " NUEVOS");
      vaciarUpload()
      mostrador.innerHTML = "";           
    }else{
      alert("SUBIDA FALLIDA " + "en articulo" + result.message + " INTENTE NUEVAMENTE");
      preview(upload);
    }
  });

 function vaciarUpload(){
  while(upload.length > 0){
    upload.pop();
  }
  mostrador.innerHTML = "";
 }
  

let intervalID;
let lastOrder;

function start(){
  intervalID = setInterval(checkOrders, 300000);
}

function stop(){
  clearInterval(intervalID);
  mostrador.innerHTML = ` `;
}

function checkOrders(){
  socket.emit("chequear-pedidos");
}

socket.on("nuevos-pedidos", data => {
  if(lastOrder == undefined){    
    lastOrder = data[0];
  }
  if(lastOrder.numero_orden != data[0].numero_orden){
    alert("PEDIDO NUEVO!!!");
  }
  const display = document.querySelector(".display")
  if(display == null){
    stop();
    return;
  }
  display.innerHTML += `<ul class="pedidosNuevos"></ul>`;  
  const pedidos = document.querySelector(".pedidosNuevos")
  pedidos.innerHTML = ` `;
  data.forEach(d => {    
    pedidos.innerHTML += `<li>${d.numero_orden} ${d.nombreApellido} ${d.fecha}</li>`
  })
  lastOrder = data[0];
});

function buscarPedido(){
  const num_orden = document.querySelector("#num_orden").value
  socket.emit("busqueda-pedido", num_orden);
}

let pedido;
let dataMail
socket.on("busqueda-pedido-reponse", res => {
  console.log("[ RESPUESTA PEDIDO ] : ", res);
  pedido = res[0].compra;
  if(res.length == 0){
    alert("PEDIDO INVALIDAO");
    return;
  } 
  dataMail = res[0];
  drawOrder(pedido, res[0])   
})

function drawOrder(pedido, cliente){
  let envio = " "
  if(cliente.tipoDeEnvio){
    envio = `<div class="row"><b>Tipo de envío: ${cliente.retira} Forma de envío: ${cliente.tipoDeEnvio.forma_de_envio}</b></div>
    <div class="row"><b>Calle: ${cliente.tipoDeEnvio.Calle} Altura: ${cliente.tipoDeEnvio.Altura} Horario de entrega: ${cliente.tipoDeEnvio.Horario_Entrega}</b></div>
    <div class="row"><b>Localidad: ${cliente.tipoDeEnvio.Localidad} Provincia: ${cliente.tipoDeEnvio.Provincia}</b></div>
    <div class="row"><b>CP: ${cliente.tipoDeEnvio.CP} Costo Envío: ${cliente.tipoDeEnvio.Costo}</b></div>` 
  }else{
    envio = `<div class="row"><b>Tipo de envío: ${cliente.retira}</b></div>`
  }
  
  mostrador.innerHTML = `
  <div class="tablaImprimir justify-content-center">
  <div class="row"><b>N° de orden: ${cliente.numero_orden}</b></div>
  <div class="row"><b>Fecha: ${cliente.fecha}</b></div>
  <div class="row"><b>Cliente: ${cliente.nombreApellido}</b></div>
  ${envio}
  <div class="row"><b>Forma de pago: ${cliente.formaDePago}</b></div>
  <div class="row"><b>Facturacion: ${cliente.facturacion.tipo} Razon Social: ${cliente.facturacion.RazonSocial} CUIT: ${cliente.facturacion.CUIT}</b></div>
  <div class="row"><b>Forma de contacto: ${cliente.formaDeContacto.contacto} ${cliente.formaDeContacto.numero}</b></div>
  </div>
  <table class="table table-bordered table-hover tablaOrden">
  <thead>
     <tr>
         <th>foto</th>
         <th>codigo</th>
         <th>titulo</th>
         <th>precio unitario</th>
         <th>cantidad</th>
         <th>total</th>
     </tr>
    </thead>
    <tbody class="resumen-check-out">
      
    </tbody>
    <tfoot >
      <tr class="total-compra-final">
        
      </tr>
      </tfoot>
  </table>
  </div> 
   
  <button class="botonOrden" onclick="printPage()">IMPRIMIR</button>
  <hr> 
  <hr>
  <hr>
  <button class="botonOrden" onclick="sendDataMail(dataMail)">ENVIAR X MAIL</button>
  `
  //
  const resumenCheckOut = document.querySelector(".resumen-check-out")
  pedido.forEach(e => {
    resumenCheckOut.innerHTML += `
    <td><img src="${e.imagen}" alt="imagen table" widht="60px" height="60px"></td>
    <td>${e.codigo}</td>
    <td>${e.titulo}<td>
    <td>${e.precio}</td>
    <td>${e.cantidad}</td>
    <td>${e.cantidad * e.precio}</td>
    <td>en stock: </td>
    <td>falta: </td>
    `;
  })
}

function printPage(){
  window.print()
}



function sendDataMail(dataMail){
  console.log("enviando... ", dataMail)  
  dataMail.sys = {}
  dataMail.sys.compra = dataMail.compra
  socket.emit("mail", dataMail)
  alert("MAIL ENVIADO");
}

function cartaColoresShow(art){
  art.colores.forEach(p => {
    mostrador.innerHTML += `
         <div class="cardItem col-4">
         <hr><div class="card border-success">
         <img src="/img/${art.categorias}/${p.color}">
           <div class="card-body">
             <h5 class="card-title">${art.nombre}</h5>
             <h6 class="card-subtitle text-muted mb-2">CODIGO: ${p.codigo}</h6>
             <div class="row">
             <div class="col">
             <p>IMAGEN:</p><input value="${p.color}">
             <p>CATEG:</p><input value="${art.categorias}">
             <p>TAGS:</p>
             <input type="text" class="input${p.codigo}">
             <a href="#${p.codigo}colapse" data-bs-toggle="collapse" class=" float-left dropdown-toggle btn-outline-info btn-sm bg-info" style="color: white;">Descripcion</a>
             </div>
             </div>
               <div class="collapse" id="${p.codigo}colapse">
                 <hr>
                 <input value="${art.descripcion}">
                 <input value="${p.stock}">
                 <button class="btn btn-danger borrarArticulo" value=${p.codigo}>BORRAR</button>
               </div>
               </div>
               <div class="card-footer row">
                 <div class="precio">
                   <p>Precio: $ ${parseInt(art.precio)}</p> 
                 </div>
                 MOSTRAR               
                 <label class="switch">
                   <input type="checkbox" class="check${p.codigo}">
                   <span class="slider round"></span>
                 </label>              
               </div>
               <button class="botonConfirmar btn btn-primary" value=${art.codigo}*${p._id}>CONFIRMAR</button>
           </div>
         </div>
         `
         
        
  })   
  let check = document.querySelector(".check"+art.codigo);
  let input = document.querySelector(".input"+art.codigo);

  check.checked = art.mostrar;
  input.value = art.tags 
   
  art.colores.forEach(p => {
      let check = document.querySelector(".check"+p.codigo);
      let input = document.querySelector(".input"+p.codigo);

      check.checked = p.mostrar;
      input.value = art.tags
  })
}



