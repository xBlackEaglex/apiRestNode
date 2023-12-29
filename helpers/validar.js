const validator = require("validator");

const validarArticulo = (res, parametros) => {
    let mensaje = false;
    
    try {

        let validar_titulo = !validator.isEmpty(parametros.titulo) && validator.isLength(parametros.titulo, {min: 5, max: undefined});
        let validar_contenido = !validator.isEmpty(parametros.contenido);

        if (!validar_contenido || !validar_titulo) {
            mensaje = true;
            throw new Error("No se ha validado la información, revise de nuevo, recuerde que titulo tiene que tener mínimo 5 caracteres");
        }

    }catch(error) {
        return res.status(400).json({
            status: "error",
            mensaje: mensaje == true ? error.message : "faltan datos por enviar"
        });
    }

    return true;
}

module.exports = {
    validarArticulo
}