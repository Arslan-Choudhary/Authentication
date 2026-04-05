import { Router } from "express";
import { AuthController } from "#controllers";

const authRouter = Router();

/**
 * - POST /api/auth/register
 */
authRouter.route("/register").post(AuthController.register);

export default authRouter;
