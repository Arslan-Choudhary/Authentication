import crypto from "crypto";
import jwt from "jsonwebtoken";
import { AuthRepository, SessionRepository } from "#repository";
import ENV from "#env";

class AuthService {
    static async register(username, email, password, ip, userAgent) {
        const isAlreadyReistered =
            await AuthRepository.findUserByUsernameOrEmail(username, email);

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

        const refreshToken = user.generateRefreshToken();

        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        const sessionData = {
            user: user._id,
            refreshTokenHash,
            ip: ip,
            userAgent,
        };

        const session = await SessionRepository.createSession(sessionData);

        const accessToken = user.generateAccessToken(session._id);

        return { user, accessToken, refreshToken };
    }

    static async login(email, password, ip, userAgent) {
        const user = await AuthRepository.findUserByEmail(email);

        console.log(user);

        if (!user) {
            const error = new Error("Invalid email or password");
            error.status = 401;
            throw error;
        }

        const hashedPassword = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");

        const isPasswordValid = hashedPassword === user.password;

        if (!isPasswordValid) {
            const error = new Error("Invalid email or password");
            error.status = 401;
            throw error;
        }

        const refreshToken = user.generateRefreshToken();

        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        const sessionData = {
            user: user._id,
            refreshTokenHash,
            ip: ip,
            userAgent,
        };

        const session = await SessionRepository.createSession(sessionData);

        const accessToken = user.generateAccessToken(session._id);

        return { refreshToken, accessToken, user };
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

        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        const session =
            await SessionRepository.findOneSession(refreshTokenHash);

        if (!session) {
            const error = new Error("Invalid refresh token");
            error.status = 401;
            throw error;
        }

        const user = await AuthRepository.findUserById(decoded._id);

        if (!user) {
            const error = new Error("user not found");
            error.status = 404;
            throw error;
        }

        const accessToken = user.generateAccessToken();

        const newRefreshToken = user.generateRefreshToken();

        const newRefreshTokenHash = crypto
            .createHash("sha256")
            .update(newRefreshToken)
            .digest("hex");

        session.refreshTokenHash = newRefreshTokenHash;
        await session.save();

        return { accessToken, newRefreshToken };
    }

    static async logout(refreshToken) {
        if (!refreshToken) {
            const error = new Error("Refresh token not found");
            error.status = 400;
            throw error;
        }

        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        const session =
            await SessionRepository.findOneSession(refreshTokenHash);

        if (!session) {
            const error = new Error("Invalid refresh token");
            error.status = 400;
            throw error;
        }

        if (!session.revoked) {
            session.revoked = true;
            await session.save();
        }

        return true;
    }

    static async logoutAll(refreshToken) {
        if (!refreshToken) {
            const error = new Error("Refresh token not found");
            error.status = 400;
            throw error;
        }

        const decoded = jwt.verify(refreshToken, ENV.JWT_SECRET);

        const updatedSession = await SessionRepository.updateAllSession(
            decoded._id
        );

        if (!updatedSession) {
            const error = new Error("Session not found");
            error.status = 404;
            throw error;
        }

        return true;
    }
}

export default AuthService;
