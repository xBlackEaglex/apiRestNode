const { schema, model } = require("mongoose");

const ArticuloSchema = schema({
    titulo: {
        type: string,
        required : true
    },
    contenido: {
        type: string,
        required : true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    imagen: {
        type: string,
        default: "default.png"
    },
});

module.exports = model("Articulo", ArticuloSchema, "articulos");