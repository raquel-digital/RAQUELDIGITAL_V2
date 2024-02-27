const socket = io.connect();
const mostrador = document.querySelector(".contenedor-articulos")
console.log(mostrador)
let mostradorDeArticulos;
let mostradorDeArticulosPaginador;

let indice = 50
if(window.innerWidth < 852){
  indice = 20
}
if(window.innerWidth < 600){
  indice = 10
}

//Clicks en mostrador
mostrador.addEventListener('click', event=>{
    const mouse = event.target
    //agregar al carrito
    if(mouse.classList.contains("articulo-compra")){
                
        //seleccionar boton con datos
        const clases = event.target.classList//returns arreglo con las clase
        const boton = document.querySelector("." + clases[0]);
        const cantidad_venta = mouse.parentElement.childNodes[9].childNodes[3].childNodes[3].value
              
        const art = {            
            codigo: boton.getAttribute("codigo"),
            precio: boton.getAttribute("precio"),
            titulo: boton.getAttribute("nombre"),
            imagen: boton.getAttribute("imagen"),
            cantidad: parseInt(cantidad_venta)
          }
        if(mouse.textContent == "Ver carta de colores" || mouse.textContent == "Seleccionar Medida"){
          const colores = boton.getAttribute("colores")
          modalColores.style.display = "block"
          cargarColores(art, colores)
        }else{
          ingresarCarrito(art)
          mostrarToats("Artículo agregado", boton)
        }      
    }

    //abrir y cerrar descripcion de artículo    
    if(mouse.classList.contains("chevron")){
        if(mouse.classList.contains("chevron-up")){        
            mouse.classList.remove("chevron-up")
            const mostrar = mouse.parentElement.nextElementSibling
            mostrar.style.display = "none"
            mouse.previousElementSibling.textContent = "Ver descripción"
        }else{
            mouse.classList.add("chevron-up")
            const mostrar = mouse.parentElement.nextElementSibling
            mostrar.style.display = "block"
            mouse.previousElementSibling.textContent = "Ocultar descripción"
        }
    }    

    if(mouse.textContent == "Ver descripción"){      
      mouse.nextElementSibling.classList.add("chevron-up")
      const mostrar = mouse.parentElement.nextElementSibling
      mostrar.style.display = "block"
      mouse.textContent = "Ocultar descripción"
      return 
    }
    if(mouse.textContent == "Ocultar descripción"){
      mouse.textContent = "Ver descripción"
      mouse.nextElementSibling.classList.remove("chevron-up")
      const mostrar = mouse.parentElement.nextElementSibling
      mostrar.style.display = "none"
      return       
    }

    //asigna + o - en articulo
    asignarMasMenos(mouse)

    //modal imagen
    if(mouse.classList.contains("contenedor-img-articulo")){     
      const boton = document.querySelector("#" + mouse.id);
      const imagen = boton.getAttribute("imagen");
      const nombre = boton.getAttribute("nombre");
      const modal = document.querySelector(".modal-img-ampliada")
      modal.children[1].children[0].textContent = nombre
      modal.children[1].children[1].src = imagen
      modal.style.display = "block"
    }
})

