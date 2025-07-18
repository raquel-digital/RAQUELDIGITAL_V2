const socket = io.connect();

function enviarContacto(){
    const contacto = document.getElementById("contacto-consultas").value
    console.log(contacto)
    const nombre = document.getElementById("nombre-consultas").value
    console.log(nombre)

    if(contacto == "" || !contacto || nombre == "" || !nombre) {
        alert("Por favor completa los datos")
        return
    }
    const data = {
              consulta: nombre, //como reutilizamos un metodo existente nombre es consulta
              contacto: contacto
            }  
    
    alert("Muchas gracias, nos pondremos en contacto a la brevedad.")        
    socket.emit("consulta-cliente", data)
    window.location.href = "https://raqueldigital.herokuapp.com/";
}


   