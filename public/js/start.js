const paginador = document.querySelector(".paginador")


document.addEventListener('DOMContentLoaded', () => { 

    socket.on("productos", data => {            
        showArts(data)  
     })
})