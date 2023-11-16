const {conexion} = require('./basedatos/conexion');

//inicializar la app
console.log("App de Node arrancada");

//conectar a la db
conexion();