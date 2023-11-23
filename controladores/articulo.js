const validator = require("validator");

const prueba = (req, res) => {
    return res.status(200).json({
        mesaje: "Soy una acicion de prueba de mi contolador de articulos"
    });
};

const curso = (req, res) => {
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
};

const crear = (req, res) => {

    // Recoger parámetros por post a guardar 

    let parametros = req.body;

    // validar datos

    try {

        let validar_titulo = !validator.isEmpty(parametros.titulo) && validator.isLength(parametros.titulo, {min: 5, max: undefined});
        let validar_contenido = !validator.isEmpty(parametros.contenido);

        if (!validar_contenido || !validar_titulo) {
            throw new Error("No se ha validado la informacion !!");
        }

    }catch(error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

    // crear el objeto a guardar 

    //asignar valores a objeto en el modelo (manual o automático)

    // Guardar el articulo en la base de datos

    // devolver resultado 

    return res.status(200).json({
        mensaje: "accion de guardar",
        parametros
    })
};

module.exports = {
    prueba,
    curso,
    crear
}