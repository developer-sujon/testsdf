// exceptions.test.js

const {
  badRequestException,
  unauthorizedException,
  forbiddenException,
  notFoundException,
  serverErrorException,
} = require("../../src/utils/error");

describe("Exception Functions", () => {
  it("should create a BadRequest exception", () => {
    const error = badRequestException("Invalid data");
    expect(error.message).toBe("Invalid data");
    expect(error.status).toBe(400);
    expect(error.error).toBe("Bad Request");
  });

  it("should create an Unauthorized exception", () => {
    const error = unauthorizedException("Not authorized");
    expect(error.message).toBe("Not authorized");
    expect(error.status).toBe(401);
    expect(error.error).toBe("Unauthorized");
  });

  it("should create a Forbidden exception", () => {
    const error = forbiddenException("No permissions");
    expect(error.message).toBe("No permissions");
    expect(error.status).toBe(403);
    expect(error.error).toBe("Forbidden");
  });

  it("should create a NotFound exception", () => {
    const error = notFoundException("Resource not found");
    expect(error.message).toBe("Resource not found");
    expect(error.status).toBe(404);
    expect(error.error).toBe("Not Found");
  });

  it("should create a ServerError exception", () => {
    const error = serverErrorException("Internal server error");
    expect(error.message).toBe("Internal server error");
    expect(error.status).toBe(500);
    expect(error.error).toBe("Internal Server Error");
  });
});
