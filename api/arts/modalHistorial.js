const mongoose = require('mongoose');

const schema = mongoose.Schema({
    id: { type: Number },
    fecha: { type: String },
    proveedor: [ { type: String } ],
    codigo: { type: String },
    color: { type: String },
    cantidad: { type: Number },
    estado: { type: String },
    observaciones: { type: String },
    presentacion: { type: String },
});

const model = mongoose.model(`Historial Ingreso Mercadería`, schema);

module.exports = model;