import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
});

const env = process.env;

const ENV = {
    DB: {
        MONGODB_URI: env.MONGODB_URI,
        DB_NAME: env.DB_NAME,
    },
    port: env.PORT,
    CORS: env.CORS_ORIGIN,
    acccessTokenExpiresIn: env.acccessTokenExpiresIn,
    refreshTokenExpiresIn: env.refreshTokenExpiresIn,
    JWT_SECRET: env.JWT_SECRET,
};

export default ENV;
