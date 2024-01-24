const clientes = []
const agenda = []
//tareas para agregar al select
const tareasTipo = `
  <option value="Tarea General">Tarea General</option>
  <option value="Modificaciones en web">Modificaciones en web</option>
  <option value="Actualizacion Articulos Web">Actualizacion Articulos Web</option>
  <option value="Encargar Artículo">Encargar Artículo</option>
  <option value="Conflicto Cliente">Conflicto Cliente</option>
  <option value="Mantenimiento Agenda">Mantenimiento Agenda</option>
  <option value="Urgentes">Urgentes</option>
  <option value="envios">Envíos</option>
`
async function agendaInicio(){
    //document.getElementById("buscadorContainer").innerHTML = ""
    //const mostrador = document.getElementById("buscadorContainer")
    
    //Obtenemos listado de los clientes en sistema
    const data = await fetch("./system/dir/agenda.json")
    .then(response => {
      if (!response.ok) {      
        alert("Archivo agenda no encontrado")
        throw new Error('La solicitud no se pudo completar.');
      }
      return response.json();
    })
    //Obtenemos listado de tareas
    const tareas = await fetch("./system/dir/tareasPendientes.json")
    .then(response => {
      if (!response.ok) {      
        alert("Archivo agenda no encontrado")
        throw new Error('La solicitud no se pudo completar.');
      }
      return response.json();
    })    
    
    data.forEach(e =>{
      agenda.push(e)
    })
        
    entradaTareas(tareas, agenda)
    eventosAgenda(agenda, tareas)
    socket.emit("req-cli")
  }

  //obtenemos lista de clientes
  socket.on("req-cli-res", data => {
    data.forEach(e => {
        const str = e.replace(/_/g, " ")
        clientes.push(str)
    })
  })
  
  function eventosAgenda(agenda, tareas){
    mostrador.addEventListener("click", e => {
      const mouse = e.target

      if(mouse.id == "ingresar-tarea"){

        const tarea = {
          id: tareas[tareas.length - 1].id + 1,
          cliente: document.getElementById("searchInputTareas").value,
          tipo_de_tarea: document.getElementById("tipo-tarea").value,
          tarea: document.getElementById("tareaIngreso").value,
          fecha: crearFecha()
        }
        
        tareas.push(tarea)
        socket.emit("tarea-nueva", tareas)

      }       
      if(mouse.classList.contains("botonConfirmarTarea")){        
        const tarea = tareas.filter(e => e.id == mouse.value)
        tarjetaTarea(tarea[0])
      }
      if(mouse.classList.contains("botonConfirmarCambioTarea")){ 
        tareas.forEach(e => {
        if(e.id == mouse.value){            
          e.tipo_de_tarea = document.getElementById("selectDeEstadoTarea").value
          e.tarea = document.getElementById("notasText").value + "(ultima modificacion: " + crearFecha() +")"
        }
        })
        //updateamos las tareas
        socket.emit("tarea-nueva", tareas)
      }
     
      if(mouse.classList.contains("borrarPedido")){

        Swal.fire({
          title: "Queres borrar la tarea?",
          text: "",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si!!, borrar!"
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Borrado!",
              text: "La tarea fue borrada.",
              icon: "success"
            });

            const artBorrado = tareas.filter(e => e.id == mouse.value)
            const borrar = tareas.filter(e => e.id != mouse.value)

            //updateamos las tareas
            socket.emit("art-borrado", artBorrado)
            socket.emit("tarea-nueva", borrar)
          }
        });         
      }
      //filtrar tareas 
      if(mouse.id == "tipo-tarea-filtrar"){
        console.log(mouse.value)
        if(mouse.value == "inicio"){
          return
        }
        if(mouse.value == "Todos"){
          entradaTareas(tareas, agenda)
        }else{
          const filtrar = tareas.filter(e => e.tipo_de_tarea === mouse.value)
          entradaTareas(filtrar, agenda)
        }
      }

    
    //barra que completa busqueda de clientes
    completarBusqueda(clientes, "searchInputTareas", "suggestionsContainerTareas")
    //busqueda de tareas ingresadas por cliente
    const tareasCliente = tareas.map(e => e.cliente)
    completarBusqueda(tareasCliente, "searchInputTareasInicio", "suggestionsContainerTareasInicio")
    //Barra Busqueda Tareas  
    document.getElementById("suggestionsContainerTareasInicio").addEventListener("click", event => {
      const cliente = document.getElementById("searchInputTareasInicio").value
      const filtrar = tareas.filter(e => e.cliente === cliente)
      entradaTareas(filtrar)
    })
  })  
  }

  //recibimos las tareas recien ingresadas
  socket.on("tarea-nueva-res", update => {
    agendaInicio()
  })
  
  function entradaTareas(tareas){
    mostrador.innerHTML = pantallaInicio()
    const entradasAgenda = document.querySelector(".entradasAgenda")
    entradasAgenda.innerHTML = `
    <h1>TAREAS PENDIENTES:</h1>
      <ul style="list-style-type: none; padding: 0; width: 300px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"></ul>
      `
     
    tareas.forEach(e => {  
      //checkbox <input type="checkbox" style="margin-left: 10px; cursor: pointer;">    

        ingresarTarea(e, entradasAgenda)

        //ingresar tareas S/tiempo pasado
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = today.getMonth() + 1;
        const dd = today.getDate();
        
        const fechaIngreso = e.fecha.split("/")

        if(fechaIngreso[2] < yyyy){
          ingresarTarea(e, document.getElementById("mas-de-un-mes"))
        }
        else {
          if(fechaIngreso[1] < mm && fechaIngreso[1] - mm >= 2){
            ingresarTarea(e, document.getElementById("mas-de-un-mes"))
          }
          else if (mm && fechaIngreso[1] - mm == 1){
            ingresarTarea(e, document.getElementById("mes-anterior"))
          }
          else {
            const dia = dd - fechaIngreso[0]
            if(dia > 7){
              ingresarTarea(e, document.getElementById("semana-pasada"))
            }else{
              ingresarTarea(e, document.getElementById("esta-semana"))
            }
          }
        }
        
        
        
       
        //vuelve el filtro a la pos original TOTO APLICAR EN APP ADMIN GRLA
        document.getElementById("tipo-tarea-filtrar").selectedIndex = 0
    })
  }

  // UTILS
  function crearFecha() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;        
    const fecha = dd + '/' + mm + '/' + yyyy;
    return fecha;
  }

  //entrada individual en agenda
  function ingresarTarea(e, target){
    if(e.tipo_de_tarea == "Urgentes"){
      alert("Tarea Urgente " + e.cliente + " " + e.tarea)
    }
    target.innerHTML += `
      <hr>
        <li style="padding: 12px; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
            <p style="flex: 1; display: flex; align-items: center; cursor: pointer;">
            FECHA: ${e.fecha} CIENTE: ${e.cliente}  ${e.tipo_de_tarea} ${e.tarea}
            <button class="botonConfirmarTarea btn btn-primary" value="${e.id}" style="margin-left: 20px;">Ver</button>    
            </p>
        </li>        
        `
  }
  
  socket.on("data-agenda-res", () => {
    agenda()
  })



  //completar input busqueda con clientes
  function completarBusqueda(agenda, input, listado){
    const searchInput = document.getElementById(input);
    const suggestionsContainer = document.getElementById(listado);

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        // Simplemente como ejemplo, aquí generamos algunas sugerencias de búsqueda aleatorias.
        const suggestions = generateSuggestions(searchTerm, agenda);
        // Limpiamos el contenedor de sugerencias
        suggestionsContainer.innerHTML = '';

        // Mostramos las sugerencias en el contenedor
        suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.classList.add('suggestion');
        suggestionElement.textContent = suggestion;

        suggestionElement.addEventListener('click', function() {
            // Al hacer clic en una sugerencia, puedes realizar alguna acción, como llenar el campo de búsqueda
            searchInput.value = suggestion;
            // También puedes ocultar las sugerencias o realizar otra lógica aquí
            suggestionsContainer.style.display = 'none';
            //esccribimos la tarjeta
            //crearTarjetaCliente(suggestion, agenda)
        });

        suggestionsContainer.appendChild(suggestionElement);
        });

        // Mostramos el contenedor de sugerencias si hay sugerencias disponibles
        if (suggestions.length > 0) {
        suggestionsContainer.style.display = 'block';
        } else {
        suggestionsContainer.style.display = 'none';
        }
    });   
  }

