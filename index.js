const Connection = require("./db");
const express = require("express");
var cors = require("cors");

Connection();

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.use("/api/authentication", require("./routes/authentication"));
app.use("/api/codesnippet", require("./routes/codesnippet"));

app.listen(port, () => {
  console.log(`FrontCode Backend listening on port http://localhost:${port}`);
});
