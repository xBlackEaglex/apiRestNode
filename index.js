const {conexion} = require('./basedatos/conexion');
const express = require('express');
const cors = require('cors');

//inicializar la app
console.log("App de Node arrancada");

//conectar a la db
conexion();

//crear servidor node

const app = express();
const puerto = 3900;

// configurar cors

app.use(cors());

// convertir body a objeto js

app.use(express.json());  // recibir datos con content-type app/json
app.use(express.urlencoded({ extended: true})); // form-urlencoded app/json


//Rutas

const rutas_articulos = require("./rutas/articulos");


// cargo las rutas

app.use("/api", rutas_articulos);


// Rutas prueba hardcodeadas 

app.get("/", (req, res) => {
    return res.status(200).send("<h1>Empezando a crear una api rest con node</h1>")
})

//crear servidor y escuchar peticiones http

app.listen(puerto, () => {
    console.log("servidor corriendo en el puerto " + puerto);
});