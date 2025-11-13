import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import docsController from "controllers/docsController.js";
import userController from "controllers/userController.js";
import swaggerSpec from "lib/swagger.js";

const docsRouter = Router();

docsRouter.get("/login", docsController.login);
docsRouter.get("/sign-up", docsController.signup);
docsRouter.get("/forgot-password", docsController.forgotPassword);
docsRouter.get("/reset-password", docsController.resetPassword);

docsRouter.use(
  (req, res, next) => {
    req.ssr = true;
    next();
  },
  userController.isLoggedIn,
  docsController.allowDevelopers
);

docsRouter.use("/", swaggerUi.serve);
docsRouter.get("/", swaggerUi.setup(swaggerSpec));

docsRouter.get("/export", (_, res) => {
  res.set("Content-Type", "application/json");
  res.send(swaggerSpec);
});

export default docsRouter;
