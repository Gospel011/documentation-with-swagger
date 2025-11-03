import userController from "controllers/userController.js";
import { Router } from "express";
const router = Router();


router
  .route("/")
  .post(
    userController.ensureRequestBodyHasFields([
      "firstName",
      "lastName",
      "email",
      "password",
    ]),
    userController.createUser
  );
router
  .route("/me")
  .get(userController.isLoggedIn, userController.getLoggedInUserProfile)
  .patch(userController.isLoggedIn, userController.updateUser)
  .delete(userController.isLoggedIn, userController.deleteUserAccount);

router
  .route("/login")
  .post(
    userController.ensureRequestBodyHasFields(["email", "password"]),
    userController.login
  );

router.route("/:id").get(userController.isLoggedIn, userController.getProfile);

export default router;
