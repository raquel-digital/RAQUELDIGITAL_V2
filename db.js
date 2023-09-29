const db = require("mongoose");

db.Promise = global.Promise;

async function connect(url) {
  try {

    // Configura strictQuery en false
    db.set('strictQuery', false);
    await db.connect(url, {
      useNewUrlParser: true, // Para evitar advertencias de deprecación
      useUnifiedTopology: true, // Habilita la administración de topología unificada
    });

    // Verifica la conexión a la base de datos
    const mongoConnect = db.connection;
    mongoConnect.once('open', () => {
      console.log("[ DB ] conectada");
    });

    console.log("[ DB ] conectada");
  } catch (error) {
    // Maneja el error de conexión aquí
    console.error("[ DB ] Error de conexión a MongoDB:", error);
  }
}

module.exports = connect;