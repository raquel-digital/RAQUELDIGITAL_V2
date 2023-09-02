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

    socket.on("productos", data => {            
        showArts(data)  
     })
})