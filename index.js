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

app.use(express.json());

//crear rutas

app.get("/", (req, res) => {
    return res.status(200).send("<h1>Empezando a crear una api rest con node</h1>")
})

app.get("/probando", (req, res) => {
    console.log("se ha ejecutado el endpoint probando");
    return res.status(200).send([{
        curso: "master en react",
        autor: "Victor Robles Web",
        url: "victorroblesweb.es/master-react"
    },
    {
        curso: "Api Rest",
        autor: "Victor Robles Web",
        url: "victorroblesweb.es/api-rest"
    }])
})

//crear servidor y escuchar peticiones http

app.listen(puerto, () => {
    console.log("servidor corriendo en el puerto " + puerto);
});