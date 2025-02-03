const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

app.use(cors());
app.options("*", cors());

// middleware
app.use(bodyParser.json());


// Routes
const cetegoryRoutes = require("./routes/category")


app.use("/api/category/" , cetegoryRoutes)

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => {
    console.log("Database Connection id ready...")
    app.listen(process.env.PORT, () => {
        console.log(`server is runnig http://localhost:${process.env.PORT}`);
      });
  })
  .catch((err) => console.log(err));


