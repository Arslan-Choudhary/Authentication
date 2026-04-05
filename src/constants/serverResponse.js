const ServerResponse = {
  API_STATUS_CODE: {
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NOT_FOUND: 404,
    AUTHORIZATION_FAILED: 401,
    ERROR_CODE: 400,
    INTERNAL_SERVER_ERROR: 500,
    DUPLICATE_ENTRY: 409,
    FORBIDDEN: 403,
    RATE_LIMIT: 429,
  },
  API_RESPONSE_MESSAGE: {
    SUCCESS: "Success",
    CREATED: "Created",
    AUTHORIZATION_FAILED: "Authorization failed",
    DUPLICATE_ENTRY: "email already exist",
    INTERNAL_SERVER_ERROR: "Internal server error",
    FORBIDDEN: "Forbidden",
    LOGOUT: "Logout successfully",
    INVALID_PASSWORD: "Invalid password",
    USER_NOT_FOUND: "User not found",
    DATA_NOT_FOUND: "Data not found",
    ROUTE_NOT_FOUND: "Route not Found",
    RATE_LIMIT: "Too many requests, Ip blocked for 5 minutes",
  },
};

export default ServerResponse;
