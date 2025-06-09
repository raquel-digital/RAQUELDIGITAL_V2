document.addEventListener('DOMContentLoaded', () => {  

  document.getElementById('envio').addEventListener('click', e => {
    cliente.retira = "Por Envio"
    document.querySelector('.datos-envio').style.display = 'block';
    document.getElementById("efectivoDIV").style.display = 'none';
  });
  document.getElementById('retiro').addEventListener('click', e => {
    cliente.retira = "Retira en local"
    document.querySelector('.datos-envio').style.display = 'none';
    document.getElementById("efectivoDIV").style.display = 'block';
  });

  // Seleccionar todos los elementos con clase fake-select
  const fakeSelects = document.querySelectorAll('.fake-select');

  fakeSelects.forEach(fakeSelect => {
    // Añadir evento de clic al elemento fake-select
    fakeSelect.addEventListener('click', (e) => {
      // Alternar la clase open
      fakeSelect.classList.toggle('open');

      // Cerrar otros desplegables abiertos
      fakeSelects.forEach(otherSelect => {
        if (otherSelect !== fakeSelect && otherSelect.classList.contains('open')) {
          otherSelect.classList.remove('open');
        }
      });

      e.stopPropagation(); // Evitar que el evento se propague
    });

    // Manejar la selección de una opción
    document.getElementById("select-provincia").addEventListener('click', e => {
      if(e.target.classList.contains("seleccionProv")){
        const selectedText = e.target.textContent.trim();       

        document.getElementById("provText").textContent = selectedText;
        costoEnvio(selectedText)

        if (selectedText != "Ciudad Autonoma De Bs As") {
          document.getElementById("envio-caba").style.display = "none";
          document.getElementById("localidad").style.display = "block";
          //cargamos la localidades
          provinciasLocalidades.forEach(e => {
            if (e.provincia == selectedText) {
              document.getElementById("ulLocalidad").innerHTML = "";
              document.getElementById("locText").textContent = "Seleccioná la localidad";
                document.getElementById("ulLocalidad").innerHTML += e.localidades;
            }
          }) 
        }
        if (selectedText == "Ciudad Autonoma De Bs As") {
          cliente.vamosAEnviar = "Por Moto"
          document.getElementById("localidad").style.display = "none";
          document.getElementById("locText").textContent = "Seleccioná la localidad";
          document.querySelector(".datos-expreso").style.display = "none";          
          document.querySelector(".datos-correo-argentino").style.display = "none"          
          document.getElementById("envio-caba").style.display = "block";
          //ocultar opcion expreso y correo
          document.getElementById("checkout-radiobuttons-opciones-envio").style.display = "none";
          document.querySelector("#expreso").checked = false; 
          document.querySelector("#correo-argentino").checked = false;
        }
        fakeSelect.classList.remove('open');
      }
    })
  });
  document.getElementById("select-localidad").addEventListener('click', e => {
      if(e.target.classList.contains("seleccionLoc")){
        const selectedText = e.target.textContent.trim();
        if(selectedText == "Seleccione su localidad") {
          document.getElementById("checkout-radiobuttons-opciones-envio").style.display = "none";
          document.getElementById("datos-correo-argentino").style.display = "none";
          return
        }
        document.getElementById("locText").textContent = selectedText;
        document.getElementById("checkout-radiobuttons-opciones-envio").style.display = "block";
      }
    })

    //correo y expreso
  document.getElementById("correo-argentino").addEventListener('click', e => {
    cliente.vamosAEnviar = "Correo Argentino"
    document.querySelector(".datos-correo-argentino").style.display = "block"; 
    document.querySelector(".datos-expreso").style.display = "none"; 
  });
  document.getElementById("expreso").addEventListener('click', e => {
    cliente.vamosAEnviar = "expreso"
    document.querySelector(".datos-correo-argentino").style.display = "none"; 
    document.querySelector(".datos-expreso").style.display = "block"; 
  });
  

  // Cerrar todos los desplegables al hacer clic fuera
  document.addEventListener('click', (e) => {
    const mouse = e.target
    if (!mouse.closest('.fake-select')) {
      fakeSelects.forEach(fakeSelect => {
        fakeSelect.classList.remove('open');
      });
    }
    //CONTACTO    
    if (mouse.id == "whatsapp") {
      document.querySelector("#emailInput").style.display = "none";
      document.querySelector("#tel-fijoInput").style.display = "none";

      document.querySelector("#whatsappInput").style.display = "block";
    }
    if (mouse.id == "email") {      
      document.querySelector("#tel-fijoInput").style.display = "none";
      document.querySelector("#whatsappInput").style.display = "none";
      
      document.querySelector("#emailInput").style.display = "block";
    }
    if (mouse.id == "tel-fijo") {      
      document.querySelector("#emailInput").style.display = "none";
      document.querySelector("#whatsappInput").style.display = "none";
      
      document.querySelector("#tel-fijoInput").style.display = "block";
    }
    //CONSUMIDOR FINAL
    if (mouse.id == "consumidor-final") {       
      document.querySelector("#monotributistaInput").style.display = "none";
      document.querySelector("#iva-inscriptoInput").style.display = "none";
      document.querySelector("#exentoInput").style.display = "none";
    }
    if (mouse.id == "monotributista") {
      document.querySelector("#iva-inscriptoInput").style.display = "none";
      document.querySelector("#exentoInput").style.display = "none";

      document.querySelector("#monotributistaInput").style.display = "block";
    }
    if (mouse.id == "iva-inscripto") {
      document.querySelector("#monotributistaInput").style.display = "none";
      document.querySelector("#exentoInput").style.display = "none";

      document.querySelector("#iva-inscriptoInput").style.display = "block";
    }
    if (mouse.id == "exento") {
      document.querySelector("#monotributistaInput").style.display = "none";
      document.querySelector("#iva-inscriptoInput").style.display = "none";

      document.querySelector("#exentoInput").style.display = "block";
    }
    //forma de pago
    if (mouse.id == "transferencia") {      
      document.querySelector(".transferencia-bancaria").style.display = "block";
    }
    if (mouse.id == "mercadopago") {      
      document.querySelector(".transferencia-bancaria").style.display = "none";
    }
    if (mouse.id == "efectivo") {      
      document.querySelector(".transferencia-bancaria").style.display = "none";
    }
    if (mouse.id == "finalizarVenta") {      
      checkOut()
    }    
  });  
});







