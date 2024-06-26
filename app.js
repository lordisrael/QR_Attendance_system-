/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const app = express();

const helmet = require("helmet");
const cors = require("cors");

//swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml"); 

const cookieParser = require("cookie-parser");
const dbConnect = require("./config/db");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-Found");
const lecturerRoute = require("./routes/lecturerRoutes")
const studentRoute = require("./routes/studentRoutes")

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send('<h1>CPE_QR ATTENDANCE API</h1><a href="/api-docs">Documentation</a>');
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));


app.use("/api/lecturer", lecturerRoute)
app.use("/api/student", studentRoute)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await dbConnect(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
