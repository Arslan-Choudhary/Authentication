import { userModel } from "#models";

class AuthRepository {
    static async findUserByUsernameOrEmail(username, email) {
        return await userModel.findOne({ $or: [{ username }, { email }] });
    }

    static async createUser(data) {
        return await userModel.create(data);
    }
}

export default AuthRepository;
