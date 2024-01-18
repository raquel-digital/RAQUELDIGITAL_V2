//LUPA Y CRUZ
document.getElementById("barra-busqueda").addEventListener("keydown", event => {
  const vacio = document.querySelector(".busqueda-vacia")
  const bordeRojo = document.querySelector("#barra-busqueda")
  bordeRojo.style.borderColor = "#2F2F2F"
  vacio.style.display = "none"

  if (event.key === "Enter") {  
    const campoValor = document.getElementById("input-busqueda");
    if (campoValor.value.trim() === "") {
      event.preventDefault(); // Previene el envío del formulario si el campo está vacío.
      vacio.style.display = "block"      
      bordeRojo.style.borderColor = "#E61C1C"
    }else{
      const submit = document.getElementById("barra-busqueda")
      submit.submit()
    }
  }else{
    const lupa = document.querySelector(".lupa")
    lupa.classList.add("cruz") 
    if(document.getElementById("input-busqueda").value.trim() == ""){
      lupa.classList.remove("cruz")
    }
  }
})

document.querySelector(".lupa").addEventListener("click", event => {
  if(document.querySelector(".lupa").classList.contains("cruz")){
    event.preventDefault()
    document.getElementById("input-busqueda").value = ""
    document.querySelector(".lupa").classList.remove("cruz")
  }
})

//recibir resultados
socket.on("resultado-busqueda", data => {       
    if(data.result.length == 0){
     document.querySelector("main").innerHTML = `<h1>No hay resultados de búsqueda para <span class="resultado-busqueda">“${data.query}”</span></h1>
      <div  class="sin-resultados">
        <p>Intentá con otra palabra o navegá por las categorías para encontrar el artículo que buscás.</p>
        <button id="botonInicio" type="button" class="btn-primario">Volver al inicio</button>
      </div>`
      document.getElementById("botonInicio").onclick = function() {
        window.location.href = "https://raqueldigital.herokuapp.com/"
      };
    }else{
      document.getElementById("resultado-router").innerHTML = `<h1>Resultados de búsqueda para <span class="resultado-busqueda">“${data.query}”</span></h1>`
      
      if(paginador){
        paginador.innerHTML = ""
      }
      

      if(data.result.length > indice){
        //mostradorDeArticulos = data.result       
        crearPaginador(data.result);
      }else{
        showArts(data.result)
      }
    }      
})

socket.on("resultado-vacio", () => {
  mostrador.innerHTML = ""
  const vacio = document.querySelector(".busqueda-vacia")
  const bordeRojo = document.querySelector("#barra-busqueda")
  vacio.style.display = "block"      
  bordeRojo.style.borderColor = "#E61C1C"

  document.querySelector("main").innerHTML = `<h1>Campo de busqueda vacio</h1>
      <div  class="sin-resultados">
        <p>Ingrese una palabra en el campo de búsqueda.</p>
        <button id="botonInicio" type="button" class="btn-primario">Volver al inicio</button>
      </div>`
      document.getElementById("botonInicio").onclick = function() {
        window.location.href = "https://raqueldigital.herokuapp.com/"
      };
})