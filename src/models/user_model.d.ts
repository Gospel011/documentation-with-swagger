/**
 * @openapi
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *              firstName:
 *                  type: string
 *              lastName:
 *                  type: string
 *              email:
 *                  type: string
 *              
 */
interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}