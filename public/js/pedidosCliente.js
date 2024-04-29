const formularioContacto = `
    <div id="formulario-contacto">
    <h3>Nombre:</h3>
    <input type="text" placeholder="ingrese nombre">
    <h3>Forma de contacto:</h3>
    <h3>whatsapp:</h3>
    <input type="text" placeholder="ingrese numero">
    <h3>mail:</h3>
    <input type="text" placeholder="ingrese e-mail">
    <h3>Es para retirar o envío?:</h3>
    <h3>retiro</h3>
    <input class="form-check-input" type="radio" name="formaContacto" id="retira">
    <h3>envio</h3>
    <input class="form-check-input" type="radio" name="formaContacto" id="envio">
        <div id="ingresar-envio" style="display: none;">
            <h3>Direccion:</h3>
            <input class="form-check-input" type="text" name="direccion" id="direccion">
            <h3>Localidad:</h3>
            <input class="form-check-input" type="text" name="localidad" id="localidad">
        </div>
    </div>
    <h3>Observaciones:</h3>
    <textarea name="observaciones" id="observaciones" cols="40" rows="10" style="margin-bottom:38rem;"></textarea>
`

const cardPedido = `
<div class="card-preg-frec">
    <h3 style="display: inline-block; margin-right: 10px;">Descripcion:</h3>
    <input type="text" placeholder="Ingrese artículo" style="display: inline-block;margin-right: 10px;">
    <h3 style="display: inline-block; margin-right: 10px;">Cantidad:</h3>
    <input type="text" placeholder="Ingrese cantidad" style="display: inline-block;">
    <div style="display: inline-block;">
        <h3 style="display: inline-block; margin-right: 10px;margin-top: 10px;">Color:</h3>
        <input type="text" placeholder="En caso de ser necesario" style="display: inline-block;margin-right: 10px; ">
        <h3 style="display: inline-block; margin-right: 10px;">Medida:</h3>
        <input type="text" placeholder="En caso de ser necesario" style="display: inline-block;">       
    </div>
</div>
<div id="borrarArt">
    <h3 class="agregar-articulo" style="display: inline-block;margin-bottom:25px">Sumar Artículo:</h3>
    <div class="mas agregar-articulo" style="display: inline-block; align-items: center;margin: -8px 10px;"></div>
    <div class="menos borrar-articulo" style="display: inline-block; align-items: center;margin: -8px 10px;"></div>
    ${formularioContacto}
    <button type="button" class="enviar-pedido btn-primario" style="width: auto; margin-left: -243rem;">ENVIAR PEDIDO</button>    
</div>
`
let pedido = []

const socket = io.connect();
document.querySelector("main h1").textContent = "Planilla De Pedidos"
const mostrador = document.querySelector(".contenedor-articulos")

mostrador.innerHTML = `
<h1>aqui puede generar un pedido completando los datos de la planilla complete los datos de contacto para poder comunicarnos</h1>
<div class="contenedor-preg-frec">
    ${cardPedido}    
</div>
`

