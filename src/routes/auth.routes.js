import { Router } from "express";
import { AuthController } from "#controllers";

const authRouter = Router();

/**
 * - POST /api/auth/register
 */
authRouter.route("/register").post(AuthController.register);

/**
 * - GET /api/auth/get-me
 */
authRouter.route("/get-me").get(AuthController.getMe);

/**
 * - GET /api/auth/refresh-token
 */
authRouter.route("/refresh-token").get(AuthController.refreshToken);

/**
 * GET /api/auth/logout
 */
authRouter.route("/logout").get(AuthController.logout);

export default authRouter;
