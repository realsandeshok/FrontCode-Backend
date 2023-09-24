const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://sandeshmadoori:ecgphqioTEjyaOPQ@frontcode.weadzas.mongodb.net/";

const Connection = () => {
  mongoose.connect(mongoURI);
};

console.log("Connected");

module.exports = Connection;
