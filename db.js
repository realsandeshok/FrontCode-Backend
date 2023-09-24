const mongoose = require("mongoose");

const mongoURI =
<<<<<<< HEAD
  "mongodb+srv://sandeshmadoori:ecgphqioTEjyaOPQ@frontcode.weadzas.mongodb.net/";
=======
  "mongodb://0.0.0:27017"
>>>>>>> 143f26a9277ca121991709993b5cbd4aa0b8c2e8

const Connection = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = Connection;
