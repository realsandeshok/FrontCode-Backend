const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://sandeshmadoori:ecgphqioTEjyaOPQ@frontcode.weadzas.mongodb.net/";

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
