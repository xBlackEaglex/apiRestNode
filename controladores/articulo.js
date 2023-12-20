const validator = require("validator");
const Articulo = require("../modelos/Articulo");

const prueba = (req, res) => {
    return res.status(200).json({
        mesaje: "Soy una acicion de prueba de mi controlador de articulos"
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

const crear = async (req, res) => {

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

    const articulo = new Articulo(parametros); // esta linea tambien guarda de manera automatica y no es necesario hacerlo manual como en la linea siguiente 
    
    //asignar valores a objeto en el modelo (manual o automático)

        // manera manual    articulo.titulo = parametros.titulo;

    // Guardar el articulo en la base de datos

    // articulo.save((error, articuloGuardado) => {
    //     if (error || !articuloGuardado) {
    //         return res.status(400).json({
    //             status: "error",
    //             mensaje: "no se a guardado el articulo"
    //         });
    //     }

    // // devolver resultado 
    //     return res.status(200).json({
    //         status: "success",
    //         articulo: articuloGuardado,
    //         mensaje: "Articulo creado con exito !!"
    //     })

    // });

    // // lo anterior se usaba con anterior version de mongoose

    // manera actualiza

    try {
        // Guardar el articulo en la base de datos usando async/await
        const articuloGuardado = await articulo.save();
        
        // devolver resultado 
        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Articulo creado con éxito !!"
        });

    } catch (error) {
        // Manejar errores durante el guardado
        return res.status(400).json({
            status: "error",
            mensaje: "No se ha guardado el artículo"
        });
    }

};

const listar = async (req, res) => {
    try {
        const articulos = await Articulo.find({}).exec();

        if (!articulos || articulos.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontraron artículos"
            });
        }

        return res.status(200).json({
            status: "success",
            articulos
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error en la consulta",
            error: error.message
        });
    }
};

module.exports = {
    prueba,
    curso,
    crear,
    listar
}