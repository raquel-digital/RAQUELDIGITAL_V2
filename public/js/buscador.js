//LUPA Y CRUZ

// document.getElementById("barra-busqueda").addEventListener("keydown", () => {
//   const lupa = document.querySelector(".lupa")
//   lupa.classList.add("cruz") 
//   if(document.getElementById("input-busqueda").value.trim() == ""){
//     lupa.classList.remove("cruz")
//   }  
// })

document.querySelector(".lupa").addEventListener("click", event => {
  if(document.querySelector(".lupa").classList.contains("cruz")){
    event.preventDefault()
    document.getElementById("input-busqueda").value = ""
    document.querySelector(".lupa").classList.remove("cruz")
  }
})

//evitar que el formulario llegue vacio
document.getElementById("barra-busqueda").onsubmit = function(event) {
    var campoValor = document.getElementById("input-busqueda");
    
    if (campoValor.value.trim() === "" || event.target.classList.contains("cruz")) {
        event.preventDefault(); // Evita el envío del formulario si el campo está vacío
        
        const vacio = document.querySelector(".busqueda-vacia")
        vacio.style.display = "block"

        const bordeRojo = document.querySelector("#barra-busqueda")
        bordeRojo.style.borderColor = "#E61C1C"
        //bordeRojo.classList.add("buscador-error")
    }
};

//recibir resultados
socket.on("resultado-busqueda", data => {       
    if(data.result.length == 0){
     mostrador.innerHTML = `<h1>No hay resultados de búsqueda para <span class="resultado-busqueda">“${data.query}”</span></h1>
      <div  class="sin-resultados">
        <p>Intentá con otra palabra o navegá por las categorías para encontrar el artículo que buscás.</p>
        <button id="botonInicio" type="button" class="btn-primario">Volver al inicio</button>
      </div>`
      document.getElementById("botonInicio").onclick = function() {
        window.location.href = "https://raqueldigital.herokuapp.com/"
      };
    }else{
      document.getElementById("resultado-router").innerHTML = `<h1>Resultados de búsqueda para <span class="resultado-busqueda">“${data.query}”</span></h1>`
      
      paginador.innerHTML = ""

      if(data.result.length > indice){
        //mostradorDeArticulos = data.result       
        crearPaginador(data.result);
      }else{
        showArts(data.result)
      }
    }      
})