document.querySelector(".contenedor-preg-frec").addEventListener("click", e => {
    const mouse = e.target
    if(mouse.classList.contains("agregar-articulo")){
        const arts = document.querySelectorAll(".card-preg-frec")

        const borrar = document.getElementById("borrarArt")
        borrar.remove()

        const artsArray = agregarArticulos(arts, true)
        const contenedor = document.querySelector(".contenedor-preg-frec")
        contenedor.innerHTML = ""
        artsArray.forEach(e => {            
            contenedor.appendChild(e);
        })

        const form = crearFormulario()
        contenedor.appendChild(form)

        
    }
    if(mouse.classList.contains("borrar-articulo")){
        const arts = document.querySelectorAll(".card-preg-frec")
        const artsArray = Array.from(arts);
        artsArray.pop()

        const artsDelete = agregarArticulos(artsArray)
        const contenedor = document.querySelector(".contenedor-preg-frec")
        contenedor.innerHTML = ""
        artsDelete.forEach(e => {
            contenedor.appendChild(e);
        })
        const form = crearFormulario()
        contenedor.appendChild(form)
        //contenedor.innerHTML += `<div id="borrarArt"><h3 class="agregar-articulo">Sumar Artículo:</h3><div class="mas agregar-articulo""></div><div class="menos borrar-articulo""></div>${formularioContacto}<button type="button" class="enviar-pedido btn-primario" style"width: 30%;">ENVIAR PEDIDO</button></div>`
    }      
    if(mouse.classList.contains("enviar-pedido")){
        const arts = document.querySelectorAll(".card-preg-frec")
        const artsArray = Array.from(arts);
        const pedidos = []
        console.log(artsArray)
        artsArray.forEach(e => {
            const input = e.querySelectorAll("input")
            const inputVals = Array.from(input);
            
            const check = checkPedido(inputVals)

            if(check){
                return
            }

            const pedido = {
                descripcion: inputVals[0].value,
                cantidad: inputVals[1].value,
                color: inputVals[2].value,
                medida: inputVals[3].value
            }
            pedidos.push(pedido)
        })

        console.log(pedidos)  
        const form = document.getElementById("formulario-contacto")      
        const formVals = form.querySelectorAll("input")
        const inputFormVals = Array.from(formVals);             
        
        const cliente = checkDatos(inputFormVals)   
        if(cliente == false){
            return
        }     
        
        socket.emit("pedido-planilla", cliente)  
    }
    //mostrar campo envío
    const envio = document.getElementById("envio")
    const datoEnvio = document.getElementById("ingresar-envio")
    if(envio.checked){
        datoEnvio.style.display = "block"
    }else{
        datoEnvio.style.display = "none"
    }
})

function checkDatos(inputFormVals){
    if(inputFormVals[0].value.length == 0){
        alert("Por favor ingrese nombre")
        return false
    }
    if(inputFormVals[1].value.length == 0){
        alert("Por favor un numero de whatsapp")
        return false
    }
    if(inputFormVals[2].value.length == 0){
        alert("Por favor un mail de contacto")
        return false
    }

    const envio = inputFormVals[4].checked ? "Direccion: " + document.getElementById("direccion").value + "  Localidad: " + document.getElementById("localidad").value : " "    
    const retira = inputFormVals[3].checked ? "Retira por local" : " "

    const cliente = {
        nombre: inputFormVals[0].value,
        whatsapp: inputFormVals[1].value,
        mail: inputFormVals[2].value,
        retira: retira,
        envio: envio,
        pedido: pedidos,
        observaciones: document.getElementById("observaciones").value
    }

    return cliente
}

function checkPedido(pedido){
    if(pedido[0].value.length == 0){
        alert("Debe ingresar descripcion en artículo")
        return false
    }
    if(pedido[1].value.length == 0){
        alert("Debe ingresar cantidad en artículo")
        return false
    }
    return true
}

socket.on("pedido-planilla-res", res => {
    console.log(res)
    if(res != null){
        mostrador.innerHTML = `<h1>Pedido enviado exitosamente, nos estamos poniendo en contacto a la brevedad</h1>`
    }else{
        alert("Error al enviar pedido, por favor intente nuevamente")
    }
})

