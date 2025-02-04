const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const swaggerUI = require("swagger-ui-express");

require("dotenv/config");

app.use(cors());
app.options("*", cors());

// middleware
app.use(bodyParser.json());


const swaggerDocs = require('./swagger.json'); 

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));


/**
 * @swagger
 * /api/category:
 *   get:
 *     summary:This API is for getting a list of categories.
 *     description: This API is for getting a list of categories.
 *     responses:
 *           200:
 *              description: to test get method
 *
 */


const cetegoryRoutes = require("./routes/category");

app.use("/category/", cetegoryRoutes);

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => {
    console.log("Database Connection id ready...");
    app.listen(process.env.PORT, () => {
      console.log(`server is runnig http://localhost:${process.env.PORT}`);
      console.log(
        `مستندات Swagger: http://localhost:${process.env.PORT}/api-docs`
      );
    });
  })
  .catch((err) => console.log(err));