//SI HAY LOGIN: SELECT DE PEDIDOS
const menuPedidos = document.querySelector("#menuPedidos")
if(menuPedidos){
  menuPedidos.addEventListener('click', event => {
    const pedido = event.target.value
    
    if(!pedido.includes("google") && !pedido.includes("facebook")){
       const compra = JSON.parse(pedido)
       const confirm = document.getElementById("custom-modal")
        alertModal("Queres ingresar el pedido?", "Si tiene elementos en el carrito, estos se borraran", "Si", "No")
        confirm.style.display = "block"
      
      
        confirm.addEventListener("click", event => {
          if(event.target.textContent == "Si"){
            carrito.length = 0 
            //enviamos carrito a server para chequear diferencia en precios
            //socket.emit("chequear-compra", compra)
            confirm.style.display = "none" 
          } 
          if(event.target.textContent == "No"){
            confirm.style.display = "none" 
          }
        })

        document.querySelector("#menuPedidos").options[0].disabled = true;
        document.querySelector("#menuPedidos").options[0].selected = true;
    }
  })
  //borrar pedidos del usuario
document.querySelector("#boton-borrar-pedidos").addEventListener("click", event => {
  if(event.target.id == "boton-borrar-pedidos"){
    //seleccionamos los pedidos en el historial
    const menu = document.querySelector("#menuPedidos")
    let pedidos = menu.querySelectorAll("option")

    mostrador.innerHTML = `
                  <table id="tabla-pedidos" border="1" style="margin-top: 160rem; font-size: 10rem;">
                  
              </table>
              </body>
              </html>
    `
    let sub;
    pedidos.forEach(e => {
      
      if(e.textContent != "Historial de Pedidos"){
        const pedido = JSON.parse(e.value)
        document.getElementById("tabla-pedidos").innerHTML += `
            <thead>
            <tr>
              ${e.label}
            </tr>
            </thead>
        `
        const id = e.label.replace(/\s/g, "");
  
        document.getElementById("tabla-pedidos").innerHTML += `
            <thead>
              <tr>Codigo</tr>
              <tr>Titulo</tr>
              <tr>Precio</tr>
              <tr>Cantidad</tr>
              <tr>Imagen</tr>
            </thead>
            <tbody id=${id}></tbody>
        `

        
        pedido.forEach(p => {
          document.getElementById(id).innerHTML += `
              <td>${p.codigo}</td>
              <td>${p.titulo}</td>
              <td>${p.precio}</td>
              <td>${p.cantidad}</td>
              <td>${p.imagen}</td>
            `
        })
        
        document.getElementById(id).innerHTML += `
        <tfoot>
                <tr>
                  <button onclick="borrarPedido('${sub}', '${e.label}')">BORRAR PEDIDO</button>
                </tr>
        </tfoot>`
      }else{
        sub = e.value.toString()
      }
    })
  }
})
}
socket.on("chequear-compra-res", compra => {
   for(let c of compra){
          ingresarCarrito(c)
    }
})

function borrarPedido(id, fecha){
  data = {id: id, fecha: fecha}
  socket.emit("borrar-pedido", data)
}
//RESPUESTA
socket.on("borrar-pedido-res", res => {
  if(res){
    alert("PEDIDO BORRADO EXITOSAMENTE")
  }else{
    alert("FALLO AL BORRAR PEDIDO")
  }
})

//clicks en modal cierra imagen
document.querySelector(".modal-img-ampliada").addEventListener('click', () => {
    const modal = document.querySelector(".modal-img-ampliada")
    modal.style.display = "none"  
})


function asignarMasMenos(mouse, cart){
  
    //cantidades + y -
    if(mouse.classList == "mas"){
       const cant = mouse.previousElementSibling.value++
        if(cart){
           const codigo = mouse.parentElement.parentElement.childNodes[3].childNodes[1].textContent
           actualizarPrecioCarrito(codigo, parseInt(cant+1))
        }       
    }
    if(mouse.classList == "menos" && mouse.nextElementSibling.value > 0){
        const cant = mouse.nextElementSibling.value-- 
        if(cart){
           const codigo = mouse.parentElement.parentElement.childNodes[3].childNodes[1].textContent
           actualizarPrecioCarrito(codigo, parseInt(cant-1))
        }      
    }
}

