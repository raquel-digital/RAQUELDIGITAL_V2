const itemsCarrito = document.querySelector("#carritoNumber")


document.addEventListener('DOMContentLoaded', () => {
    //local storage
    const carritoAnterior = JSON.parse(localStorage.getItem("carrito"))
    if(carritoAnterior){
        if(carritoAnterior){
            carritoAnterior.forEach(e => {
                ingresarCarrito(e)
            });
        }
    }

    
    if(carrito.lenght > 0){
        itemsCarrito.textContent = carrito.length;
    }else{
        itemsCarrito.style.display = "none"
    }

    socket.on("productos", data => {            
        showArts(data)  
     })

    
})