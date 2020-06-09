const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (request, response) => {
  response.send(`API is Running on port number ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Api is running on port number ${PORT}`);
});
