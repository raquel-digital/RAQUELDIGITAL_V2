let slideIndex = 1;
let autoSlideInterval;

// Mostrar el slide inicial
showSlides(slideIndex);

// Iniciar auto-slide
startAutoSlide();

// Control flechas
function plusSlides(n) {
  showSlides(slideIndex += n);
  resetAutoSlide();
}

// Control dots
function currentSlide(n) {
  showSlides(slideIndex = n);
  resetAutoSlide();
}

// Mostrar slide correspondiente
function showSlides(n) {
  let i;
  const slides = document.getElementsByClassName("img-carrousel");
  const dots = document.getElementsByClassName("dot");
  
  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

// Iniciar auto-slide
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    plusSlides(1);
  }, 4000);
}

// Reiniciar auto-slide después de interacción
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// Swipe en mobile
let startX = 0;
let endX = 0;

const carousel = document.querySelector(".carrousel-container");

if (carousel) {
  carousel.addEventListener("touchstart", function(e) {
    startX = e.touches[0].clientX;
  }, false);

  carousel.addEventListener("touchend", function(e) {
    endX = e.changedTouches[0].clientX;
    handleGesture();
  }, false);
}

function handleGesture() {
  if (window.innerWidth <= 600) {
    if (startX - endX > 50) {
      plusSlides(1); // Swipe izquierda
    } else if (endX - startX > 50) {
      plusSlides(-1); // Swipe derecha
    }
  }
}