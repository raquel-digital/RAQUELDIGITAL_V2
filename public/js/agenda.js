const clientes = []
const agenda = []
const fechasFiltrar = []
let filterActual;

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
  <option value="Cliente Whatsapp">Cliente Whatsapp</option>
  <option value="Revisar Precio">Revisar Precio</option>
  <option value="Redes Sociales">Redes Sociales</option>
  <option value="Mario">Mario</option>
`
async function agendaInicio(historial){

    filterActual = undefined

    if(historial){
      //modo historial
      entradaTareas(historial, agenda)
      eventosAgenda(agenda, historial)
      socket.emit("req-cli")  
    }else{
      //Obtenemos listado de tareas
      const tareas = await fetch("./system/dir/tareasPendientes.json")
      .then(response => {
        if (!response.ok) {      
          alert("Archivo agenda no encontrado")
          throw new Error('La solicitud no se pudo completar.');
        }
        return response.json();
      })

      //Inicio en local
      // entradaTareas(tareas, agenda)
      // eventosAgenda(agenda, tareas)


      //obtenemos tareas en MONGO
      socket.emit("agenda-inicio")  
      
      socket.emit("req-cli")
    }
  }

  //obtenemos lista tareas
  socket.on("agenda-inicio-res", tareas => {
      entradaTareas(tareas, null)
      eventosAgenda(null, tareas)
  })

  //obtenemos lista de clientes
  socket.on("req-cli-res", data => {
    if(clientes.length == 0){
      data.forEach(e => {
        const str = e.replace(/_/g, " ")
        clientes.push(str)
    })
    }
  })
  
  function eventosAgenda(agenda, tareas){
    console.log(tareas, "Chequear que cuando se borre no agregue al inicio tareas borradas")

    mostrador.addEventListener("click", e => {
      const mouse = e.target

      if(mouse.id == "ingresar-tarea"){
        const searchInput = document.getElementById("searchInputTareas").value;
        
        if(!clientes.includes(searchInput.toUpperCase())){
          //si no esta el cliente en la lista se lo ingresa        
          clientes.push(searchInput.toUpperCase()) 
          socket.emit("nuevo-cliente", clientes)
        }
        
        const tarea = {
          id: tareas[tareas.length - 1].id + 1,
          cliente: searchInput.toUpperCase(),
          tipo_de_tarea: document.getElementById("tipo-tarea").value,
          tarea: document.getElementById("tareaIngreso").value,
          fecha: crearFecha()
        }

        const fechaAviso = document.getElementById("fecha-aviso").value

         if(fechaAviso != ""){
            // Convertir la fecha al formato "DD/MM/YYYY"
            const partesFecha = fechaAviso.split("-");
            const fechaFormateada = partesFecha[2] + "/" + partesFecha[1] + "/" + partesFecha[0];
            tarea.fecha_aviso = fechaFormateada;
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
            e.tarea = document.getElementById("notasText").value
            e.ultima_actualizacion = crearFecha()
                        
            if(document.getElementById("fecha-aviso").value != ""){  
                // Obtener el valor de la fecha en el formato "YYYY-MM-DD"
                const fechaOriginal = document.getElementById("fecha-aviso").value;

                // Convertir la fecha al formato "DD/MM/YYYY"
                const partesFecha = fechaOriginal.split("-");
                const fechaFormateada = partesFecha[2] + "/" + partesFecha[1] + "/" + partesFecha[0];

                // Establecer el valor formateado en el campo de fecha
                e.fecha_aviso = fechaFormateada;
            }
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
            if(!artBorrado[0].borrado){
              artBorrado[0].borrado = true //identificar que es de historial
              //updateamos las tareas
              socket.emit("art-borrado", artBorrado)
              console.log("borrar comun", artBorrado)
            }else{
              socket.on("art-borrado-historial", borrar)
              console.log("borrar historial", borrar)
            }
            socket.emit("tarea-nueva", borrar)
          }
        });         
      }

      //borrar cliente de la lista de busquedas
      if(mouse.classList.contains("borrar-lista-cliente")){
        //const cliente = mouse.parentElement.parentElement.textContent
        const cliente = mouse.value
        Swal.fire({
          title: "Queres borrar al cliente " + cliente + " de la lista?",
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
              text: "El cliente fue borrado.",
              icon: "success"
            });
            
            if(cliente){
              socket.emit("borrar-cliente-lista", cliente)
            }
          }
        });
      }

      //filtrar tareas 
      if(mouse.id == "tipo-tarea-filtrar"){
        if(mouse.value == "inicio"){
          return
        }
        if(mouse.value == "Todos"){
          entradaTareas(tareas, agenda)
        }else{
          filterActual = mouse.value
          const filtrar = tareas.filter(e => e.tipo_de_tarea === mouse.value)
          entradaTareas(filtrar, agenda)
        }
        document.getElementById("tipo-tarea-filtrar").firstElementChild.textContent = mouse.value
        //vuelve el filtro a la pos original TOTO APLICAR EN APP ADMIN GRLA
        document.getElementById("tipo-tarea-filtrar").selectedIndex = 0
      }
      //filtrar por fecha 
      if(mouse.id == "fecha-filtrar"){
        if(mouse.value == "inicio"){
          return
        }
        if(mouse.value == "Todos"){
          entradaTareas(tareas, agenda)
        }else{
          const filtrar = tareas.filter(e => e.fecha === mouse.value)
          entradaTareas(filtrar, agenda)
        }
        document.getElementById("fecha-filtrar").firstElementChild.textContent = mouse.value
        //vuelve el filtro a la pos original TOTO APLICAR EN APP ADMIN GRLA
        document.getElementById("fecha-filtrar").selectedIndex = 0
      }
      if(mouse.id == "historial-tareas"){
        socket.emit("historial-tareas")
      }  
      if(mouse.id == "historial-tareas-volver"){
        agendaInicio()
      }      
    
      //barra que completa busqueda de clientes
      completarBusqueda(clientes, "searchInputTareas", "suggestionsContainerTareas")
      //busqueda de tareas ingresadas por cliente
      const tareasCliente = tareas.map(e => e.cliente)
      completarBusqueda(tareasCliente, "searchInputTareasInicio", "suggestionsContainerTareasInicio")
      //Barra Busqueda Tareas  
      document.getElementById("suggestionsContainerTareasInicio").addEventListener("click", event => {
      //borrarde la lista de clientes
      if(mouse.classList.contains("borrar-lista-cliente")){
        console.log(mouse.value)
        return
      }else{
        const cliente = document.getElementById("searchInputTareasInicio").value
        if(cliente === ""){
          return
        }
        const filtrar = tareas.filter(e => e.cliente === cliente)
        console.log(cliente, filtrar)
        entradaTareas(filtrar)
      }      
    })
    //Boton busqueda
    document.getElementById("buscarClientesHistorial").addEventListener("click", event => {
        
        socket.emit("busqueda-agenda", tareas)       
    })
  })  
  }

  //recibimos las tareas recien ingresadas
  socket.on("tarea-nueva-res", update => {
    if(filterActual != undefined){
      const filtrar = update.filter(e => e.tipo_de_tarea === filterActual)
      filterActual = undefined
      entradaTareas(filtrar)     
    }else{
      agendaInicio(update)
    }
  })
  //recibimos historial de tareas
  socket.on("historial-tareas-res", historial => {
    console.log(historial)
    agendaInicio(historial)    
  })
  //busqueda en historial y clientes
  socket.on("busqueda-agenda-res", agenda => { 
    const cliente = document.getElementById("searchInputTareasInicio").value
        if(cliente === ""){
          return
        }   
    const filtrar = agenda.filter(e => e.cliente.includes(cliente.toUpperCase()))
    entradaTareas(filtrar)
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

        if(!fechasFiltrar.includes(e.fecha)){
          fechasFiltrar.push(e.fecha)
        } 

        let ultimaActualizacion = " "
        if(e.ultima_actualizacion){
          ultimaActualizacion = "(ultima modificación: " + e.ultima_actualizacion +")"
        }
        
        if(e.fecha_aviso == crearFecha()){
          const fechaAviso = document.querySelector(".entradasAgendaFechaAviso")
          fechaAviso.style.display = "block"
          fechaAviso.innerHTML += `
          <hr>
            <li style="padding: 12px; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
                <b style="flex: 1; display: flex; align-items: center; cursor: pointer;">
                FECHA: ${e.fecha} CIENTE: ${e.cliente}  ${e.tipo_de_tarea} ${e.tarea} ${ultimaActualizacion}
                <button class="botonConfirmarTarea btn btn-primary" value="${e.id}" style="margin-left: 20px;">Ver</button>    
                </b>
            </li>  
          `      
        }

        //ingresarTarea(e, entradasAgenda)
        
        //ingresar tareas S/tiempo pasado
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = today.getMonth() + 1;
        const dd = today.getDate();
        
        const fechaSplit = e.fecha.split("/")
        const fechaIngreso = fechaSplit.map(e => Number(e))

        const mismoMes = mm - fechaIngreso[1]
        const difDias = dd - fechaIngreso[0]

        if(fechaIngreso[2] < yyyy){
          ingresarTarea(e, document.getElementById("mas-de-un-mes"))
        }
        else {
          if(fechaIngreso[1] < mm && mismoMes >= 2){
            ingresarTarea(e, document.getElementById("mas-de-un-mes"))
          }
          else if (mismoMes == 1){
            const checkSemana = (dd + 30) - fechaIngreso[0] 
            if(checkSemana >= 30){              
              ingresarTarea(e, document.getElementById("mes-anterior"))
            }else if(checkSemana >= 7){
              ingresarTarea(e, document.getElementById("semana-pasada"))
            }else{
              ingresarTarea(e, document.getElementById("esta-semana"))
            }            
          }else{
            if(difDias > 7){
              ingresarTarea(e, document.getElementById("semana-pasada"))
            }else{
              ingresarTarea(e, document.getElementById("esta-semana"))
            } 
          }
        }
    })

    fechasFiltrar.forEach(e => {
      document.getElementById("fecha-filtrar").innerHTML += `
        <option value="${e}">${e}</option>
      `
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
    if(e.tipo_de_tarea == "Urgentes"){// || e.fecha_aviso == crearFecha()){
      //alert("Tarea Urgente " + e.cliente + " " + e.tarea)
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Tarea Urgente " + e.cliente + " " + e.tarea,
        showConfirmButton: false,
        timer: 3000
      });
    }

    let ultimaActualizacion = " "
    if(e.ultima_actualizacion){
      ultimaActualizacion = "(ultima modificación: " + e.ultima_actualizacion +")"
    }
    
    target.innerHTML += `
      <hr>
        <li style="padding: 12px; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
            <p style="flex: 1; display: flex; align-items: center; cursor: pointer;">
            FECHA: ${e.fecha} CIENTE: ${e.cliente}  ${e.tipo_de_tarea} ${e.tarea} ${ultimaActualizacion}
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
          
          // Crear el ícono de cruz
          const crossWrap = document.createElement('div');
          const crossIcon = document.createElement('i');
          crossIcon.classList.add('fas', 'fa-times', 'borrar-lista-cliente');
          crossWrap.setAttribute('value', suggestion);          
          crossIcon.style.position = 'absolute';
          crossIcon.style.right = '1rem';
          crossIcon.style.top = '1rem';


          // Agregar el ícono al DOM
          crossWrap.appendChild(crossIcon)
          suggestionElement.appendChild(crossWrap);

          suggestionElement.addEventListener('click', function() {
              // Al hacer clic en una sugerencia, puedes realizar alguna acción, como llenar el campo de búsqueda
              searchInput.value = suggestion

              // También puedes ocultar las sugerencias o realizar otra lógica aquí
              suggestionsContainer.style.display = 'none';
              
          });
        

          suggestionsContainer.appendChild(suggestionElement);
        });

        document.querySelectorAll(".suggestion").forEach(e => {
          
        })

        // Mostramos el contenedor de sugerencias si hay sugerencias disponibles
        if (suggestions.length > 0) {
          suggestionsContainer.style.display = 'block';
        } else {   
            suggestionsContainer.style.display = 'none';            
        }

        // Evento de clic en el documento para ocultar la barra de sugerencias
    document.addEventListener('click', function(event) {
      const isClickInsideSearch = searchInput.contains(event.target);
      const isClickInsideSuggestions = suggestionsContainer.contains(event.target);

      if (!isClickInsideSearch && !isClickInsideSuggestions) {
          suggestionsContainer.style.display = 'none';
      }
    });  
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
                <div class="row">
                  <div class="col">
                    <h2 class="card-title">CLIENTE: ${tarea.cliente} FECHA HOY: ${crearFecha()} FECHA INGRESO: ${tarea.fecha} </h2>   
                    <label for="fecha">Selecciona una fecha de aviso:</label>
                    <input type="date" id="fecha-aviso" name="fecha">
                  </div>
                </div>
                    
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

        if(tarea.fecha_aviso){
          const fechaOriginal = tarea.fecha_aviso;

              // Convertir la fecha al formato "DD/MM/YYYY"
              const partesFecha = fechaOriginal.split("/");
              const fechaFormateada = partesFecha[2] + "-" + partesFecha[1] + "-" + partesFecha[0];

              // Establecer el valor formateado en el campo de fecha
          document.getElementById("fecha-aviso").value = fechaFormateada
        }

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
      width: 80%;
      padding: 10px;
      font-size: 16px;
      margin-right: 0.5rem;
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
      <div class="search-container row">
            <h4>Cliente:</h4>
            <div class="col">
              <input type="text" class="search-input" id="searchInputTareasInicio" placeholder="Buscar..."><button id="buscarClientesHistorial" class="btn btn-primary mb-2 btn-lg">Buscar</button>
              <div class="suggestions-container" id="suggestionsContainerTareasInicio"></div>
            </div>
      </div>
      <hr>
      <div class="row">
      <div class="col">
        <nav style="background-color: #bcf7e5; /* Color verde agua suave */
            padding: 15px;
            border-radius: 25px; /* Bordes ovalados */
            text-align: center;">
        <select name="" id="tipo-tarea-filtrar">
            <option value="inicio" disabled selected>Filtrar por Tareas:</option>
            ${tareasTipo}
            <option value="Todos">Todos</option>
        </select>
        <select name="" id="fecha-filtrar">
            <option value="inicio" disabled selected>Filtrar por Fecha:</option>
            
            <option value="Todos">Todos</option>
        </select>
        <button id="historial-tareas" type="button" class="btn btn-primary btn-sm" style="margin-left: 1rem;">Historial</button>
        <button id="historial-tareas-volver" type="button" class="btn btn-warning btn-sm" style="margin-left: 1rem;">Reiniciar</button>
        
        </nav>
        </div>
      </div>

      <div class="row entradasAgendaFechaAviso" style="display: none;">
        <h1>TAREAS PARA HOY:</h1>
      </div>       

      <div class="row entradasAgenda">
      </div>

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

    

    <hr>  

    <div class="ingresoPedido card col-6" style="background-color: rgb(195, 195, 195); margin-top: 6rem; width: 60rem;">
            <h5 class="card-title">Ingreso De Tareas:</h5>
            <div class="card-body">

            <div class="search-container">
            <h4>Cliente:</h4>
              <input type="text" class="search-input" id="searchInputTareas" placeholder="Buscar...">
              <div class="suggestions-container" id="suggestionsContainerTareas"></div>
            </div>
            <div class="row">      
              <div class="col">
                    <label for="contacto">Tipo de tarea:</label>
                    
                      <select name="" id="tipo-tarea">
                          ${tareasTipo}
                      </select>                    
                      <input type="date" id="fecha-aviso" name="fecha">
                    </div>
              </div>
                    <div class="row">
                        <h5 class="card-title" style="margin-top: 2rem;">Tarea:</h5>
                        <textarea name="" id="tareaIngreso" cols="6" rows="4"></textarea>
                    </div>
                    <div class="row">
                    </div>
                    
                    <button id="ingresar-tarea" class="btn btn-primary" style="width: 30rem; margin-top: 2rem; margin-left: 16rem; margin-bottom: 1rem;">Enviar</button>
                
            </div>

                 
        </div>
    
  `
  return inicio
}

//damos inicio
//agendaInicio()
  