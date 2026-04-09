import { otpModel } from "#models";

class OtpRepository {
    static async createOtpEntry(data) {
        return await otpModel.create(data);
    }

    static async findOtp(email, otpHash) {
        return await otpModel.findOne({ email, otpHash });
    }

    static async deleteOtps(userId) {
        return await otpModel.deleteMany({
            user: userId,
        });
    }
}

export default OtpRepository;
