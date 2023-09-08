const carrito = []

const itemsCarrito = document.querySelector("#carritoNumber")
if(carrito.lenght > 0){
    itemsCarrito.textContent = carrito.length;
}else{
    itemsCarrito.style.display = "none"
}

//abrir carrito
document.querySelector(".carrito").addEventListener('click', event=>{
    actualizarCarrito()
    //mostrar carrito
    const carritoShow = document.querySelector(".drawer-carrito");
    carritoShow.style.display = "block"
})
 
//eventos dentro del carrito
document.querySelector(".drawer-carrito").addEventListener('click', event=>{
  const mouse = event.target
  const carritoShow = document.querySelector(".drawer-carrito");

  //cerrar carrito
  if(mouse.id == "cerrarCarrito"){
    carritoShow.style.display = "none"
    if(carrito.length > 0){
        itemsCarrito.style.display = "block"
        itemsCarrito.textContent = carrito.length;
    }    
  }

  //eliminar artículo individual
  if(mouse.classList.contains("eliminar-articulo")){
        const codigo = event.target.parentElement.childNodes[3].childNodes[1].textContent
        const confirm = document.getElementById("custom-modal")
        alertModal("¿Querés eliminar el artículos del carrito?", "Esta acción no se puede deshacer.", "Sí, eliminar", "No")
        confirm.style.display = "block"
        confirm.addEventListener("click", event => {
            if(event.target.textContent == "Sí, eliminar"){
                for(let i=0; i<carrito.length; i++){
                    if(carrito[i].codigo == codigo){
                        console.log(carrito[i])
                        carrito.splice(i, 1)
                        actualizarCarrito()
                    }
                }
                if(carrito.lenght == 0){                    
                    itemsCarrito.style.display = "none"
                    const footer = document.querySelector(".carrito-footer")
                    footer.style.display = "none"
                }
                confirm.style.display = "none"
                localStorage.setItem("carrito", JSON.stringify(carrito))
            }
            if(event.target.textContent == "No" || event.target.classList.contains("cruz")){
                confirm.style.display = "none"
            }
    })
    }

    if(mouse.id == "eliminar-carrito"){
        const confirm = document.getElementById("custom-modal")
        alertModal("¿Querés eliminar todos los artículos del carrito?", "Esta acción no se puede deshacer.", "Sí, eliminar", "No")
        confirm.style.display = "block"
        confirm.addEventListener("click", event => {
            if(event.target.textContent == "Sí, eliminar"){
                carrito.length = 0                
                actualizarCarrito()
                localStorage.setItem("carrito", JSON.stringify(carrito))
                confirm.style.display = "none"
                carritoShow.style.display = "none"
                itemsCarrito.style.display = "none"
                itemsCarrito.textContent = carrito.length
                mostrarToats("Carrito eliminado con éxito.")
            }
            if(event.target.textContent == "No" || event.target.classList.contains("cruz")){
                confirm.style.display = "none"
            }
        })
        
    }
    if(mouse.id == "confirmar-compra"){
        window.location = "http://localhost:8080/check-out"
    }

    //cerrar haciendo click fuera del carrito
    if (mouse.classList.contains("drawer-carrito")) {
        carritoShow.style.display = "none"
        if(carrito.length > 0){
            itemsCarrito.style.display = "block"
            itemsCarrito.textContent = carrito.length;
        }
    }
    if (mouse.id == "guardarPedido") {        
        const confirm = document.getElementById("custom-modal")
        confirm.style.display = "block"
        alertModal("Queres guardar tu pedido?", "Luego vas a poder volver a cargarlo desde la barra de usuario", "Aceptar", "Cancelar")
        confirm.addEventListener("click", event => {
            if(event.target.textContent == "Aceptar"){
                const data = { id: mouse.value, pedido: carrito, nombre: "nombre prueba"}
                console.log(data)
                socket.emit("guardar-pedido-usuario", data)
                confirm.style.display = "none"
            }
            if(event.target.textContent == "Cancelar"){
                confirm.style.display = "none"
            }          
        })
         
    } 
})

