import { ServerResponse } from "#constants";
import { Logger } from "#utils";

class ResponseHandler {
    static successHandler = (res, data = "", message) => {
        res.status(ServerResponse.API_STATUS_CODE.SUCCESS).json({
            status: ServerResponse.API_STATUS_CODE.SUCCESS,
            message: message || ServerResponse.API_RESPONSE_MESSAGE.SUCCESS,
            ...data,
        });
    };

    static errorHandler = (res, error) => {
        res.status(
            error.status
                ? error.status
                : ServerResponse.API_STATUS_CODE.INTERNAL_SERVER_ERROR
        ).json({
            status: error.status
                ? error.status
                : ServerResponse.API_STATUS_CODE.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
        if (error.logging === false) return "";
        Logger.controllerLogger.logError(error);
    };

    static createHandler = (
        res,
        data = "",
        message = ServerResponse.API_RESPONSE_MESSAGE.CREATED
    ) => {
        res.status(ServerResponse.API_STATUS_CODE.CREATED).json({
            status: ServerResponse.API_STATUS_CODE.CREATED,
            message: message || ServerResponse.API_RESPONSE_MESSAGE.CREATED,
            ...data,
        });
    };
    static tooManyRequests(
        res,
        data = null,
        message = ServerResponse.API_RESPONSE_MESSAGE.RATE_LIMIT
    ) {
        return res.status(ServerResponse.API_STATUS_CODE.RATE_LIMIT).json({
            status: ServerResponse.API_STATUS_CODE.RATE_LIMIT,
            message,
            data,
        });
    }
}

export default ResponseHandler;
