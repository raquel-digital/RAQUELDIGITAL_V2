const socket = io.connect();
const mostrador =  document.querySelector(".mostrador");
let pedidos;
let i = 1


const cambios = [];

const dia = new Date().getDate();
const mes = new Date().getMonth() + 1;
const anio = new Date().getFullYear();

mostrador.addEventListener("click", e => {

    const mouse = e.target;

    if(mouse.classList.contains("flecha-atraz")){
      if(i > 1){
        i--
        draw.pedidoFlecha(pedidos[i-1])
      }else{
        i = 1
        draw.pedidoFlecha(pedidos[i-1])
      }
    }
    if(mouse.classList.contains("flecha-adelante")){
      if(i < pedidos.length){
        i++
        draw.pedidoFlecha(pedidos[i-1])
      }
      if(i > pedido.length){
        i = pedido.length
        draw.pedidoFlecha(pedidos[i-1])
      }
    }

    if(mouse.classList.contains("eliminar-articulo")){
        const codigo = mouse.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        const order = mouse.lastChild.textContent;
        pedidos.forEach(e => {          
          if(e.num_orden == order){
             for(i=0; i<e.compra.length; i++){          
              if(e.compra[i].codigo === codigo){
                const falta = e.compra.splice(i, 1);
                e.faltas.push(falta[0]);
                draw.ordersList("list"+e.num_orden, e.compra)                
                draw.faltas("list-faltas"+e.num_orden, e.faltas)
              }
            }
            
          }
        })
      }
      if(mouse.classList.contains("eliminar-articulo-falta")){
        
        const codigo = mouse.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        const order = mouse.lastChild.textContent;
        pedidos.forEach(e => {          
          if(e.num_orden == order){
             for(i=0; i<e.faltas.length; i++){          
              if(e.faltas[i].codigo === codigo){
                const falta = e.faltas.splice(i, 1);
                e.compra.push(falta[0]);
                draw.ordersList("list"+e.num_orden, e.compra)                
                draw.faltas("list-faltas"+e.num_orden, e.faltas)
              }
            }
            
          }
        })
      }
      if(mouse.classList.contains("botonConfirmar")){
        mouse.classList.remove("btn-primary");
        mouse.classList.add("btn-warning");
      }  
})


function buscarPedido(orden){
    if(!orden){
      orden = document.getElementById("num_orden").value
    }    
    socket.emit("busqueda-pedido", orden);
}
  
let pedido;
let dataMail


socket.on("busqueda-pedido-reponse", res => {
  console.log("[ RESPUESTA PEDIDO ] : ", res.length);
  
  if(res.length == 0){
    alert("NO HAY RESULTADOS");
    return;
  } 
  dataMail = res;
  pedido = res[0].compra;
  if(res.length > 1){
    searchResultTable(res)  
  }else{    
    printPagePreview(null, pedido, res[0])
  }
  
})
  

socket.emit("chequear-pedidos-admin");
socket.on("nuevos-pedidos", data => {  
  if(pedidos == undefined && data.length > 0){
    pedidos = data;    
    //draw.newOrders(pedidos);
    draw.pedidoFlecha(pedidos[i-1]);
    socket.emit("chequear-pedidos-admin");
    return;
  }
  if(data.length > 0 && data.length > pedidos.length){
    alert("HAY PEDIDOS NUEVOS");
    pedidos = data;
    //TODO ver si es comodo quiza se pueda cambiar la opcion de que 
    //cambie al pedido nuevo
    draw.pedidoFlecha(pedidos[pedidos.length-1]);
    alert("HAY PEDIDOS NUEVOS");
    return;
  }
  return;
});
socket.on("pedidos-enCurso", data => {
    
  data.forEach(e => { e.viejo = true });
  pedidos = data
  console.log(pedidos)  
  draw.oldOrders(pedidos);
});

//chequear pedidos cada 5 min
setInterval(checkOrders, 300000);

function checkOrders(){
  socket.emit("chequear-pedidos-admin");
  return;
}