function agregarArticulos(arts, agregar){
    const res = []

    arts.forEach(e => {
        const inputVals = e.querySelectorAll("input")        

        // Crear el contenedor principal
        const cardPregFrec = document.createElement('div');
        cardPregFrec.classList.add('card-preg-frec');

        // Crear el elemento <h3> para "Descripcion"
        const descripcionHeader = document.createElement('h3');
        descripcionHeader.textContent = 'Descripcion:';
        descripcionHeader.style.display = 'inline-block';
        descripcionHeader.style.marginRight = '10px';

        // Crear el input para "Descripcion"
        const descripcionInput = document.createElement('input');
        descripcionInput.setAttribute('type', 'text');
        descripcionInput.setAttribute('placeholder', 'Ingrese artículo');
        descripcionInput.style.display = 'inline-block';
        descripcionInput.style.marginRight = '10px';
        descripcionInput.value = inputVals[0].value
        
        // Crear el elemento <h3> para "Cantidad"
        const cantidadHeader = document.createElement('h3');
        cantidadHeader.textContent = 'Cantidad:';
        cantidadHeader.style.display = 'inline-block';
        cantidadHeader.style.marginRight = '10px';

        // Crear el input para "Cantidad"
        const cantidadInput = document.createElement('input');
        cantidadInput.setAttribute('type', 'text');
        cantidadInput.setAttribute('placeholder', 'Ingrese cantidad');
        cantidadInput.style.display = 'inline-block';
        cantidadInput.value = inputVals[1].value

        // Crear el contenedor para "Color" y "Medida"
        const colorMedidaContainer = document.createElement('div');
        colorMedidaContainer.style.display = 'inline-block';

        // Crear el elemento <h3> para "Color"
        const colorHeader = document.createElement('h3');
        colorHeader.textContent = 'Color:';
        colorHeader.style.display = 'inline-block';
        colorHeader.style.marginRight = '10px';
        colorHeader.style.marginTop = '10px';

        // Crear el input para "Color"
        const colorInput = document.createElement('input');
        colorInput.setAttribute('type', 'text');
        colorInput.setAttribute('placeholder', 'En caso de ser necesario');
        colorInput.style.display = 'inline-block';
        colorInput.style.marginRight = '10px';
        colorInput.value = inputVals[2].value

        // Crear el elemento <h3> para "Medida"
        const medidaHeader = document.createElement('h3');
        medidaHeader.textContent = 'Medida:';
        medidaHeader.style.display = 'inline-block';
        medidaHeader.style.marginRight = '10px';

        // Crear el input para "Medida"
        const medidaInput = document.createElement('input');
        medidaInput.setAttribute('type', 'text');
        medidaInput.setAttribute('placeholder', 'En caso de ser necesario');
        medidaInput.style.display = 'inline-block';
        medidaInput.value = inputVals[3].value

        // Agregar los elementos al contenedor principal y al contenedor de "Color" y "Medida"
        cardPregFrec.appendChild(descripcionHeader);
        cardPregFrec.appendChild(descripcionInput);
        cardPregFrec.appendChild(cantidadHeader);
        cardPregFrec.appendChild(cantidadInput);
        colorMedidaContainer.appendChild(colorHeader);
        colorMedidaContainer.appendChild(colorInput);
        colorMedidaContainer.appendChild(medidaHeader);
        colorMedidaContainer.appendChild(medidaInput);
        cardPregFrec.appendChild(colorMedidaContainer);

        res.push(cardPregFrec)
    })

    if(agregar){
        // Crear el contenedor principal
        const cardPregFrec = document.createElement('div');
        cardPregFrec.classList.add('card-preg-frec');

        // Crear el elemento <h3> para "Descripcion"
        const descripcionHeader = document.createElement('h3');
        descripcionHeader.textContent = 'Descripcion:';
        descripcionHeader.style.display = 'inline-block';
        descripcionHeader.style.marginRight = '10px';

        // Crear el input para "Descripcion"
        const descripcionInput = document.createElement('input');
        descripcionInput.setAttribute('type', 'text');
        descripcionInput.setAttribute('placeholder', 'Ingrese artículo');
        descripcionInput.style.display = 'inline-block';
        descripcionInput.style.marginRight = '10px';
        
        // Crear el elemento <h3> para "Cantidad"
        const cantidadHeader = document.createElement('h3');
        cantidadHeader.textContent = 'Cantidad:';
        cantidadHeader.style.display = 'inline-block';
        cantidadHeader.style.marginRight = '10px';

        // Crear el input para "Cantidad"
        const cantidadInput = document.createElement('input');
        cantidadInput.setAttribute('type', 'text');
        cantidadInput.setAttribute('placeholder', 'Ingrese cantidad');
        cantidadInput.style.display = 'inline-block';

        // Crear el contenedor para "Color" y "Medida"
        const colorMedidaContainer = document.createElement('div');
        colorMedidaContainer.style.display = 'inline-block';

        // Crear el elemento <h3> para "Color"
        const colorHeader = document.createElement('h3');
        colorHeader.textContent = 'Color:';
        colorHeader.style.display = 'inline-block';
        colorHeader.style.marginRight = '10px';
        colorHeader.style.marginTop = '10px';

        // Crear el input para "Color"
        const colorInput = document.createElement('input');
        colorInput.setAttribute('type', 'text');
        colorInput.setAttribute('placeholder', 'En caso de ser necesario');
        colorInput.style.display = 'inline-block';
        colorInput.style.marginRight = '10px';

        // Crear el elemento <h3> para "Medida"
        const medidaHeader = document.createElement('h3');
        medidaHeader.textContent = 'Medida:';
        medidaHeader.style.display = 'inline-block';
        medidaHeader.style.marginRight = '10px';

        // Crear el input para "Medida"
        const medidaInput = document.createElement('input');
        medidaInput.setAttribute('type', 'text');
        medidaInput.setAttribute('placeholder', 'En caso de ser necesario');
        medidaInput.style.display = 'inline-block';

        // Agregar los elementos al contenedor principal y al contenedor de "Color" y "Medida"
        cardPregFrec.appendChild(descripcionHeader);
        cardPregFrec.appendChild(descripcionInput);
        cardPregFrec.appendChild(cantidadHeader);
        cardPregFrec.appendChild(cantidadInput);
        colorMedidaContainer.appendChild(colorHeader);
        colorMedidaContainer.appendChild(colorInput);
        colorMedidaContainer.appendChild(medidaHeader);
        colorMedidaContainer.appendChild(medidaInput);
        cardPregFrec.appendChild(colorMedidaContainer);

        res.push(cardPregFrec)

    }
    
    return res
}

