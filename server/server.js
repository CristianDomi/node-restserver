require("./config/config.js")

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Configuracion global de rutas
app.use(require('./routes/index.js'));

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))

mongoose.connect(process.env.URLDB, (err, resp) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
})