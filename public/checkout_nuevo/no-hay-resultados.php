<!DOCTYPE html>
<html lang="es">
<head>
	<title>Casa Raquel</title>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="css/styles.css">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
	<meta name="keywords" content="HTML, CSS, JavaScript">
	<meta name="description" content="Free Web tutorials">
	<meta name="author" content="Casa Raquel">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
	<?php include("includes/header.php"); ?>
	<div class="contenedor-principal">
		<nav>
			<h2>Categorías</h2>
			<button type="button">Elige una categoría</button>
			<ul>
				<li><a href="">Abrojos</a></li>
				<li><a class="categoria-elegida" href="">Alfileres y Agujas</a></li>
				<li><a href="">Aplicaciones</a></li>
				<li><a href="">Bordado</a></li>
				<li><a href="">Botones y Broches</a></li>
				<li><a href="">Brillos</a></li>
				<li><a href="">Cierres</a></li>
				<li><a href="">Cintas</a></li>
				<li><a href="">Cordones</a></li>
				<li><a href="">Costura</a></li>
				<li><a href="">Elásticos</a></li>
				<li><a href="">Flores</a></li>
				<li><a href="">Herrajes</a></li>
				<li><a href="">Herramientas</a></li>
				<li><a href="">Hilos</a></li>
				<li><a href="">Indumentaria</a></li>
				<li><a href="">Lanas</a></li>
				<li><a href="">Manualidades</a></li>
				<li><a href="">Matrices e Insumos</a></li>
				<li><a href="">Puntillas</a></li>
				<li><a href="">Tapices</a></li>
				<li><a href="">Telares</a></li>
				<li><a href="">Otros</a></li>
			</ul>
		</nav>
		<main>
			<h1>No hay resultados de búsqueda para <span class="resultado-busqueda">“Crochettina”</span></h1>
			<div class="sin-resultados">
				<p>Intentá con otra palabra o navegá por las categorías para encontrar el artículo que buscás.</p>
				<button type="button" class="btn-primario">Volver al inicio</button>
			</div>
		</main>
	</div>
	<?php include("includes/footer.php"); ?>
	<a href="https://api.whatsapp.com/send?phone=5491136933250" target="_blank" class="whatsapp-float"><img src="img/whatsapp.svg" alt="Whatsapp" /></a>

</body>
</html>