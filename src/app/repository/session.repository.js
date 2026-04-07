import { sessionModel } from "#models";

class SessionRepository {
    static async createSession(data) {
        return await sessionModel.create(data);
    }

    static async findOneSession(refreshTokenHash) {
        return await sessionModel.findOne({
            refreshTokenHash,
            revoked: false,
        });
    }
}

export default SessionRepository;