const draw = {
    pedidoFlecha: (d) => {
      mostrador.innerHTML = ``
        

                      
            const fechaSplit = d.fecha.split("/");
            let suma = 0;
            if(anio != Number(fechaSplit[2])){
              suma += 365 * (anio - Number(fechaSplit[2]))
            }
            if(mes != Number(fechaSplit[1])){
              suma += 30 * (mes - Number(fechaSplit[1]))
            }
            if(dia != Number(fechaSplit[0])){
              suma += dia - Number(fechaSplit[0])
            }
                            
            mostrador.innerHTML += `
            <div class="row">
              
              <hr>
              <div class="cardItem">
              <hr><div class="card border-success">        
                <div class="card-body">
                <div class="row">
                  <div class="flecha-atraz col">
                  </div>                
                  <h5 class="col">ORDEN DE PEDIDO: ${i} / ${pedidos.length}</h5>
                  <div class="col flecha-adelante"></div>
                </div>
                  <hr>
                  <h2 class="card-title">CLIENTE: ${d.cliente} NUMERO DE ORDEN: ${d.num_orden} DIAS EN PREPARACION: ${suma} FECHA: ${d.fecha} </h2>   
                  <h6></h6>       
                  <hr>
                  <div class="row">
                  <div class="col">
                  <a href="#num${d.num_orden}colapse" data-bs-toggle="collapse" class=" float-left dropdown-toggle btn-outline-info btn-sm bg-info" style="color: white;">Pedido</a>
                          
                          <div class="collapse" id="num${d.num_orden}colapse">
                              <hr>
                              <table class="table table-striped table-hover tablaOrden">
                                <thead>
                                <tr>
                                    <th>codigo</th>
                                    <th>titulo</th>
                                    <th>precio unitario</th>
                                    <th>cantidad</th>
                                    <th>total</th>
                                    <th>borrar</th>
                                </tr>
                                </thead>
                                <tbody id="list${d.num_orden}">
                                    
                                </tbody>
                                <tfoot >
                                    <tr class="total-compra-final">
                                    
                                    </tr>
                                    </tfoot>
                                </table> 
                                                                    
                            </div>
                            <hr>
                  
                    <a href="#faltas${d.num_orden}colapse" data-bs-toggle="collapse" class=" float-left dropdown-toggle btn-outline-info btn-sm bg-info" style="color: white;">Faltas</a>
                    <hr> 

                            <div class="collapse" id="faltas${d.num_orden}colapse">
                              <hr>
                              <table class="table table-striped table-hover tablaOrden">
                                <thead>
                                <tr>
                                    <th>codigo</th>
                                    <th>titulo</th>
                                    <th>precio unitario</th>
                                    <th>cantidad</th>
                                    <th>fecha de entrega</th>
                                    <th>borrar</th>
                                </tr>
                                </thead>
                                <tbody id="list-faltas${d.num_orden}">
                                    
                                </tbody>
                                <tfoot >
                                    <tr class="total-compra-final">
                                    
                                    </tr>
                                    </tfoot>
                                </table> 
                                                                    
                            </div>
                            <h6>Preparado por:</h6>
                    <select name="" id="preparado${d.num_orden}">
                      <option value="Oscar" selected>Oscar</option>
                      <option value="Javier" >Javier</option>        
                      <option value="Alejandro" >Alejandro</option>
                      <option value="Eric" >Eric</option>
                      <option value="Graciela" >Graciela</option>
                      <option value="Karina" >Karina</option>
                      <option value="Mario" >Mario</option>
                    </select>
                    <hr> 
                    </div>

                    <hr>
                    <h6>Estado</h6>
                    <select name="" id="estado${d.num_orden}">
                      <option value="Pagado" >Pagado</option>
                      <option value="Pedido Sin Asignar">Pedido Sin Asignar</option>
                      <option value="En preparacion" >En preparacion</option> 
                      <option value="Pasamos faltas" >Pasamos faltas</option> 
                      <option value="Sumando al pedido">Sumando al pedido</option>        
                      <option value="Importe pasado" >Importe pasado</option>
                      <option value="Reiteramos aviso importe">Reiteramos aviso importe</option>
                      <option value="Listo para enviar" >Listo para enviar</option>
                      <option value="Listo para que retire" >Listo para que retire</option>
                      <option value="Salio">Salio</option>
                    </select>
                    <hr>
                    <h6 id="observaciones">Notas:</h6>
                    <textarea name="" id="notasText${d.num_orden}" cols="5" rows="5">${d.notas}</textarea>

                          <div class="card-footer row">
                            <button class="botonConfirmar btn btn-primary" style="margin-right: 20px;" onclick="cambiosPorFlecha(${i})">Corfirmar</button>
                            <button class="btn btn-danger" style="" onclick="borrarPedido(${d.num_orden})">Borrar</button>
                            <button class="btn btn-warning botonOrden" onclick="buscarPedido(${d.num_orden})">IMPRIMIR</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      ` 
      
      document.getElementById("observaciones").value = d.observaciones

        if(d.estado == " "){
          d.estado = "Pedido Sin Asignar";
        }  
        
          draw.preparado("preparado"+d.num_orden, d.prepara)
          draw.estado("estado"+d.num_orden, d.estado)  
          draw.ordersList("list"+d.num_orden, d.compra)
          draw.faltas("list-faltas"+d.num_orden, d.faltas)

          //pocisiones flecha pedidos
          const flechaAdelante = document.querySelector(".flecha-adelante")
          const flechaAtraz = document.querySelector(".flecha-atraz")

          if(i < pedidos.length){
            //style="background: #a4ecf7;"
            flechaAdelante.style.backgroundColor = "#a4ecf7"
            flechaAdelante.innerHTML = `<i class="fa-solid fa-arrow-right"></i>`
          }
          if(i > 1){
            flechaAtraz.style.backgroundColor = "#a4ecf7"
            flechaAtraz.innerHTML = `<i class="fa-solid fa-arrow-left-long"></i>`
          }
          
            
        
        
    
    },
    newOrders: (data) => {
        
        mostrador.innerHTML = ``
        data.forEach(d => {

                      
            const fechaSplit = d.fecha.split("/");
            let suma = 0;
            if(anio != Number(fechaSplit[2])){
              suma += 365 * (anio - Number(fechaSplit[2]))
            }
            if(mes != Number(fechaSplit[1])){
              suma += 30 * (mes - Number(fechaSplit[1]))
            }
            if(dia != Number(fechaSplit[0])){
              suma += dia - Number(fechaSplit[0])
            }
                            
            mostrador.innerHTML += `
            <div class="row">
              
              <hr>
              <div class="cardItem">
              <hr><div class="card border-success">        
                <div class="card-body">
                
                  <hr>
                  <h5 class="card-title">CLIENTE: ${d.cliente} NUMERO DE ORDEN: ${d.num_orden} DIAS EN PREPARACION: ${suma} FECHA: ${d.fecha} </h5>   
                  <h6></h6>       
                  <hr>
                  <div class="row">
                  <div class="col">
                  <a href="#num${d.num_orden}colapse" data-bs-toggle="collapse" class=" float-left dropdown-toggle btn-outline-info btn-sm bg-info" style="color: white;">Pedido</a>
                          
                          <div class="collapse" id="num${d.num_orden}colapse">
                              <hr>
                              <table class="table table-striped table-hover tablaOrden">
                                <thead>
                                <tr>
                                    <th>codigo</th>
                                    <th>titulo</th>
                                    <th>precio unitario</th>
                                    <th>cantidad</th>
                                    <th>total</th>
                                    <th>borrar</th>
                                </tr>
                                </thead>
                                <tbody id="list${d.num_orden}">
                                    
                                </tbody>
                                <tfoot >
                                    <tr class="total-compra-final">
                                    
                                    </tr>
                                    </tfoot>
                                </table> 
                                                                    
                            </div>
                            <hr>
                  
                    <a href="#faltas${d.num_orden}colapse" data-bs-toggle="collapse" class=" float-left dropdown-toggle btn-outline-info btn-sm bg-info" style="color: white;">Faltas</a>
                    <hr> 

                            <div class="collapse" id="faltas${d.num_orden}colapse">
                              <hr>
                              <table class="table table-striped table-hover tablaOrden">
                                <thead>
                                <tr>
                                    <th>codigo</th>
                                    <th>titulo</th>
                                    <th>precio unitario</th>
                                    <th>cantidad</th>
                                    <th>fecha de entrega</th>
                                    <th>borrar</th>
                                </tr>
                                </thead>
                                <tbody id="list-faltas${d.num_orden}">
                                    
                                </tbody>
                                <tfoot >
                                    <tr class="total-compra-final">
                                    
                                    </tr>
                                    </tfoot>
                                </table> 
                                                                    
                            </div>
                            <h6>Preparado por:</h6>
                    <select name="" id="preparado${d.num_orden}">
                      <option value="Oscar" selected>Oscar</option>
                      <option value="Javier" >Javier</option>        
                      <option value="Alejandro" >Alejandro</option>
                      <option value="Eric" >Eric</option>
                      <option value="Graciela" >Graciela</option>
                      <option value="Karina" >Karina</option>
                      <option value="Mario" >Mario</option>
                    </select>
                    <hr> 
                    </div>

                    <hr>
                    <h6>Estado</h6>
                    <select name="" id="estado${d.num_orden}">
                      <option value="Pagado" >Pagado</option>
                      <option value="Pedido Sin Asignar">Pedido Sin Asignar</option>
                      <option value="En preparacion" >En preparacion</option> 
                      <option value="Pasamos faltas" >Pasamos faltas</option> 
                      <option value="Sumando al pedido">Sumando al pedido</option>        
                      <option value="Importe pasado" >Importe pasado</option>
                      <option value="Reiteramos aviso importe">Reiteramos aviso importe</option>
                      <option value="Listo para enviar" >Listo para enviar</option>
                      <option value="Listo para que retire" >Listo para que retire</option>
                      <option value="Salio">Salio</option>
                    </select>
                    <hr>
                    <h6>Notas:</h6>
                    <textarea name="" id="notasText${d.num_orden}" cols="5" rows="5">${d.notas}</textarea>

                          <div class="card-footer row">
                            <button class="botonConfirmar btn btn-primary" style="margin-right: 20px;" onclick="agregarCambio(${d.num_orden})">Corfirmar</button>
                            <button class="btn btn-danger" style="" onclick="borrarPedido(${d.num_orden})">Borrar</button>
                            <button class="btn btn-warning botonOrden" onclick="buscarPedido(${d.num_orden})">IMPRIMIR</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      ` 
        if(d.estado == " "){
          d.estado = "Pedido Sin Asignar";
        }  
        
          draw.preparado("preparado"+d.num_orden, d.prepara)
          draw.estado("estado"+d.num_orden, d.estado)  
          draw.ordersList("list"+d.num_orden, d.compra)
          draw.faltas("list-faltas"+d.num_orden, d.faltas)        
            
      })
        
    },
    oldOrders: (data) => {
      mostrador.innerHTML = ``      
        let ord = 1
      data.forEach(d => {
          d.num_orden = ord
                             
          mostrador.innerHTML += `
          <hr>
          <div class="cardItem">
          <hr><div class="card border-success">        
            <div class="card-body">
              <hr>
              <h5 class="card-title">CLIENTE: ${d.cliente} NUMERO DE ORDEN: ${d.num_orden} FECHA: ${d.fecha} </h5>          
              <hr>
              <div class="row">
              <div class="col">
              <a href="#num${d.num_orden}colapse" data-bs-toggle="collapse" class=" float-left dropdown-toggle btn-outline-info btn-sm bg-info" style="color: white;">Pedido</a>
                      
                      <div class="collapse" id="num${d.num_orden}colapse">
                          <hr>
                          <table class="table table-striped table-hover tablaOrden">
                            <thead>
                            <tr>
                                <th>codigo</th>
                                <th>titulo</th>
                                <th>precio unitario</th>
                                <th>cantidad</th>
                                <th>total</th>
                                <th>borrar</th>
                            </tr>
                            </thead>
                            <tbody id="list${d.num_orden}">
                                
                            </tbody>
                            <tfoot >
                                <tr class="total-compra-final">
                                
                                </tr>
                                </tfoot>
                            </table> 
                                                                
                        </div>
                        <hr>
              
                <a href="#faltas${d.num_orden}colapse" data-bs-toggle="collapse" class=" float-left dropdown-toggle btn-outline-info btn-sm bg-info" style="color: white;">Faltas</a>
                <hr> 

                        <div class="collapse" id="faltas${d.num_orden}colapse">
                          <hr>
                          <table class="table table-striped table-hover tablaOrden">
                            <thead>
                            <tr>
                                <th>codigo</th>
                                <th>titulo</th>
                                <th>precio unitario</th>
                                <th>cantidad</th>
                                <th>fecha de entrega</th>
                                <th>borrar</th>
                            </tr>
                            </thead>
                            <tbody id="list-faltas${d.num_orden}">
                                
                            </tbody>
                            <tfoot >
                                <tr class="total-compra-final">
                                
                                </tr>
                                </tfoot>
                            </table> 
                                                                
                        </div>
                        <h6>Preparado por:</h6>
                <select name="" id="preparado${d.num_orden}">
                  <option value="Oscar" selected>Oscar</option>
                  <option value="Javier" >Javier</option>        
                  <option value="Alejandro" >Alejandro</option>
                  <option value="Eric" >Eric</option>
                  <option value="Graciela" >Graciela</option>
                  <option value="Karina" >Karina</option>
                  <option value="Mario" >Mario</option>
                </select>
                <hr> 
                </div>

                <hr>
                <h6>Estado</h6>
                <select name="" id="estado${d.num_orden}">
                  <option value="Pagado" >Pagado</option>
                  <option value="Pedido Sin Asignar">Pedido Sin Asignar</option>
                  <option value="En preparacion" >En preparacion</option> 
                  <option value="Pasamos faltas" >Pasamos faltas</option> 
                  <option value="Sumando al pedido">Sumando al pedido</option>        
                  <option value="Importe pasado" >Importe pasado</option>
                  <option value="Reiteramos aviso importe">Reiteramos aviso importe</option>
                  <option value="Listo para enviar" >Listo para enviar</option>
                  <option value="Listo para que retire" >Listo para que retire</option>
                  <option value="Salio">Salio</option>
                </select>
                <hr>
                <h6>Notas:</h6>
                <textarea name="" id="notasText${d.num_orden}" cols="5" rows="5">${d.notas}</textarea>

                      <div class="card-footer row">
                        <button class="botonConfirmar btn btn-primary" style="margin-right: 20px;" onclick="agregarCambio(${d.num_orden})">Corfirmar</button>
                        <button class="btn btn-danger" style="" onclick="borrarPedido(${d.num_orden})">Borrar</button>
                        <button class="btn btn-warning botonOrden" onclick="buscarPedido(${d.num_orden})">IMPRIMIR</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    ` 
      if(d.estado == " "){
        d.estado = "Pedido Sin Asignar";
      }  
      
        //draw.preparado("preparado"+d.num_orden, d.prepara)
        //draw.estado("estado"+d.num_orden, d.estado)  
        draw.ordersList("list"+d.num_orden, d.compra)
        //draw.faltas("list-faltas"+d.num_orden, d.faltas)
        ord++    
    })
      
  },
    orders: (pedido) => {
            mostrador.innerHTML = `
        <table class="table table-striped table-hover tablaOrden">
        <thead>
        <tr>
            <th>codigo</th>
            <th>titulo</th>
            <th>precio unitario</th>
            <th>cantidad</th>
            <th>total</th>
            <th>borrar</th>
        </tr>
        </thead>
        <tbody class="resumen-check-out">
            
        </tbody>
        <tfoot >
            <tr class="total-compra-final">
            
            </tr>
            </tfoot>
        </table> 
        <button onclick="sendDataMail(dataMail)">ENVIAR X MAIL</button> 
        `
        const resumenCheckOut = document.querySelector(".resumen-check-out")
        pedido.forEach(e => {
        resumenCheckOut.innerHTML += `
        <td><img src="${e.imagen}" alt="imagen table" widht="60px" height="60px"></td>
        <td>${e.codigo}</td>
        <td>${e.titulo}<td>
        <td>${e.precio}</td>
        <td>${e.cantidad}</td>
        <td>${e.cantidad * e.precio}</td>
        <td class="eliminar-articulo">ELIMINAR</td>
        `;
        })
    },
    ordersList: (id, pedido) => {
      const order = id.split("list")[1]
      const list = document.querySelector("#"+id);
      list.innerHTML = ""
      pedido.forEach(e => {
        list.innerHTML += `
        <td><img src="${e.imagen}" alt="imagen table" widht="60px" height="60px"></td>
        <td>${e.codigo}</td>
        <td>${e.titulo}<td>
        <td>${e.precio}</td>
        <td>${e.cantidad}</td>
        <td>${e.cantidad * e.precio}</td>
        <td class="eliminar-articulo" style="color: red;">EN FALTA <div hidden>${order}</div></td>
        `;
      })
    },
    faltas: (id, pedido) => {
      const order = id.split("list-faltas")[1]
      const list = document.querySelector("#"+id);
      if(pedido.length == 0){
        list.innerHTML = "<td>Pedido sin faltas</td>"
      }else{
        list.innerHTML = ""
        pedido.forEach(e => {
          if(e.fecha_entrega == undefined){
            e.fecha_entrega = " ";
          }
          list.innerHTML += `
          <td><img src="${e.imagen}" alt="imagen table" widht="60px" height="60px"></td>
          <td>${e.codigo}</td>
          <td>${e.titulo}<td>
          <td>${e.precio}</td>
          <td>${e.cantidad}</td>
          <td>${e.fecha_entrega}</td>
          <td class="eliminar-articulo-falta" style="color: red;">ENTRO<div hidden>${order}</div></td>
          `;
        })
      }
    },
    estado: function (id, estado){
      const select = document.querySelector("#"+id);
      select.innerHTML += `<option value="${estado}" selected>${estado}</option>`;
    },
    preparado: function (id, estado){
      const select = document.querySelector("#"+id);
      select.innerHTML += `<option value="${estado}" selected>${estado}</option>`;
    }
}