// Función para generar sugerencias de búsqueda
function generateSuggestions(query, clientes) {
    const suggestions = [];
    const check = query.toUpperCase()
    for (const c of clientes) {
        if(c.includes(check))
        suggestions.push(c);
    }
    return suggestions;
}

//***********  INNERS HTML ************** */

function tarjetaTarea(tarea){
  document.querySelector(".entradasAgenda").innerHTML = `<div class="row">
              <hr>
              <div class="cardItem">
              <hr><div class="card border-success">        
                <div class="card-body">
                  <h2 class="card-title">CLIENTE: ${tarea.cliente} FECHA: ${crearFecha()} DIAS EN PREPARACION: TODO FECHA INGRESO: TODO </h2>   
                  
                  <h6>Tipo Tarea:</h6>
                  <select id="selectDeEstadoTarea">
                  <option value="${tarea.tipo_de_tarea}" selected>${tarea.tipo_de_tarea}</option>
                    ${tareasTipo}        
                  </select> 
                    
                    <hr>
                    <h6>Notas:</h6>
                    <div class="row">
                      <textarea name="" id="notasText" cols="5" rows="5">${tarea.tarea}</textarea>
                    </div>
                    <hr>
                          <div class="card-footer row">
                            <button value="${tarea.id}" class="botonConfirmarCambioTarea btn btn-primary" style="margin-right: 20px;">Corfirmar / VOLVER</button>
                            <button value="${tarea.id}" class="btn btn-danger borrarPedido" >Borrar</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>`

        //alinear a tarjeta
        document.querySelector(".entradasAgenda").scrollIntoView({
          behavior: 'smooth', // para hacer el desplazamiento suave
          block: 'start',     // para alinear el borde superior del elemento con el borde superior de la ventana
          inline: 'nearest'   // para alinear el borde más cercano del elemento con el borde más cercano de la ventana
        });

        return
}