function actualizarPrecioCarrito(codigo, cant){
    for(const c of carrito){
        if(c.codigo == codigo){            
            c.cantidad = cant        }
    }
    actualizarCarrito()
}

  //PAGINADOR
  function crearPaginador(arr){
    paginador.innerHTML = ""

    //const paginadorArray = mostradorDeArticulos.filter(e => e.mostrar);
    const paginadorArray = arr.filter(e => e.mostrar);    
    
    let i = paginadorArray.length / indice;
    
        let num = 1
        
        while(i > 0){
            
            
            paginador.innerHTML +=  `<button type="button" class="pagina" onclick="asignadorPaginador(${num})">${num}</button>`

            num++;
            
            i--;
        }
        
        mostradorDeArticulosPaginador = arr
        asignadorPaginador(1);              
  }

  function asignadorPaginador(i){
    const paginador = document.querySelectorAll(".pagina")

    paginador.forEach(e => {
      if(e.classList.contains("pagina-elegida")){
        e.classList.remove("pagina-elegida")
      }
      
      if(e.textContent == i){        
        e.classList.add("pagina-elegida")
      }
    })
  
    const start = (i * indice) - indice;
    const end = i * indice;
   
    const arrayIndiceMap = mostradorDeArticulosPaginador.slice(start, end);

    // Calcula la posición de la sección
    var posicion = mostrador.getBoundingClientRect().top + window.scrollY + -500;//-150 prev

    // Realiza el desplazamiento suave hasta la posición de la sección
    window.scrollTo({
        top: posicion,
        behavior: "smooth" // Animación suave
    });
      
    showArts(arrayIndiceMap);  
  }

  function mostrarToats(txt, spin){
    const toast = document.querySelector(".toast-exito")
    toast.innerHTML = `
        <img src="img/tilde.svg" alt="">
        <p>${txt}</p>
    `

    if(spin == false){
      setTimeout(function() {
        toast.style.display = "block"
        setTimeout(function() {
          toast.style.display = "none"
        }, 1000);
      }, 1);
      return
    }

    const tempTxt = spin.textContent
    spin.classList.add("spinner")
    spin.classList.add("loading")    
    spin.textContent = " "
    
    setTimeout(function() {
      spin.classList.remove("spinner")
        spin.classList.remove("loading")
        spin.textContent = tempTxt
        toast.style.display = "none";
        //Primer timeout completado        
      // Segundo timeout (llamado dentro del primer timeout)
      setTimeout(function() {
        toast.style.display = "block"
        itemsCarrito.style.display = "block"
        itemsCarrito.textContent = carrito.length;
        //Segundo timeout completado
        setTimeout(function() {
          toast.style.display = "none"
          //Tercer timeout completado
        }, 1000);
      }, 350); // El segundo timeout se ejecutará después de 2 segundos (2000 milisegundos)
    }, 100); // El primer timeout se ejecutará después de 3 segundos (3000 milisegundos)
  }

  //Modal carta colores
  const modalColores = document.querySelector(".modal-carta-colores")

  modalColores.addEventListener("keydown", e => {
    //input numeros teclado
    if(!isNaN(e.target.value)){      
      document.getElementById("modal-colores").removeAttribute("disabled");
      const cantidad = e.target.parentElement.parentElement.parentElement.children[2].children[1]
      cantidad.checked = 1
      e.target.parentElement.parentElement.parentElement.classList.add("color-seleccionado")
      
    }
  })
  modalColores.addEventListener("click", e => {
    const mouse = e.target
    
    asignarMasMenos(mouse)
    //activar checkbox con + o -
    if(mouse.classList.contains("mas") || mouse.classList.contains("menos")){
      const checkBox = mouse.parentElement.parentElement.parentElement.children[2].children[1]
      checkBox.checked = true
      const cantidad = mouse.parentElement.parentElement.parentElement.children[1].children[1].children[1]
      if(cantidad.value > 0){
        mouse.parentElement.parentElement.parentElement.classList.add("color-seleccionado")
        checkBox.checked = true
      }else{
        mouse.parentElement.parentElement.parentElement.classList.remove("color-seleccionado")
        checkBox.checked = false
      } 
      
      document.getElementById("modal-colores").removeAttribute("disabled");
    }

    if(mouse.checked){
      const cantidad = mouse.parentElement.parentElement.children[1].children[1].children[1]
      if(cantidad.value == 0){
        cantidad.value = 1
      }     
      
      mouse.parentElement.parentElement.classList.add("color-seleccionado")
      
      document.getElementById("modal-colores").removeAttribute("disabled");
    }else{
      mouse.parentElement.parentElement.classList.remove("color-seleccionado")
      
      const parentElement = mouse.parentElement;
      const cantidadElement = parentElement?.parentElement?.children[1]?.children[1]?.children[1];
      
      if(cantidadElement){
        cantidadElement.value = 0
      }  
    }
    //CERRAR MODAL
    if(mouse.id == "cerrar-modal"){
      modalColores.style.display = "none"
    }
    if(mouse.classList.contains("modal-carta-colores")){
      modalColores.style.display = "none"
    }
    //Confirmar Compra
    if(mouse.id == "modal-colores"){
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        
        let exist = false
        checkboxes.forEach(function(checkbox) {
         
          if (checkbox.checked) {
             exist = true 
             const boton = document.getElementById("modal-colores")
             const click = checkbox.parentElement.parentElement.firstElementChild.classList 
             const imagen = click[2] 
             const codigo = click[3]
             const cantidad = checkbox.parentElement.parentElement.children[1].children[1].children[1].value
             let medida = checkbox.parentElement.parentElement.children[1].children[0].textContent
             
             if(!medida.includes("N°")){
              medida = ""
             }
             
              const art = {
               codigo: codigo,
               imagen: imagen,
               precio: boton.getAttribute("precio"),
               titulo: boton.getAttribute("nombre") + " " + medida,
               cantidad: parseInt(cantidad)
             };

             if(art.cantidad > 0){
              ingresarCarrito(art)
              mostrarToats("Artículo agregado con exito", boton)              
              modalColores.style.display = "none"
             }else{
              alert("articulo " + art.codigo + art.titulo + " se ingreso cero en la cantidad")
             }
          }
        })
        if(!exist){
          const boton = document.getElementById("modal-colores")
          alert("No se selecciono ningun artículo")
        }
        document.getElementById("modal-colores").setAttribute("disabled", "true");
    }
  })

  function cargarColores(art, colores){
    
    const arrColores = JSON.parse(colores)

    const modalContenidoColor = document.getElementById("contenido-modal")
    modalContenidoColor.innerHTML = ""

    let talles = false
    //chequear si es talles
    for(const t of arrColores){
      if(t.codigo.includes("talle")){
        talles = t.codigo.replace("_talle", "")
        t.codigo = talles
      }
    }
    
    arrColores.sort(compararOrdenar)//ordenar de menor a mayor
    arrColores.forEach( e => {     
      let color 
      const split = e.codigo.split("-")
      if(e.mostrar){
        if(talles){          
          color = "Medida N° " + split[split.length-1]
        }else{          
          color = split[1]
          if(color.includes("_")){
            color = color.replace("_", " ")
          }
          if(split.length > 2){        
            for (let index = 2; index < split.length; index++) {              
              color += " " + split[index]
            }
          }
        }

        const splitImg = art.imagen.split("/")
        let imagen
        if(splitImg.length>4){
          imagen = "/img/" + splitImg[2] + "/" + splitImg[3] + "/" + e.color
         
        }else{
          imagen = "/img/" + splitImg[2] + "/" + e.color          
        }
        
                modalContenidoColor.innerHTML += `
        <div class="card-articulo">
        <div id="modal-color${e.codigo}" class="contenedor-img-articulo img-color ${imagen} ${e.codigo}" style="background-image:url(${imagen});"></div>
        <div class="color-info">
            <h3>${color}</h3>
            <div class="cantidad-card">
                <button type="button" class="menos"></button>
                <input class="inputCantidadCartaColor" type="number" value="0">
                <button type="button" class="mas"></button>
            </div>
        </div>
        <div class="seleccionar-color">
            <label for="">Seleccionar</label>
            <input type="checkbox" id="" value="">
        </div>
        </div>
        `
      }
    }) 

   //setear atributos al boton de confirmar
   const boton = document.getElementById("modal-colores")
   boton.textContent = "Agregar al carrito"
   boton.setAttribute("precio", art.precio);
   boton.setAttribute("nombre", art.titulo);

   modalContenidoColor.addEventListener("click", event => {
    if(event.target.classList.contains("contenedor-img-articulo")){     
      const click = event.target.classList;
      const imagen = click[2]
      const nombre = boton.getAttribute("nombre");
      const modalContenidoColorApliada = document.querySelector(".modal-img-ampliada")
      
      modalContenidoColorApliada.children[1].children[0].textContent = nombre
      modalContenidoColorApliada.children[1].children[1].src = imagen
      modalContenidoColorApliada.style.display = "block"
    }
   })
  }

  function alertModal(txt, txt2, confirmar, cancelar){
    document.getElementById("mensaje-1").textContent = txt

    if(txt2){
      document.getElementById("mensaje-2").textContent = txt2
    }

    document.getElementById("confirmar-mensaje").textContent = confirmar
    if(cancelar){
      document.getElementById("cancelar-mensaje").textContent = cancelar
    }
  }

  
  function compararOrdenar(a, b) {
    // Extraer los números de las strings
    var numeroA = parseInt(a.codigo.split("-")[1]);
    var numeroB = parseInt(b.codigo.split("-")[1]);

    // Comparar los números
    return numeroA - numeroB;
}

//categorias
document.querySelector("#select-categ").addEventListener('click', event=>{
  const mouse = event.target.tagName;
  let inMobile = false
  if(mouse == "A"){
      window.location = "https://raqueldigital.herokuapp.com/categoria?categ=" + event.target.textContent;
  }else{
    if(inMobile){
      const barraCateg = document.getElementById("barra-categorias")
      barraCateg.style.display = "none"
      inMobile = false
    }
  }
  //dropdown categorias (en responsive)
  if(event.target.classList.contains("cruz")){
    event.target.classList.remove("cruz")
    const barraCateg = document.getElementById("barra-categorias")
    barraCateg.style.display = "none"
    return
  }
  if(event.target.id == "elegir-categorias"){
    inMobile = true    
    event.target.classList.add("cruz")    
    const barraCateg = document.getElementById("barra-categorias")
    barraCateg.style.display = "block"
    return
  } 
 
})







