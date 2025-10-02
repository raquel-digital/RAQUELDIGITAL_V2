function ingresosMercaderia() { 
   mostrador.innerHTML = `
      <input type="text" class="actuIngresos" style="width:100%;height:100px" placeholder="ingresar codigo y precio"  >
      <button type="button" class="btn btn-warning" onclick="procesarIngresos()">enviar</button>
      `  
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
        const colorRaw = line.match(/Color:\s*([^|]+)/)?.[1]?.trim() || "";
        const descripcion = line.split("||")[1]?.trim() || "";

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




