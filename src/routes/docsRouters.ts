import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import docsController from "controllers/docsController.js";
import swaggerSpec from "lib/swagger.js";

const docsRouter = Router();

docsRouter.get("/login", docsController.login);

docsRouter.use(docsController.isLoggedIn);

docsRouter.use("/", swaggerUi.serve);
docsRouter.get("/", swaggerUi.setup(swaggerSpec));

docsRouter.get("/export", (_, res) => {
  res.set("Content-Type", "application/json");
  res.send(swaggerSpec);
});

export default docsRouter;
