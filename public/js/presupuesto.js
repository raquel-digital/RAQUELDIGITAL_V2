const socket = io.connect();

(async () => {
    try{

    const resBasico = await fetch("./system/presupuestos/presupuesto-basico.json")
    const codeBasico = await resBasico.json();
    const resMedio = await fetch("./system/presupuestos/presupuesto-medio.json")
    const codeMedio = await resMedio.json();
    const resPremium = await fetch("./system/presupuestos/presupuesto-premium.json")
    const codePremium = await resPremium.json();

    // const resAll = await fetch("./system/dir/allArts.json")
    // const art = await resAll.json()
    
    document.querySelector("body").addEventListener("click", e => {
        const mouse = e.target
        if(mouse.id ==  "presupuesto-basico"){
            writeTable(codeBasico, "PRESUPUESTO BASICO")
        }
        if(mouse.id ==  "presupuesto-mediano"){
            writeTable(codeMedio, "PRESUPUESTO MEDIANO")
        }
        if(mouse.id ==  "presupuesto-premium"){
            writeTable(codePremium, "PRESUPUESTO PREMIUM")
        }
        if(mouse.id == "boton-carrito"){
            if (typeof swal === 'undefined') {
                // Crea un nuevo elemento script
                var script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
                script.onload = function() {
                    // Llamada a SweetAlert después de que el script se haya cargado
                    Swal.fire({
                        title: "Queres sumar el presupuesto a tu carrito?",
                        text: "Luego podes modificarlo o agregar mas productos desde el mismo",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Si"
                      }).then((result) => {
                        if (result.isConfirmed) {
                          let carrito = JSON.parse(localStorage.getItem("carrito"))
                          if(carrito){
                              pedido.forEach(p => {
                                  let check = false
                                  carrito.forEach(c => {
                                      if(p.codigo == c.codigo){
                                          const cantidad = Number(c.cantidad) + Number(p.cantidad)
                                          c.cantidad = cantidad
                                          check = true
                                      }
                                  })
                                  if(!check){
                                      carrito.push(p)
                                  }
                              })
                              localStorage.setItem("carrito", JSON.stringify(carrito))
                          }else{
                              localStorage.setItem("carrito", JSON.stringify(pedido))
                          }
                          window.location.href = 'https://raqueldigital.herokuapp.com';
                        }
                      });
                };
                // Añade el script al documento
                document.head.appendChild(script);
            }            
        }
        if(mouse.classList.contains("borrar-presu")){          
            const codigo = mouse.classList[1]
            const filter = pedido.filter(e => e.codigo != codigo)
            writeTable(filter, document.getElementById("titulo").textContent)
          }
    })
    }catch(err){
        console.log(err)
    }
})()

const pedido = []
function writeTable(code, msg){
  pedido.length = 0  
  document.getElementById("titulo").textContent = msg  
  const show = document.querySelector("table")
  show.style.display = "block"  
  const showButton = document.getElementById("boton-carrito")
  showButton.style.display = "block"

  const table = document.querySelector(".resumen-check-out")
  table.innerHTML = ""
  let totalFinal = 0

  for(c of code){    
       const precioT = Number(c.precio)
       const cantidad = Number(c.cantidad)
       const total = precioT * cantidad
       totalFinal += total
        table.innerHTML += `<td><img src="${c.imagen}" alt="imagen table" widht="60px" height="60px"></td>
                            <td>${c.codigo}</td>
                            <td>${c.titulo}</td>
                            <td>${c.precio}</td>
                            <td>${c.cantidad}</td>
                            <td>${total.toFixed(2)}</td>
                            <td><p class="borrar-presu ${c.codigo}" style="color: red;">Borrar</p></td>
                            `
        pedido.push(
            {                    
                codigo: c.codigo,
                imagen: c.imagen,
                precio: precioT.toString(),
                titulo: c.titulo,
                cantidad: c.cantidad
            }
        )//nos llevamos el pedido para agregar al carrito
  }
  
  document.getElementById("total-encabezado").innerHTML = `<h1>EL TOTAL DEL PRESUPUESTO: $ ${totalFinal.toFixed(2)}</h1>`
  document.querySelector(".total-compra-final").innerHTML = `<td></td><td></td><td> <b>EL TOTAL PRESUPUESTADO: $ ${totalFinal.toFixed(2)}</b></td>`
}


  