function crearFormulario(){
    // Crear el contenedor principal
const borrarArtContainer = document.createElement('div');
borrarArtContainer.id = 'borrarArt';

// Crear el elemento <h3> para "Sumar Artículo"
const agregarArticuloHeader = document.createElement('h3');
agregarArticuloHeader.classList.add('agregar-articulo');
agregarArticuloHeader.style.display = 'inline-block';
agregarArticuloHeader.textContent = 'Sumar Artículo:';

// Crear el div para "mas"
const masDiv = document.createElement('div');
masDiv.classList.add('mas', 'agregar-articulo');
masDiv.style.display = 'inline-block';
masDiv.style.margin ="-8px 10px"

// Crear el div para "menos"
const menosDiv = document.createElement('div');
menosDiv.classList.add('menos', 'borrar-articulo');
menosDiv.style.display = 'inline-block';
menosDiv.style.margin ="-8px 10px"

// Agregar los elementos al contenedor principal
borrarArtContainer.appendChild(agregarArticuloHeader);
borrarArtContainer.appendChild(masDiv);
borrarArtContainer.appendChild(menosDiv);

// Crear el contenedor para "formulario-contacto"
const formularioContactoContainer = document.createElement('div');
formularioContactoContainer.id = 'formulario-contacto';

// Crear los elementos para "Nombre"
const nombreHeader = document.createElement('h3');
nombreHeader.textContent = 'Nombre:';

const nombreInput = document.createElement('input');
nombreInput.setAttribute('type', 'text');
nombreInput.setAttribute('placeholder', 'Ingrese nombre');

// Crear los elementos para "Forma de contacto"
const formaContactoHeader = document.createElement('h3');
formaContactoHeader.textContent = 'Forma de contacto:';

const whatsappHeader = document.createElement('h3');
whatsappHeader.textContent = 'whatsapp:';

const whatsappInput = document.createElement('input');
whatsappInput.setAttribute('type', 'text');
whatsappInput.setAttribute('placeholder', 'Ingrese número');

const mailHeader = document.createElement('h3');
mailHeader.textContent = 'mail:';

const mailInput = document.createElement('input');
mailInput.setAttribute('type', 'text');
mailInput.setAttribute('placeholder', 'Ingrese e-mail');

const formaContactoRadioHeader = document.createElement('h3');
formaContactoRadioHeader.textContent = 'Es para retirar o envío?:';

const retiroHeader = document.createElement('h3');
retiroHeader.textContent = 'retiro';

const retiroInput = document.createElement('input');
retiroInput.classList.add('form-check-input');
retiroInput.setAttribute('type', 'radio');
retiroInput.setAttribute('name', 'formaContacto');
retiroInput.setAttribute('id', 'retira');

const envioHeader = document.createElement('h3');
envioHeader.textContent = 'envio';

const envioInput = document.createElement('input');
envioInput.classList.add('form-check-input');
envioInput.setAttribute('type', 'radio');
envioInput.setAttribute('name', 'formaContacto');
envioInput.setAttribute('id', 'envio');

const ingresarEnvioContainer = document.createElement('div');
ingresarEnvioContainer.id = 'ingresar-envio';
ingresarEnvioContainer.style.display = 'none';

const direccionHeader = document.createElement('h3');
direccionHeader.textContent = 'Direccion:';

const direccionInput = document.createElement('input');
direccionInput.classList.add('form-check-input');
direccionInput.setAttribute('type', 'text');
direccionInput.setAttribute('name', 'direccion');
direccionInput.setAttribute('id', 'direccion');

const localidadHeader = document.createElement('h3');
localidadHeader.textContent = 'Localidad:';

const localidadInput = document.createElement('input');
localidadInput.classList.add('form-check-input');
localidadInput.setAttribute('type', 'text');
localidadInput.setAttribute('name', 'localidad');
localidadInput.setAttribute('id', 'localidad');

const observacionesHeader = document.createElement('h3');
observacionesHeader.textContent = 'Observaciones:';

const observacionesTextarea = document.createElement('textarea');
observacionesTextarea.setAttribute('name', 'observaciones');
observacionesTextarea.setAttribute('id', 'observaciones');
observacionesTextarea.setAttribute('cols', '40');
observacionesTextarea.setAttribute('rows', '10');
observacionesTextarea.style.marginBottom = '38rem';

const enviarPedidoButton = document.createElement('button');
enviarPedidoButton.setAttribute('type', 'button');
enviarPedidoButton.classList.add('enviar-pedido', 'btn-primario');
enviarPedidoButton.style.width = 'auto';
enviarPedidoButton.textContent = 'ENVIAR PEDIDO';
enviarPedidoButton.style.marginLeft = "-243rem"

// Agregar los elementos al contenedor del formulario
formularioContactoContainer.appendChild(nombreHeader);
formularioContactoContainer.appendChild(nombreInput);
formularioContactoContainer.appendChild(formaContactoHeader);
formularioContactoContainer.appendChild(whatsappHeader);
formularioContactoContainer.appendChild(whatsappInput);
formularioContactoContainer.appendChild(mailHeader);
formularioContactoContainer.appendChild(mailInput);
formularioContactoContainer.appendChild(formaContactoRadioHeader);
formularioContactoContainer.appendChild(retiroHeader);
formularioContactoContainer.appendChild(retiroInput);
formularioContactoContainer.appendChild(envioHeader);
formularioContactoContainer.appendChild(envioInput);
formularioContactoContainer.appendChild(ingresarEnvioContainer);
ingresarEnvioContainer.appendChild(direccionHeader);
ingresarEnvioContainer.appendChild(direccionInput);
ingresarEnvioContainer.appendChild(localidadHeader);
ingresarEnvioContainer.appendChild(localidadInput);
borrarArtContainer.appendChild(formularioContactoContainer);
borrarArtContainer.appendChild(observacionesHeader);
borrarArtContainer.appendChild(observacionesTextarea);
borrarArtContainer.appendChild(enviarPedidoButton);

return borrarArtContainer
}

/*TODO: 
-- ALERTS DE ERRORES (completado parcial solo descripcion y cantidades) 
-- falta alert errores en campo de datos cliente ver si se puede redondear en  rojo
-- mover la pantalla al lugar del error o exito
-- PANTALLA DE EXITO*/

