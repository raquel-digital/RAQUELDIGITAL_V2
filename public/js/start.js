


document.addEventListener('DOMContentLoaded', () => { 

    socket.on("productos", data => {            
        showArts(data)  
     })
})