/**
 * @openapi
 * components:
 *  securitySchemes:
 *    bearerToken:
 *      description: Bearer token auth using jwt as token format
 *      type: http
 *      scheme: Bearer
 *      bearerFormat: JWT
 *  responses:
 *   Unauthorized:
 *     description: Unauthorized.
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/ResponseBody'
 *   Ok:
 *     description: Ok
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/ResponseBody'
 *  schemas:
 *    BaseResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          enum:
 *          - success
 *          - failed
 *    ResponseBody:
 *      allOf:
 *        - $ref: '#/components/schemas/BaseResponse'
 *        - type: object
 *          properties:
 *            message:
 *              type: string
 */
interface ResponseBody<T = undefined> {
  status: "success" | "failed";
  message?: string;
  data?: T;
}
