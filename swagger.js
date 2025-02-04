const swaggerAutogen = require("swagger-autogen")()

const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Home appliance store API",
        version: "1.0.0",
        description: "API documentation for home appliance store",
      },
      servers: [
        {
          url: "http://localhost:6500",
        },
      ],
    },
    apis: ["./routes/category.js"],
  };
  
  const outputFile = "./swagger.json"
  const endpointsFiles = ["./app.js"]
  
  swaggerAutogen(outputFile, endpointsFiles , swaggerOptions).then(()=>{
    require("./app.js")
  })