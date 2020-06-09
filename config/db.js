const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

//We connect the Mongo DB using Mongoose driver

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB Connected....");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
