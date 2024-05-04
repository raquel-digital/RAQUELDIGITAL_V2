//categorias
document.querySelector("#select-categ").addEventListener('click', event=>{
    const mouse = event.target.tagName;
    let inMobile = false
    if(mouse == "A"){
        window.location = "https://raqueldigital.herokuapp.com/categoria?categ=" + event.target.textContent;
    }else{
      if(inMobile){
        const barraCateg = document.getElementById("barra-categorias")
        barraCateg.style.display = "none"
        inMobile = false
      }
    }
    //dropdown categorias (en responsive)
    if(event.target.classList.contains("cruz")){
      event.target.classList.remove("cruz")
      const barraCateg = document.getElementById("barra-categorias")
      barraCateg.style.display = "none"
      return
    }
    if(event.target.id == "elegir-categorias"){
      inMobile = true    
      event.target.classList.add("cruz")    
      const barraCateg = document.getElementById("barra-categorias")
      barraCateg.style.display = "block"
      return
    } 
   
  })