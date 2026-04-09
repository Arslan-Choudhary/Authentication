import { ResponseHandler } from "#utils";
import { AuthService } from "#service";

class AuthController {
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;

            const {
                user,
                // accessToken,
                //  refreshToken
            } = await AuthService.register(
                username,
                email,
                password,
                req.ip,
                req.headers["user-agent"]
            );

            // res.cookie("refreshToken", refreshToken, {
            //     httpOnly: true,
            //     secure: true,
            //     sameSite: "strict",
            //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            // });

            const responseData = {
                user: {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    verified: user.verified,
                },
                // accessToken: accessToken,
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

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const { refreshToken, accessToken, user } = await AuthService.login(
                email,
                password,
                req.ip,
                req.headers["user-agent"]
            );

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            const responseData = {
                user: {
                    email: user.email,
                    username: user.username,
                },
                accessToken: accessToken,
            };

            ResponseHandler.createHandler(
                res,
                responseData,
                "Logged in successfully"
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
                { user: { username: user.username, email: user.email } },
                "user fetched successfully"
            );
        } catch (error) {
            ResponseHandler.errorHandler(res, error);
        }
    }

    static async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;

            const { accessToken, newRefreshToken } =
                await AuthService.refreshToken(refreshToken);

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            ResponseHandler.successHandler(
                res,
                { accessToken: accessToken },
                "Access Token refreshed successfully"
            );
        } catch (error) {
            ResponseHandler.errorHandler(res, error);
        }
    }

    static async logout(req, res) {
        try {
            const refreshToken = req.cookies?.refreshToken;

            await AuthService.logout(refreshToken);

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });

            ResponseHandler.successHandler(res, "", "Logged out successfully");
        } catch (error) {
            ResponseHandler.errorHandler(res, error);
        }
    }

    static async logoutAll(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;

            await AuthService.logoutAll(refreshToken);

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });

            ResponseHandler.successHandler(
                res,
                "",
                "Logged out from all devices successfully"
            );
        } catch (error) {
            ResponseHandler.errorHandler(res, error);
        }
    }

    static async verifyEmail(req, res) {
        try {
            const { otp, email } = req.body;

            const user = await AuthService.verifyEmail(otp, email);

            console.log(user);

            ResponseHandler.successHandler(
                res,
                {
                    user: {
                        username: user.username,
                        email: user.email,
                        verified: user.verified,
                    },
                },
                "Email verified successfully"
            );
        } catch (error) {
            ResponseHandler.errorHandler(res, error);
        }
    }
}

export default AuthController;
