const paginador = document.querySelector(".paginador")


document.querySelector("main h1").innerHTML = ""
mostrador.innerHTML = `
<div class="card-articulo card-art-sk">
<div class="contenedor-img-articulo-sk"></div>
<div class="contenedor-info-articulo">
  <div class="h3-sk"></div>
  <p class="info-gral-articulo-sk"></p>
  <div class="descripcion-titulo-sk"></div>
  <div class="precio-cantidad">
    <div class="precio-card">
      <p class="precio-sk"></p>
      <p class="unidades-sk"></p>
    </div>
    <div class="cantidad-card">
      <div class="signo-sk"></div>
      <div class="input-number-sk"></div>
      <div class="signo-sk"></div>
    </div>
  </div>
  <button type="button" class="btn-primario-sk"></button>
</div>
</div>
<div class="card-articulo card-art-sk">
<div class="contenedor-img-articulo-sk"></div>
<div class="contenedor-info-articulo">
  <div class="h3-sk"></div>
  <p class="info-gral-articulo-sk"></p>
  <div class="descripcion-titulo-sk"></div>
  <div class="precio-cantidad">
    <div class="precio-card">
      <p class="precio-sk"></p>
      <p class="unidades-sk"></p>
    </div>
    <div class="cantidad-card">
      <div class="signo-sk"></div>
      <div class="input-number-sk"></div>
      <div class="signo-sk"></div>
    </div>
  </div>
  <button type="button" class="btn-primario-sk"></button>
</div>
</div>
<div class="card-articulo card-art-sk">
<div class="contenedor-img-articulo-sk"></div>
<div class="contenedor-info-articulo">
  <div class="h3-sk"></div>
  <p class="info-gral-articulo-sk"></p>
  <div class="descripcion-titulo-sk"></div>
  <div class="precio-cantidad">
    <div class="precio-card">
      <p class="precio-sk"></p>
      <p class="unidades-sk"></p>
    </div>
    <div class="cantidad-card">
      <div class="signo-sk"></div>
      <div class="input-number-sk"></div>
      <div class="signo-sk"></div>
    </div>
  </div>
  <button type="button" class="btn-primario-sk"></button>
</div>
</div>
<div class="card-articulo card-art-sk">
<div class="contenedor-img-articulo-sk"></div>
<div class="contenedor-info-articulo">
  <div class="h3-sk"></div>
  <p class="info-gral-articulo-sk"></p>
  <div class="descripcion-titulo-sk"></div>
  <div class="precio-cantidad">
    <div class="precio-card">
      <p class="precio-sk"></p>
      <p class="unidades-sk"></p>
    </div>
    <div class="cantidad-card">
      <div class="signo-sk"></div>
      <div class="input-number-sk"></div>
      <div class="signo-sk"></div>
    </div>
  </div>
  <button type="button" class="btn-primario-sk"></button>
</div>
</div>
<div class="card-articulo card-art-sk">
<div class="contenedor-img-articulo-sk"></div>
<div class="contenedor-info-articulo">
  <div class="h3-sk"></div>
  <p class="info-gral-articulo-sk"></p>
  <div class="descripcion-titulo-sk"></div>
  <div class="precio-cantidad">
    <div class="precio-card">
      <p class="precio-sk"></p>
      <p class="unidades-sk"></p>
    </div>
    <div class="cantidad-card">
      <div class="signo-sk"></div>
      <div class="input-number-sk"></div>
      <div class="signo-sk"></div>
    </div>
  </div>
  <button type="button" class="btn-primario-sk"></button>
</div>
</div>
<div class="card-articulo card-art-sk">
<div class="contenedor-img-articulo-sk"></div>
<div class="contenedor-info-articulo">
  <div class="h3-sk"></div>
  <p class="info-gral-articulo-sk"></p>
  <div class="descripcion-titulo-sk"></div>
  <div class="precio-cantidad">
    <div class="precio-card">
      <p class="precio-sk"></p>
      <p class="unidades-sk"></p>
    </div>
    <div class="cantidad-card">
      <div class="signo-sk"></div>
      <div class="input-number-sk"></div>
      <div class="signo-sk"></div>
    </div>
  </div>
  <button type="button" class="btn-primario-sk"></button>
</div>
`


