const Articulo = require("../modelos/Articulo");
const {validarArticulo} = require("../helpers/validar");
const fs = require("fs"); 
const path = require("path");

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

    if (validarArticulo(res, parametros) != true) {
        return;
    }

    // crear el objeto a guardar 

    const articulo = new Articulo(parametros); // esta linea tambien guarda de manera automatica y no es necesario hacerlo manual como en la linea siguiente 
    
    //asignar valores a objeto en el modelo (manual o automático)

        // manera manual    articulo.titulo = parametros.titulo;

    // Guardar el articulo en la base de datos

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
        let query = Articulo.find({})
                            .sort({fecha: -1});
    
        if (req.params.ultimos ){
            query.limit(req.params.ultimos)
        };

        const articulos = await query;

        if (!articulos || articulos.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontraron artículos"
            });
        }

        return res.status(200).json({
            status: "success",
            contador: articulos.length,
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

const uno =  async (req, res) => {
    // Recoger un id por la URL
    let id  = req.params.id;

    try {
        // Buscar el artículo
        const articulo = await Articulo.findById(id);

        // Devolver el resultado

        return res.status(200).json({
            status: "success",
            articulo
        });

    } catch (error) {
        // Si no se encuentra el artículo

        return res.status(404).json({
            status: "error",
            mensaje: "No se ha encontrado el artículo"
        });
    
    }
};

const borrar = async (req, res) => {
    let id = req.params.id;

    try {
        const articuloBorrado = await Articulo.findOneAndDelete({_id: id});

        return res.status(200).json({
            status: "success",
            articulo: articuloBorrado,
            mensaje: "Articulo borrado con éxito"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "No se ha podido borrar el artículo"
        })
    }

}

const editar = async (req, res) => {
    // recoger id
    let articuloId = req.params.id;

    // recoger datos del body
    let parametros = req.body;

    //validar datos
    if (validarArticulo(res, parametros) != true) {
        return;
    }
    
    // buscar y actualizar
    try {
        const articuloActualizado = await Articulo.findOneAndUpdate({_id: articuloId}, parametros, {new: true});

        // devolver respuesta 

        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado,
            mensaje: "Articulo actualizado con éxito" 
        });
        
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "No se ha podido actualizar el artículo" 
        });
    }

}

const subir = async (req, res) => {

    // configurar multer, se hace en las rutas

    // recoger el fichero de la imagen
    if (!req.file && !req.files) {
        return res.status(404).json({
            status: "error",
            mensaje: "petición invalida" 
        })
    }

    // nombre del archivo
    let archivo = req.file.originalname;

    // extension del archivo 
    let archivoSplit = archivo.split("\.");
    let extension = archivoSplit[1];

    //comprobar extension correcta 
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {
        
        // borrar archivo y dar respuesta
        fs.unlink(req.file.path, () => {
            return res.status(400).json({
                status: "error",
                mensaje: "Imagen invalida"
            }) 
        })
    }else{

        // recoger id
        let articuloId = req.params.id;

        // buscar y actualizar
        try {
            const articuloActualizado = await Articulo.findOneAndUpdate({_id: articuloId}, {imagen: req.file.filename}, {new: true});

            // devolver respuesta 

            return res.status(200).json({
                status: "success",
                articulo: articuloActualizado,
                mensaje: "Articulo actualizado con éxito",
                fichero: req.file
            });
            
        } catch (error) {
            fs.unlink(req.file.path, () => {
                return res.status(500).json({
                    status: "error",
                    mensaje: "No se a podido actualizar el articulo"
                }) 
            })
        }
    }
}

const imagen = (req, res) => {
    let fichero = req.params.fichero;
    let rutaFisica = "./imagenes/articulos/" + fichero;

    fs.stat(rutaFisica, (error, existe) => {
        if (existe) {
            return res.sendFile(path.resolve(rutaFisica));
        }else {
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe"
            }) 
        }
    })
}

const buscador = async (req, res) => {
    //sacar el string de búsqueda
    let busqueda = req.params.busqueda;

    // find OR y orden y ejecutar consulta 
    try {
        const articuloEncontrado = await Articulo.find({
            "$or": [
                {"titulo": {"$regex": busqueda, "$options": "i"}},
                {"contenido": {"$regex": busqueda, "$options": "i"}}
            ]
        })
        .sort({fecha: -1});

        if (!articuloEncontrado || articuloEncontrado.length <= 0){
            throw new Erro();
        }

        return res.status(200).json({
            status: "success",
            contador: articuloEncontrado.length,
            articuloEncontrado
        });

    } catch (error) {
        return res.status(404).json({
            status: "error",
            mensaje: "No se han encontrado artículos"
        })
    } 
}

module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}