function showArts(art, message){
    
    mostrador.innerHTML = "";

    if(message){
      mostrador.innerHTML = message; 
    }
    art.forEach(p => {
      
      if(p.mostrar){
        
          if(isNaN(p.precio)){
           if(p.precio == String || p.precio.includes(",")){          
            p.precio = p.precio.replace(",", ".");
            p.precio = Number(p.precio); 
           }
          }          
             //<img src="/img/${p.categorias}/${p.imagendetalle}">
        const imagen = "/img/" + p.categorias + "/" + p.imagendetalle   
        
        mostrador.innerHTML += `
        <div class="card-articulo">
            <div id=${p.codigo+"imagen"} class="contenedor-img-articulo" style="background-image:url(${imagen});">
                        
            </div>
            <div class="contenedor-info-articulo">
              <h3>${p.nombre}</h3>
              <p class="info-gral-articulo">${p.nombre2}</p>
              <div class="descripcion-titulo">
                <p>Ver descripción</p>
                <button type="button" class="chevron"></button>
              </div>
              <p class="descripcion-texto" style="display:none;">${p.descripcion}<br/><span>Código:</span> ${p.codigo}<br/><span>Unidad de venta:</span> ${p.CantidadDeVenta}</p>
              <div class="precio-cantidad">
                <div class="precio-card">
                  <p>$${p.precio}</p>
                  <p>${p.CantidadDeVenta}</p>
                </div>
                <div class="cantidad-card">
                  <button type="button" class="menos"></button>
                  <input type="number" value="1">
                  <button type="button" class="mas"></button>
                </div>
              </div>
              <button id="articulo-compra" type="button" class="btn-primario ${p.codigo} articulo-compra">Agregar al carrito</button>
            </div>
          </div>
        `

        const boton = document.querySelector("." + p.codigo);
        boton.setAttribute("codigo", p.codigo);
        boton.setAttribute("precio", p.precio);
        boton.setAttribute("nombre", p.nombre);
        boton.setAttribute("imagen", imagen);
        const modalImagen = document.querySelector("#" + p.codigo + "imagen");
        modalImagen.setAttribute("imagen", imagen);
        modalImagen.setAttribute("nombre", p.nombre);
        
        const checkTalle = p.colores.filter(e => e.codigo.includes("talle"))
        //detectar carta de colores
        if(p.colores.length > 0){
          boton.setAttribute("colores", JSON.stringify(p.colores))
          if(checkTalle.length > 0){
            boton.textContent = "Seleccionar Medida"
          }else{            
            boton.textContent = "Ver Carta De Colores"
          }
        }
      } 
      
    });

mostrador.addEventListener('click', event=>{
    let mouse = event.target;
    if(mouse.classList.contains('botonComprar')){
      const precioValue = mouse.value;
      let titulo = mouse.parentElement.parentElement.childNodes[3].childNodes[1].textContent;     
      let precio = parseFloat(precioValue).toFixed(2);
      
      let codigo = mouse.parentElement.parentElement.childNodes[3].childNodes[7].childNodes[4].textContent;
      codigo = codigo.split(" ")
      codigo = codigo[codigo.length-1];
      
      let cantidad = mouse.parentElement.parentElement.childNodes[3].childNodes[5].childNodes[1].childNodes[5].value;
      cantidad = parseInt(cantidad);
      let imagen = mouse.parentElement.parentElement.childNodes[1].src      
      const articulo = {codigo: codigo, titulo: titulo, precio: precio, cantidad: cantidad, imagen: imagen}
      
      //checkColores(articulo);
    }    
    if(mouse.classList.contains('fa-plus-circle')){
      let cantidad = mouse.parentElement.previousElementSibling.value++;
    }  
    if(mouse.classList.contains('fa-minus-circle')){    
      let cantidad = mouse.parentElement.previousElementSibling.value;
      if(cantidad > 1){
        cantidad = mouse.parentElement.previousElementSibling.value--;
      }
    }

    if(mouse.classList.contains('fqa')){
      barraFQA(mouse);
    }
  })
  stopEmits = false
}
