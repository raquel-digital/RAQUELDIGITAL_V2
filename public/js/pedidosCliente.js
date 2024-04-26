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
    </div>
    <h3>Observaciones:</h3>
    <textarea name="observaciones" id="observaciones" cols="40" rows="10" style="margion-bottom:10rem;"></textarea>
`

const cardPedido = `
<div class="card-preg-frec">
    <h3>Descripcion:</h3>
    <input type="text" placeholder="ingrese articulo">
    <h3>Cantidad:</h3>
    <input type="text" placeholder="ingrese cantidad">
    <h3>Color:</h3>
    <input type="text" placeholder="ingrese en caso de ser necesario">
    <h3>Medida:</h3>
    <input type="text" placeholder="ingrese en caso de ser necesario">       
    </div>
    <div id="borrarArt"><h3 class="agregar-articulo">Sumar Artículo:</h3><div class="mas agregar-articulo""></div><div class="menos borrar-articulo""></div>
    ${formularioContacto}
    <button type="button" class="enviar-pedido btn-primario" style"width: 30%;">ENVIAR PEDIDO</button>    
    
</div>
`




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
        const borrar = document.getElementById("borrarArt")
        borrar.remove()
        document.querySelector(".contenedor-preg-frec").innerHTML += `
        ${cardPedido}
        `
    }
    if(mouse.classList.contains("borrar-articulo")){
        const arts = document.querySelectorAll(".card-preg-frec")
        const artsArray = Array.from(arts);
        artsArray.pop()
        const contenedor = document.querySelector(".contenedor-preg-frec")
        contenedor.innerHTML = ""
        artsArray.forEach(e => {
            contenedor.appendChild(e);
        })
        contenedor.innerHTML += `<div id="borrarArt"><h3 class="agregar-articulo">Sumar Artículo:</h3><div class="mas agregar-articulo""></div><div class="menos borrar-articulo""></div>${formularioContacto}<button type="button" class="enviar-pedido btn-primario" style"width: 30%;">ENVIAR PEDIDO</button></div>`
    }    
    if(mouse.classList.contains("enviar-pedido")){
        const arts = document.querySelectorAll(".card-preg-frec")
        const artsArray = Array.from(arts);
        const pedidos = []
        console.log(artsArray)
        artsArray.forEach(e => {
            const input = e.querySelectorAll("input")
            const inputVals = Array.from(input);
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
        const cliente = {
            nombre: inputFormVals[0].value,
            whatsapp: inputFormVals[1].value,
            mail: inputFormVals[2].value,
            retira: inputFormVals[3].checked,
            envio: inputFormVals[4].checked,
            pedido: pedidos,
            observaciones: document.getElementById("observaciones").value
        }
        socket.emit("pedido-plamilla", cliente)  
    }
})

//TODO campo observaciones ALERTS DE ERRORES -- PANTALLA DE EXITO