function agregarCambio(orden){
  pedidos.forEach(e => {
    const notas = document.querySelector("#notasText"+e.num_orden).value;
    const preparado = document.querySelector("#preparado"+e.num_orden).value;
    const estado = document.querySelector("#estado"+e.num_orden).value;
    e.notas = notas;
    e.prepara = preparado;
    e.estado = estado;
    if(e.num_orden == orden){
      cambios.push(e);
    }
  })
  
}
function cambiosPorFlecha(i){
    const e = pedidos[i-1]
    const notas = document.querySelector("#notasText"+e.num_orden).value;
    const preparado = document.querySelector("#preparado"+e.num_orden).value;
    const estado = document.querySelector("#estado"+e.num_orden).value;
    e.notas = notas;
    e.prepara = preparado;
    e.estado = estado;
}

function confirmarCambios(){
  socket.emit("update-pedido", pedidos);
}

socket.on("update-pedido-res", res => {
  if(res){
    alert("PEDIDOS ACTUALIZADOS");
  }else{
    alert("ERROR AL ACTUALIZAR");
  }
  location.reload();
});

function borrarPedido(orden){
  const ok = confirm("DESEA BORRAR EL PEDIDO?");
  if(ok){    
    socket.emit("borrar-pedido", orden);
    socket.emit("chequear-pedidos-admin");
  }
}

