const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("../03_FS/config/db.js");

//connect to the DB
connectDB();

app.use(express.json({ extended: false }));

app.get("/", (request, response) => {
  response.send(`API is Running on port number ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Api is running on port number ${PORT}`);
});
