const { date } = require("mercadopago/lib/utils");
const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const schema = mongoose.Schema;

const newSchema = new schema({
    numero_orden: Number,
    fecha: String,    
    nombreApellido: String,
    retira: String,
    tipoDeEnvio: {                   
                   Altura: String, 
                   Calle: String, 
                   piso_departamento: String,
                   Costo: Number, 
                   Horario_Entrega: String,  
                   Provincia: String, 
                   Localidad: String, 
                   Empresa: String, 
                   DNI: String, 
                   CP: String, 
                   forma_de_envio: String,
                   observaciones: String
                  },
    formaDeContacto: {contacto: String, numero: String},
    facturacion: {CUIT: String, RazonSocial: String, tipo: String},
    formaDePago: String,
    compra: [
        {
          codigo: String,
          titulo: String,
          precio: Number,
          cantidad: Number,
          imagen: String
        }
      ],
    observaciones: String  
})

const model = mongoose.model("user", newSchema);

module.exports = model;