socket.on("borrar-pedido-res", res => {
  if(res != undefined || res != null){
    console.log(res);
    location.reload();
  }
});


function searchResultTable(res){

  mostrador.innerHTML = ""
  mostrador.innerHTML = `<h1>hay ${res.length} pedidos</h1>`

  const arrayJSON = JSON.stringify(res);
  document.getElementById("res-busqueda").value = arrayJSON
  let i = 0
  res.forEach(e => {    
    mostrador.innerHTML += `  
    <li>${e.nombreApellido} ${e.fecha} </li><button onclick="printPagePreview(${i})">VER</button>
    `
    i++
  })
}

function printPagePreview(i, pedido, cliente){
  if(i){
    const rescate = document.getElementById("res-busqueda").value
    const res = JSON.parse(rescate)
    pedido = res[i].compra
    cliente = res[i]
  }
  let totalPedido = 0
  let envio = " "
  if(cliente.tipoDeEnvio){
    envio = `<div class="row"><b>Tipo de envío: ${cliente.retira} Forma de envío: ${cliente.tipoDeEnvio.forma_de_envio}</b></div>
    <div class="row"><b>Calle: ${cliente.tipoDeEnvio.Calle} Altura: ${cliente.tipoDeEnvio.Altura} Piso: ${cliente.tipoDeEnvio.piso_departamento} Horario de entrega: ${cliente.tipoDeEnvio.Horario_Entrega}</b></div>
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
   
  <button id="printPagePreviewSinIVA" class="botonOrden">IMPRIMIR</button>
  <hr> 
  <hr>
  <hr>
  <button class="botonOrden" onclick="sendDataMail(dataMail)">ENVIAR X MAIL</button>
  <hr>   
  <button id="pagePreciosSinIVA" class="botonOrden" >PRECIOS SIN IVA</button>
  <hr>   
  <button id="copiarContenido" class="botonOrden" >COPIAR</button>
  <hr> 
  <button class="botonOrden" onclick="refreshing()">VOLVER</button>
  `
  //
  const resumenCheckOut = document.querySelector(".resumen-check-out")
  pedido.forEach(e => {    
    const total = e.cantidad * e.precio
    resumenCheckOut.innerHTML += `
    <td class="text-center"><img src="${e.imagen}" alt="imagen table" widht="auto" height="60px"></td>
    <td>${e.codigo}</td>
    <td>${e.titulo}<td>
    <td>${e.precio}</td>
    <td>${e.cantidad}</td>
    <td>${total.toFixed(2)}</td>    
    `;
    // <td>en stock: </td>
    // <td>falta: </td>
    totalPedido += total    
  })
  if(cliente.tipoDeEnvio){
    document.querySelector(".total-compra-final").innerHTML = `
    <th>Total: ${totalPedido.toFixed(2)}</th> <th>Total Mas Envío: ${totalPedido.toFixed(2) + cliente.tipoDeEnvio.Costo}</th>
    `
  }else{
    document.querySelector(".total-compra-final").innerHTML = `
    <th>Total: ${totalPedido.toFixed(2)}</th>
    `
  }

  document.querySelector(".mostrador").addEventListener("click", e => {
    if(e.target.id == "printPagePreviewSinIVA"){
      printPage(pedido, cliente)
    }
    if(e.target.id == "pagePreciosSinIVA"){
      printPagePreviewSinIVA(pedido, cliente)
    }
    if(e.target.id == "copiarContenido"){
      const obj = document.querySelector(".tablaOrden")
      copyToClipboard(obj)
    }
  })
}

function printPage(pedido, cliente){
  printPagePreviewSinIVA(pedido, cliente)  
}

function refreshing(){
  location.reload()
}

function loadPedEnCurso(){
  mostrador.innerHTML = ` `
  socket.emit("chequear-pedidos-sinTerminar");
}

//FUNCION PARA COPIAR UNA TABLA Y ENVIARLA POR WHASTAPP
//SOLO COPIA EL HTML
function copyToClipboard(inputElement) {
  console.log(inputElement)
  try {
    // Crear un rango y seleccionar el contenido de la tabla
    var range = document.createRange();
    range.selectNode(inputElement);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    // Copiar el contenido al portapapeles utilizando el API Clipboard
    document.execCommand("copy");
    alert("Tabla copiada al portapapeles");
  } catch (err) {
    console.error("Error al intentar copiar la tabla al portapapeles:", err);
  } finally {
    // Limpiar la selección después de copiar
    window.getSelection().removeAllRanges();
  }
}

//TABLA IMPRIMIR CON PRECIOS SIN IVA

function printPagePreviewSinIVA(pedido, cliente){
  console.log(pedido, cliente)
  let totalPedido = 0
  let envio = " "
  if(cliente.tipoDeEnvio){
    envio = `<div class="row"><b>Tipo de envío: ${cliente.retira} Forma de envío: ${cliente.tipoDeEnvio.forma_de_envio}</b></div>
    <div class="row"><b>Calle: ${cliente.tipoDeEnvio.Calle} Altura: ${cliente.tipoDeEnvio.Altura} Piso: ${cliente.tipoDeEnvio.piso_departamento} Horario de entrega: ${cliente.tipoDeEnvio.Horario_Entrega}</b></div>
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
  <hr>   
  <button class="botonOrden" onclick="refreshing()">VOLVER</button>
  `
  //
  const resumenCheckOut = document.querySelector(".resumen-check-out")
  pedido.forEach(e => {
    const total = e.cantidad * e.precio
    const pSiva = e.precio / 1.21
    resumenCheckOut.innerHTML += `
    <td class="text-center"><img src="${e.imagen}" alt="imagen table" widht="auto" height="60px"></td>
    <td>${e.codigo}</td>
    <td>${e.titulo}<td>
    <td>${Number(pSiva).toFixed(2)}</td>
    <td>${e.cantidad}</td>
    <td>${total}</td>
    `;
    // <td>en stock: </td>
    // <td>falta: </td>
    totalPedido += total    
  })
  if(cliente.tipoDeEnvio){
    document.querySelector(".total-compra-final").innerHTML = `
    <th>Total: ${totalPedido}</th> <th>Total Mas Envío: ${totalPedido + cliente.tipoDeEnvio.Costo}</th>
    `
  }else{
    document.querySelector(".total-compra-final").innerHTML = `
    <th>Total: ${totalPedido}</th>
    `
  }
  
  document.querySelector(".total-compra-final").innerHTML = ""
  window.print()
  printPagePreview(pedido, cliente)
}