function pantallaInicio(){
  const inicio = `
  <style>
      body {
      font-family: Arial, sans-serif;
      }

      .search-container {
      position: relative;
      width: 90%;
      margin: 20px auto;
      }

      .search-input {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      }

      .suggestions-container {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background-color: #fff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      z-index: 1;
      }

      .suggestion {
      padding: 10px;
      border-bottom: 1px solid #ddd;
      cursor: pointer;
      }

      .suggestion:hover {
      background-color: #f9f9f9;
      }
    </style>

      <h1>Fecha: ${crearFecha()}</h1>
      <hr>
      <div class="search-container">
            <h4>Cliente:</h4>
              <input type="text" class="search-input" id="searchInputTareasInicio" placeholder="Buscar...">
              <div class="suggestions-container" id="suggestionsContainerTareasInicio"></div>
      </div>
      <hr>
      <select name="" id="tipo-tarea-filtrar">
          <option value="inicio" disabled selected>Filtrar por:</option>
          ${tareasTipo}
          <option value="Todos">Todos</option>
      </select>

    <div class="row entradasAgenda">
    </div>

    

    <hr>  

    <div class="ingresoPedido card col-6" style="background-color: rgb(195, 195, 195); margin-top: 6rem; width: 60rem;">
            <h5 class="card-title">Ingreso De Tareas:</h5>
            <div class="card-body">

            <div class="search-container">
            <h4>Cliente:</h4>
              <input type="text" class="search-input" id="searchInputTareas" placeholder="Buscar...">
              <div class="suggestions-container" id="suggestionsContainerTareas"></div>
            </div>
                    
                    <label for="contacto">Tipo de tarea:</label>
                    <select name="" id="tipo-tarea">
                        ${tareasTipo}
                    </select>
                    
                    <div class="row">
                        <h5 class="card-title" style="margin-top: 2rem;">Tarea:</h5>
                        <textarea name="" id="tareaIngreso" cols="6" rows="4"></textarea>
                    </div>
                    </div>
                    
                    <button id="ingresar-tarea" class="btn btn-primary" style="width: 30rem; margin-top: 2rem; margin-left: 16rem; margin-bottom: 1rem;">Enviar</button>
                
            </div>

            <hr style="margin-top: 4rem;"> 
              <h1>Tareas Organizadas Por Periodo</h1> 
            <hr> 

            <div id="esta-semana" class="row">
              <h4>Esta Semana: </h4>
            </div>
            <div id="semana-pasada" class="row">
              <h4>Semana Pasada: </h4>
            </div>
            <div id="mes-anterior" class="row">
              <h4>Mes Anterior: </h4>
            </div>
            <div id="mas-de-un-mes" class="row">
              <h4>Mas De Un Mes: </h4>
            </div>     
        </div>
    
  `
  return inicio
}

//damos inicio
//agendaInicio()
  