//respuesta a guardar pedido
socket.on("guardar-pedido-usuario-res", res => {
    if(res){
        location.reload();
    }else{
        alertModal("Hubo un problema al guardar su pedido", "Por favor reintente nuevamente", "Cerrar")
    }
})

const carritoBody = document.querySelector(".carrito-cuerpo");
carritoBody.addEventListener('click', event=>{
    asignarMasMenos(event.target, true)
})

function ingresarCarrito(art){

    if(art.cantidad < 1){
        alert("La cantidad del artículo debe ser mayor a cero")
    }else{
        if(carrito.length == 0){
            carrito.push(art);                
        }else{
            let check = false
            for(const c of carrito){
                if(c.codigo === art.codigo){
                    const a = Number(c.cantidad)
                    const b = Number(art.cantidad)
                    c.cantidad = a + b
                    check = true
                }
            }
            if(!check){
                carrito.push(art);
            }
        }
    }
    
    itemsCarrito.style.display = "block"
    itemsCarrito.textContent = carrito.length;
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

function actualizarCarrito(){
    const carritoBody = document.querySelector(".carrito-cuerpo");
    carritoBody.innerHTML = ""
    
    let sumaTotal = 0

    if(carrito.length == 0){
        document.getElementById("eliminar-carrito").style.display = "none"
        const footer = document.querySelector(".carrito-footer")
        footer.style.display = "none"

        carritoBody.innerHTML +=  
        `<div class="carrito-emptystate">
            <img src="img/carrito-emptystate.svg" alt="" />
            <p class="empty-titulo">El carrito está vacío</p>
            <p class="empty-texto">Los artículos se agregarán acá luego de apretar “Agregar al carrito” en cada uno de ellos.</p>
            <button type="button" class="btn-primario">Ir a comprar</button>
         </div>`

         itemsCarrito.style.display = "none"
    }else{
        const footer = document.querySelector(".carrito-footer")
        footer.style.display = "block"
        document.getElementById("eliminar-carrito").style.display = "block"

        for(const c of carrito){
            const precio = c.precio * c.cantidad
            
            carritoBody.innerHTML += `
                <div class="carrito-item">
                <div class="contenedor-img-carrito" style="background-image: url(${c.imagen});"></div>
                <div>
                    <p style="display: none;">${c.codigo}</p>
                    <p class="item-titulo">${c.titulo}</p>
                    <p class="item-precio">$${Number(precio).toFixed(2)}</p>
                </div>
                <div class="cantidad-card">
                    <button type="button" class="menos"></button>
                    <input class="cantidad-de-venta" type="number" value="${c.cantidad}">
                    <button type="button" class="mas"></button>
                    <a class="eliminar-link">Eliminar</a>
                </div>
                <button type="button" class="eliminar eliminar-articulo"><span class="tooltip-eliminar">Eliminar</span></button>
                </div>
            `
            sumaTotal += precio
        } 
        
        itemsCarrito.textContent = carrito.length;
        //itemsCarrito.style.display = "none"   
    }
    
    //BUG SI NO HAY ELEAMENTOS CARGADOS NO ABRE EL CARRITO
    const inputCantidadCarrito = document.querySelector(".cantidad-de-venta")
    if(inputCantidadCarrito){
        let t = 500
        inputCantidadCarrito.addEventListener("keyup", event => {  
            t += 100          
            setTimeout(function() {
                const value = event.target.value
                if(value == "" || value == 0){
                    inputCantidadCarrito.value = 1
                }
                const codigo = event.target.parentElement.parentElement.childNodes[3].childNodes[1].textContent
                actualizarPrecioCarrito(codigo, value)
            }, t);
        })
    }    
    document.getElementById("total-carrito-suma").textContent = "$ " + Number(sumaTotal).toFixed(2) 
}

function modalDelete(){
    const confirm = document.querySelector(".modal-salir-guardar")
    confirm.style.display = "block"
    const delMessage = document.getElementById("delete-message")
    delMessage.textContent = txt
}

