const MongoClient = require('mongodb').MongoClient;

//CREAR INDICES

// Conecta a la base de datos

MongoClient.connect("mongodb+srv://raqueldigital:ultracapri123@raqueldigital.h42yt.mongodb.net/raqueldigital?authSource=admin&replicaSet=atlas-nr5wb1-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true", (err, client) => {
    if (err) throw err;

    // Obtiene la colección
    const collection = client.db('raqueldigital').collection('articulos');

    // Crea un índice en el campo 'categoria'
    // collection.createIndex({ categorias: 1 }, (err, result) => {
    //     if (err) throw err;

    //     console.log('Índice creado con éxito');
    //     client.close(); // Cierra la conexión
    // });

    //CHEQUEAR INDICES
    collection.indexes((err, indexes) => {
        if (err) throw err;
        console.log(indexes);
    });
});


