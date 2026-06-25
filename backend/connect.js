const mongoose = require("mongoose");
require("dotenv").config();

console.log(process.env.LIVE_MONGO_URI);

mongoose
  .connect(process.env.LIVE_MONGO_URI)
  .then(() => console.log("Connected"))
  .catch((err) => console.error(err));