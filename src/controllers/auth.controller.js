import { ResponseHandler } from "#utils";
import { AuthService } from "#service";

class AuthController {
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;

            const { user, token } = await AuthService.register(
                username,
                email,
                password
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            const responseData = {
                user: {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                },
                token: token,
            };

            ResponseHandler.createHandler(
                res,
                responseData,
                "User registered successfully"
            );
        } catch (error) {
            ResponseHandler.errorHandler(res, error);
        }
    }

    static async getMe(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            const user = await AuthService.getMe(token);

            ResponseHandler.successHandler(
                res,
                { user: {username: user.username, email: user.email }},
                "user fetched successfully"
            );
        } catch (error) {
            ResponseHandler.errorHandler(res, error);
        }
    }
}

export default AuthController;
