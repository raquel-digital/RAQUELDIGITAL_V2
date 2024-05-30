const socket = io.connect();

(async () => {
    const resBasico = await fetch("./js/presupuesto-basico.json")
    const codeBasico = await resBasico.json();
    const resMedio = await fetch("./js/presupuesto-medio.json")
    const codeMedio = await resMedio.json();
    const resPremium = await fetch("./js/presupuesto-premium.json")
    const codePremium = await resPremium.json();


    const resAll = await fetch("./system/dir/allArts.json")
    const art = await resAll.json()
    

    document.querySelector("body").addEventListener("click", e => {
        const mouse = e.target
        if(mouse.id ==  "presupuesto-basico"){
            writeTable(art, codeBasico, "PRESUPUESTO BASICO")
        }
        if(mouse.id ==  "presupuesto-mediano"){
            writeTable(art, codeMedio, "PRESUPUESTO MEDIANO")
        }
        if(mouse.id ==  "presupuesto-premium"){
            writeTable(art, codePremium, "PRESUPUESTO PREMIUM")
        }
        if(mouse.id == "boton-carrito"){
            let carrito = localStorage.getItem("carrito")
            if(carrito){
                carrito = [...pedido]
                localStorage.setItem("carrito", JSON.stringify(carrito))
            }else{
                localStorage.setItem("carrito", JSON.stringify(pedido))
            }
        }
    })
})()

const pedido = []
function writeTable(art, code, msg){
  pedido.length = 0  
  document.getElementById("titulo").textContent = msg  
  const show = document.querySelector("table")
  show.style.display = "block"  
  const showButton = document.getElementById("boton-carrito")
  showButton.style.display = "block"

  const table = document.querySelector(".resumen-check-out")
  let totalFinal = 0

  for(c of code){
    for(a of art){
        const code = c.CODIGO.toUpperCase()
        if(code === a.codigo){
           const precioT = Number(a.precio.replace(",", "."))
           const cantidad = Number(c.CANTIDAD.replace(",", "."))
           const total = precioT * cantidad
           totalFinal += total
            table.innerHTML += `<td><img src="./img/${a.categorias}/${a.imagendetalle}" alt="imagen table" widht="60px" height="60px"></td>
                                <td>${a.codigo}</td>
                                <td>${a.nombre}</td>
                                <td>${a.precioT}</td>
                                <td>${c.CANTIDAD}</td>
                                <td>${total.toFixed(2)}</td>
                                `
            pedido.push(
                {                    
                    codigo: a.codigo,
                    imagen: "/img/" + a.categorias + "/" + a.imagendetalle,
                    precio: precioT.toString(),
                    titulo: a.nombre,
                    cantidad: c.CANTIDAD
                }
            )//nos llevamos el pedido para agregar al carrito
        
        }
    }
  }

  document.querySelector(".total-compra-final").innerHTML = `<td></td><td></td><td> <b>EL TOTAL PRESUPUESTADO: $ ${totalFinal.toFixed(2)}</b></td>`
}


  