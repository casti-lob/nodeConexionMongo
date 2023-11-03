const express = require("express");
const morgan = require("morgan");
const cors = require('cors')//middleware para evirtar problemas con el cors(asi acepta peticiones de cualquier sitio)

//Para que nos de los parametros del archivo .env
require('dotenv').config();
//database conection
// Configurar la conexión de mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);


async function main() {
  await mongoose.connect(process.env.MONGO_CNN);
  console.log('Database connected');
}
main().catch((err) => console.log(err));

const app = express();
app.use(cors())
app.use(morgan("tiny"));
app.use(express.json());

app.get("/", (req, res, next) => {
  return res.json("¡Hola!");
});

// Captura el error 404 y lo envía al manejador de errores
app.use((req, res, next) => {
  const err = new Error("No encontrado");
  err.status = 404;
  return next(err);
});

// Manejadores de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  return res.json({
    message: err.message,
    /*
     Si estamos en modo de desarrollo, incluye la traza de la pila (objeto de error completo)
     de lo contrario, es un objeto vacío para que el usuario no vea todo eso
    */
    error: app.get("env") === "desarrollo" ? err : {}
  });
});

app.listen(process.env.PORT, () => {
  console.log(`El servidor está escuchando en el puerto ${process.env.PORT}`);
});