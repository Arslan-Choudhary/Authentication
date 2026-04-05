import { AuthRepository } from "#repository";

class AuthService {
    static async register(username, email, password) {
        const isAlreadyReistered =
            await AuthRepository.findUserByUsernameOrEmail(username, email);

            console.log("isAlreadyReistered:", isAlreadyReistered)

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

        const token = user.generateToken();

        return { user, token };
    }
}

export default AuthService;
