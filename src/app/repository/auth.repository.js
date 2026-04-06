import { userModel } from "#models";

class AuthRepository {
    static async findUserByUsernameOrEmail(username, email) {
        return await userModel.findOne({ $or: [{ username }, { email }] });
    }

    static async createUser(data) {
        return await userModel.create(data);
    }

    static async findUserById(id) {
        return await userModel.findById(id);
    }
}

export default AuthRepository;
