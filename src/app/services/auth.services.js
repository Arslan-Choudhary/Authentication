import jwt from "jsonwebtoken";
import { AuthRepository } from "#repository";
import ENV from "#env";

class AuthService {
    static async register(username, email, password) {
        const isAlreadyReistered =
            await AuthRepository.findUserByUsernameOrEmail(username, email);

        console.log("isAlreadyReistered:", isAlreadyReistered);

        if (isAlreadyReistered) {
            const error = new Error("Username or email already exists");
            error.status = 409;
            throw error;
        }

        const user = await AuthRepository.createUser({
            username,
            email,
            password,
        });

        const accessToken = user.generateAccessToken();

        const refreshToken = user.generateRefreshToken();

        return { user, accessToken, refreshToken };
    }

    static async getMe(token) {
        if (!token) {
            const error = new Error("token not found");
            error.status = 401;
            throw error;
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET);

        const user = await AuthRepository.findUserById(decoded._id);

        if (!user) {
            const error = new Error("user not found");
            error.status = 404;
            throw error;
        }

        return user;
    }

    static async refreshToken(refreshToken) {
        if (!refreshToken) {
            const error = new Error("Refresh token not found");
            error.status = 401;
            throw error;
        }

        const decoded = jwt.verify(refreshToken, ENV.JWT_SECRET);

        const user = await AuthRepository.findUserById(decoded._id);

        if (!user) {
            const error = new Error("user not found");
            error.status = 404;
            throw error;
        }

        const accessToken = user.generateAccessToken();

        const newRefreshToken = user.generateRefreshToken();

        return { accessToken, newRefreshToken };
    }
}

export default AuthService;
