import packageJson from "../../package.json" with { type: "json" };
import swaggerJSDoc, { type OAS3Options } from "swagger-jsdoc";

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

export default swaggerSpec;
