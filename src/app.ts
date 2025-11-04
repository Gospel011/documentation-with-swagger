import express from "express";
import userRouter from "@/routes/userRoutes.js";
import swaggerJSDoc, { type OAS3Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import packageJson from "../package.json" with { type: "json" };
const app = express();
app.use(express.json());

const options: OAS3Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentation with Swagger",
      version: packageJson.version,
      description:
        "This documentation serves as a showcase of how api documentation can be done with swagger ui and swagger jsdoc",
      contact: {
        name: "Gospel Ugochukwu",
        email: "ugochukwugospeli111@gmail.com",
        url: "https://ugochukwu-gospel.com",
      },
      termsOfService: "https://documentation-with-swagger.com/terms",
      license: {
        name: "MIT",
        url: "https://documentation-with-swagger/licence",
      },
    },
  },
  apis: ["./src/routes/*", "./src/models/*", "./src/types/*", "./src/docs/*"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/user", userRouter);

app.get("/api/docs/export", (req, res) => {
  res.set("Content-Type", "application/json");
  res.send(swaggerSpec);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is running successfully on port: ${PORT}`);
});