document.addEventListener('DOMContentLoaded', () => {
    //local storage
    const carritoAnterior = JSON.parse(localStorage.getItem("carrito"))
    if(carritoAnterior){
        carritoAnterior.forEach(e => {
            ingresarCarrito(e)
        });
    }

    socket.on("categ-result", data => {
        if(data.succes){        
            mostrador.innerHTML = ""
            document.querySelector("main h1").textContent = data.categ
            mostradorDeArticulos = data.result.sort(function (a, b) {
              if (a.id > b.id) {
                return 1;
              }
              if (a.id < b.id) {
                return -1;
              }
              
              return 0;
            }).reverse();


            if(mostradorDeArticulos.length > indice){        
              crearPaginador(mostradorDeArticulos);
              tags(mostradorDeArticulos);
            }
            else{ 
              showArts(mostradorDeArticulos);
              tags(mostradorDeArticulos);
            } 

          const categoria = document.querySelectorAll("#select-categ ul li a")  
          categoria.forEach(e => {
            if(e.classList.contains("categoria-elegida")){
              e.classList.remove("categoria-elegida")
            }
            if(e.textContent == data.categ){              
              e.classList.add("categoria-elegida")
            } 
          })
                
        }else{
            alert("Categoria no valida")
        }    
    });

    socket.on("tag-result", tag => {
      const articulosTags = [];
      tag = tag.replaceAll(" ", "-");
      for(let p of mostradorDeArticulos){
        if(p.tags.includes(tag)){      
          articulosTags.push(p);
        }  
    }
      loadTag(articulosTags);
    });

    socket.on("resultado-vacio", () => {
      const barra =  document.getElementById("barra-busqueda")
      barra.classList.add("buscador-error")
    });
})

//Click sobre tags Filtros Tags
const filtros = document.querySelector(".filtros")
if(filtros){
    filtros.addEventListener('click', event=>{
        const mouse = event.target
        
        if(mouse.classList.contains("hashtag")){   
          
            mostrador.innerHTML = "";
          
            let articulosTags = []
            const clik = mouse.textContent;
            const clikTag = mouse.textContent.replaceAll(" ", "-");      
            
            for(let p of mostradorDeArticulos){ 
              p.tags = p.tags.replaceAll(" ", "-");
                                
                let codigo = p.tags;         
              
                if(codigo.includes(clikTag)){
                  articulosTags.push(p);
                }
          }
            
            loadTag(articulosTags, clik);
          }
    })
}

function tags(art){
  let tagCheck= []
  const botonera = document.querySelector(".filtros")
  botonera.innerHTML = `<h2 style="margin-bottom: 12rem;">Filtrar por:</h2>`;
  botonera.innerHTML += `<button type="button" class="tag hashtag tag-seleccionado">Todos</button>`;
  for(let t of art){  
          
        if(t.tags.includes(" ")){          
          const tagSplit = t.tags.split(" ");          
          tagSplit.forEach(e => {
            if(!tagCheck.includes(e) && t.tags != "" && e != "" && t.mostrar){
                tagCheck.push(e);
            }
          })
        }else{
          if(!tagCheck.includes(t.tags) && t.tags != "" && t.tags != " " && t.mostrar){
            tagCheck.push(t.tags);
         }
        }
        
  }
  tagCheck = tagCheck.sort()
  
  for(let t  of tagCheck){
    if(t.includes("-")){
      t = t.replaceAll("-", " ");
    }
    botonera.innerHTML += `<button type="button"  class="tag hashtag">${t}</button>`
  }
}

//Cargar TAGS de artículos
function loadTag(articulosTags, target){ 
//TODO EL TAG "TODOS" debe devolver la tottalidad de la categ
let nuevoQueryString
let queryString = window.location.search;

if(queryString.includes("tag")){
  const split = queryString.split("&")
  nuevoQueryString = split[0] + "&tag="+target;
}else{
  nuevoQueryString = queryString + "&tag="+target;
}
// Actualizar la URL en la barra de direcciones sin recargar la página
window.history.replaceState({}, "", nuevoQueryString);

  const tags = document.querySelectorAll(".hashtag")
  tags.forEach(e => {        
      if(e.classList.contains("tag-seleccionado")){
          e.classList.remove("tag-seleccionado")
      }
      if(e.textContent == target){
          e.classList.add("tag-seleccionado")
      }
  })
  
  paginador.innerHTML = ""

  if(articulosTags.length > indice){                
      crearPaginador(articulosTags);
  }else{        
      showArts(articulosTags);
  }

  if(mostrador.innerHTML === ""){
    mostrador.innerHTML += `
        <h1>NO HAY RESULTADOS</h1>
        `
  }
}



  
