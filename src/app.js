import app from "#server";
import ENV from "#env";
import { connectDB } from "#connections";
import { Logger } from "#utils";

import "#syncRoutes";
import "#models";

const PORT = ENV.port;

connectDB()
    .then(
        app.listen(PORT || 8000, (error) =>
            error
                ? Logger.serverLogger.logError(error)
                : console.log(`Server running on port ${PORT}`)
        )
    )
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });
