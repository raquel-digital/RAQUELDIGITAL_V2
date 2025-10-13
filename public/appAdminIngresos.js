function ingresosMercaderia() { 
   mostrador.innerHTML = `
      <input type="text" class="actuIngresos" style="width:100%;height:100px" placeholder="ingresar codigo y precio"  >
      <button type="button" class="btn btn-warning" onclick="procesarIngresos()">enviar</button>
      <hr>
      <h1>Ingreso por fecha</h1>
      <input type="date" id="fechaInicio">
<input type="date" id="fechaFin">
<button id="generar">Generar Fechas</button>

      `  
        const hoy = new Date().toISOString().split('T')[0];        
        const finInput = document.getElementById('fechaFin');
        finInput.value = hoy;

      document.getElementById('generar').addEventListener('click', () => {
        const inicio = new Date(document.getElementById('fechaInicio').value);
        const fin = new Date(document.getElementById('fechaFin').value);

        if (isNaN(inicio) || isNaN(fin) || inicio > fin) {
        console.log('Fechas inválidas');
        return;
        }

        const fechas = [];
        let actual = new Date(inicio);
        while (actual <= fin) {
        const dia = actual.getDate().toString().padStart(2, '0');
        const mes = (actual.getMonth() + 1).toString().padStart(2, '0');
        const año = actual.getFullYear();
        fechas.push(`${dia}/${mes}/${año}`);
        actual.setDate(actual.getDate() + 1);
        }

        console.log(fechas);
    });
}



function procesarIngresos() {
    const ingresos = document.querySelector(".actuIngresos").value
    const data = procesaDataIngresos(ingresos)
    if(data){
        dibujarTable(data)
    }
}

function procesaDataIngresos(data) {
    
    const lineas = data.split(/(?=Fecha:)/).filter(l => l.trim());

    const objetos = lineas.map(line => {
        const fecha = line.match(/Fecha:\s*([^,]+)/)?.[1]?.trim() || "";
        const codigo = line.match(/Codigo:\s*([A-Z0-9]+)/)?.[1] || "";
        const cantidad = parseInt(line.match(/Cantidad:\s*(\d+)/)?.[1] || "0", 10);        
        const descripcion = line.split("||")[1]?.trim() || "";
        const colorRaw = line.match(/Color:\s*([^|]+)/)?.[1]?.trim() || "";

        const colores = colorRaw
            ? colorRaw.split(/[\/]/).map(c => c.replace(/X\d+$/,"").trim()).filter(c => c.length > 0)
            : [];

        return { fecha, codigo, cantidad, colores, descripcion };
    });
  
 return objetos
}

function  dibujarTable(data) {
    mostrador.innerHTML = `
      <h1>Articulos para mostrar</h1>
      <table class="table table-bordered table-hover">
        <thead>
            <tr>
                <th>codigo</th>
                <th>Estado</th>
            </tr>
            </thead>
            <tbody id="ingresosEnTabla">
            
            </tbody>
            <tfoot >
            <tr class="total-compra-final">
                
            </tr>
            </tfoot>
    </table>
    <h1>Articulos no encontrados</h1>
      <table class="table table-bordered table-hover">
        <thead>
            <tr>
                <th>codigo</th>
                <th>Estado</th>
            </tr>
            </thead>
            <tbody id="noencontradosEnTabla">
            
            </tbody>
            <tfoot >
            <tr class="total-compra-final">
                
            </tr>
            </tfoot>
    </table>
    `

    const encontrados = document.getElementById("ingresosEnTabla")
    const noEncontrados = document.getElementById("noencontradosEnTabla")

    const combinaciones = data
    .filter(obj => obj.colores.length > 0) // solo los que tienen colores
    .flatMap(obj => obj.colores.map(color => `${obj.codigo}-${color}`));
    
    
    (async () => {
        try {
            await fetch('./system/dir/allArts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('La solicitud no se pudo completar.');
                }
                return response.json();
            }).then(articulos => {
                console.log(combinaciones)                
                combinaciones.map( e => {
                    let check = false
                    const split = e.split("-")
                    const find = articulos.filter(f => f.codigo.includes(split[0]))
                    if(find.length > 0) {
                        find.forEach(f => {   
                                                     
                            if(f.colores && f.colores.length > 0){
                                f.colores.forEach(c =>{
                                    const splitCod = e.split("-").map(s => s.trim());
                                    if(c.codigo.includes(splitCod[1])){ 
                                        check = true                                       
                                        if(!c.mostrar){                                            
                                            encontrados.innerHTML += `<td>${e}</td><td>ENCONTRO COLOR</td><td>Carta Color</td>`
                                        }
                                    }                                    
                                })
                                return
                            }
                            if(f.codigo.includes("-")){                                                                                                                                                                   
                                    const splitCod = e.split("-").map(s => s.trim());
                                    const splitF = f.codigo.split("-")
                                    
                                    if(f.codigo.includes(splitCod[1])) {
                                        check = true                                                                                
                                        if(!f.mostrar){                                            
                                            encontrados.innerHTML += `<td>${e}</td><td>ENCONTRO EN LISTA -</td><td>Lista Directa</td>`
                                            return
                                        }                                       
                                    }
                                    
                                return                             
                            }
                        })
                        if(!check){   
                            if(e.includes("EL65") || e.includes("EL89")|| e.includes("EN65") || e.includes("EN89")){
                                return
                            }                                                             
                            noEncontrados.innerHTML += `<td>${e}</td><td>Esta en lista pero no con ese color</td>`
                        }
                        return
                    }else{                        
                        noEncontrados.innerHTML += `<td>${e}</td><td>NO EXISTE EN FIND</td>`
                    }

                })
            })       
            
        } catch (err) {
            console.error('Error:', err);
        }
    })()    
}

