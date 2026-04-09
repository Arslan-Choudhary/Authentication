import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import ENV from "#env";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username must be unique"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verified: {
        type: Boolean,
        default: false,
    },
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await crypto
        .createHash("sha256")
        .update(this.password)
        .digest("hex");
});

userSchema.methods.generateAccessToken = function (sessionId = "") {
    return jwt.sign({ _id: this._id, sessionId }, ENV.JWT_SECRET, {
        expiresIn: ENV.acccessTokenExpiresIn,
    });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _id: this._id }, ENV.JWT_SECRET, {
        expiresIn: ENV.refreshTokenExpiresIn,
    });
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
