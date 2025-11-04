import userController from "controllers/userController.js";
import { Router } from "express";
const router = Router();

/**
 * @openapi
 * /api/v1/user:
 *  post:
 *    summary: Create a new user
 *    description: This enpoint creates a new user in the database.
 *    operationId: createUser
 *    tags:
 *      - User
 *    requestBody:
 *      description: Details of the user to create
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            example:
 *              firstName: Denaerys
 *              lastName: Targaryen
 *              email: "denaerys.targaryen@example.com"
 *              password: "A-very-strong-password"
 *              
 *    responses:
 *      "200":
 *        description: User created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResponseBody'
 *      "400":
 *        description: Request body not provided or account already exists
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResponseBody'
 */
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

/**
 * @openapi
 * /api/v1/user/login:
 *  post:
 *    summary: Login
 *    description: |
 *      Logs user in
 * 
 *      ***Note:*** Auth token is attached to response header and cookie
 *    tags:
 *    - User
 *    requestBody:
 *      description: User credentials
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/BaseResponse'
 *                - type: object
 *                  properties:
 *                    data:
 *                      $ref: '#/components/schemas/User'
 */
router
  .route("/login")
  .post(
    userController.ensureRequestBodyHasFields(["email", "password"]),
    userController.login
  );


/**
 * @openapi
 * /api/v1/user/me:
 *  get:
 *    summary: Get logged in user's profile information
 *    description: This endpoint returns the logged in user's information
 *    operationId: getLoggedInUser
 *    tags:
 *      - User
 *    security:
 *      - bearerToken: []
 *    responses:
 *      "200":
 *        description: Logged in user profile retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/BaseResponse'
 *                - type: object
 *                  properties:
 *                    data:
 *                      type: object
 *                      properties:
 *                        user:
 *                          $ref: '#components/schemas/User'
 *      "401":
 *        description: Not authorized. You typically means you should login
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResponseBody'
 *  patch:
 *    summary: Update logged in user
 *    description: Update the currently logged in user data
 *    tags:
 *    - User
 *    security:
 *      - bearerToken: []
 *    requestBody:
 *      description: Fields to update
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *    responses:
 *      200:
 *        $ref: '#/components/responses/Ok'
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *  delete:
 *    summary: Delete logged in user
 *    description: Delete the currently logged in user's data **permanently**
 *    tags:
 *    - User
 *    security:
 *      - bearerToken: []
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResponseBody'
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 */
router
  .route("/me")
  .get(userController.isLoggedIn, userController.getLoggedInUserProfile)
  .patch(userController.isLoggedIn, userController.updateUser)
  .delete(userController.isLoggedIn, userController.deleteUserAccount);
  
/**
 * @openapi
 * /api/v1/user/{id}:
 *  get:
 *    summary: Get user profile
 *    description: This endpoint retrieves the profile information for the specified user
 *    tags:
 *      - User
 *    parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: The user id of the user whose profile you want to retrieve
 *    responses:
 *      404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ResponseBody'
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  enum:
 *                  - success
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/User'
 * 
 */
router.route("/:id").get( userController.getProfile);

export default router;