function historialIngresos(){
  socket.emit("verHistorial");
}

socket.emit("verHistorial");
socket.on("ingresarHistorial-res", (data) => {    
    const hoy = new Date();
    const fechaFormateada = `${hoy.getDate() - 1}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;
    console.log(fechaFormateada);    
    
    let ingresosDelDia = data.filter(e => e.fecha == fechaFormateada) 
    if(ingresosDelDia.length == 0) {
        console.log("FECHA MES ANTERIOR " + `31/${hoy.getMonth()}/${hoy.getFullYear()}`);
        ingresosDelDia = data.filter(e => e.fecha == `31/${hoy.getMonth()}/${hoy.getFullYear()}`)        
        if(ingresosDelDia.length == 0) { 
            console.log("FECHA MES ANTERIOR 2do INTENTO" + `30/${hoy.getMonth()}/${hoy.getFullYear()}`);
            ingresosDelDia = data.filter(e => e.fecha == `30/${hoy.getMonth()}/${hoy.getFullYear()}`)
        }
    }

    dibujarTableIngresoServer(ingresosDelDia)
});

function  dibujarTableIngresoServer(data) {

    const mostrador = document.querySelector(".result");
    console.log(data)
    if(data.length == 0) {
         mostrador.innerHTML += `<hr><h1>NO HAY ARTICULOS PARA ACTUALIZAR</h1>`
        return
    }
    
    mostrador.innerHTML += `
      <h1>Articulos para mostrar</h1>
      <table class="table table-bordered table-hover">
        <thead>
            <tr>
                <th>codigo</th>
                <th>Estado</th>
            </tr>
            </thead>
            <tbody id="ingresosEnTabla">
            
            </tbody>
            <tfoot >
            <tr class="total-compra-final">
                
            </tr>
            </tfoot>
    </table>
    <h1>Articulos no encontrados</h1>
      <table class="table table-bordered table-hover">
        <thead>
            <tr>
                <th>codigo</th>
                <th>Estado</th>
            </tr>
            </thead>
            <tbody id="noencontradosEnTabla">
            
            </tbody>
            <tfoot >
            <tr class="total-compra-final">
                
            </tr>
            </tfoot>
    </table>
    `

    const encontrados = document.getElementById("ingresosEnTabla")
    const noEncontrados = document.getElementById("noencontradosEnTabla")

    
    data.forEach(obj => {
    if (obj.color && typeof obj.color === 'string') {
        obj.color = obj.color.split('/').map(c => c.trim());
    }
    });

    const combinaciones = data.filter(obj => obj.color.length > 0) // solo los que tienen colores
    .flatMap(obj => obj.color.map(color => `${obj.codigo}-${color}`));

    (async () => {
        try {
            await fetch('./system/dir/allArts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('La solicitud no se pudo completar.');
                }
                return response.json();
            }).then(articulos => {
                console.log(combinaciones)                
                combinaciones.map( e => {
                    let check = false                    
                    const split = e.split("-")
                    const find = articulos.filter(f => f.codigo.includes(split[0]))
                    if(find.length > 0) {
                        find.forEach(f => {   
                                                     
                            if(f.colores && f.colores.length > 0){
                                f.colores.forEach(c =>{
                                    const splitCod = e.split("-").map(s => s.trim());
                                    if(c.codigo.includes(splitCod[1])){ 
                                        check = true                                       
                                        if(!c.mostrar){                                            
                                            encontrados.innerHTML += `<td>${e}</td><td>ENCONTRO COLOR</td><td>Carta Color</td>`
                                        }
                                    }                                    
                                })
                                return
                            }
                            if(f.codigo.includes("-")){                                                                                                                                                                   
                                    const splitCod = e.split("-").map(s => s.trim());
                                    const splitF = f.codigo.split("-")
                                    
                                    if(f.codigo.includes(splitCod[1])) {
                                        check = true                                                                                
                                        if(!f.mostrar){                                            
                                            encontrados.innerHTML += `<td>${e}</td><td>ENCONTRO EN LISTA -</td><td>Lista Directa</td>`
                                            return
                                        }                                       
                                    }
                                    
                                return                             
                            }
                        })
                        if(!check){   
                            if(e.includes("EL65") || e.includes("EL89")|| e.includes("EN65") || e.includes("EN89")){
                                return
                            }                                                             
                            noEncontrados.innerHTML += `<td>${e}</td><td>Esta en lista pero no con ese color</td>`
                        }
                        return
                    }else{                        
                        noEncontrados.innerHTML += `<td>${e}</td><td>NO EXISTE EN FIND</td>`
                    }

                })
            })       
            
        } catch (err) {
            console.error('Error:', err);
        }
    })()    
}




