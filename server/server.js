require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8080;
const app = express();


// Middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));







// ---------------------------------------------------
const userRouter = require("./routes/userRoute");
// require("./routes/htmlRoutes")(app);
// ---------------------------------------------------



app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});



const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/bet-track";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });