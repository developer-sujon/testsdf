// connectDB.test.js

const mongoose = require("mongoose");
const { connectDB } = require("../../src/database");

// Mock environment variables
let connectionURL =
  process.env.DB_CONNECTION_URL ||
  "mongodb://<username>:<password>@localhost:27017";
connectionURL = connectionURL.replace("<username>", process.env.DB_USERNAME);
connectionURL = connectionURL.replace("<password>", process.env.DB_PASSWORD);
// connectionURL = `${connectionURL}/${process.env.DB_NAME}?${process.env.DB_URL_QUERY}`;

// Create a mock for the console.log function
const originalConsoleLog = console.log;
const mockConsoleLog = jest.fn();
console.log = mockConsoleLog;

// Mock the mongoose.connect function
jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

describe("connectDB", () => {
  it("should connect to the database", async () => {
    await connectDB();
    expect(mongoose.connect).toHaveBeenCalledWith(connectionURL, {
      dbName: process.env.DB_NAME,
    });
    expect(mockConsoleLog).toHaveBeenCalledWith("Database connected");
  });
});

// Restore the original console.log function after the tests
afterAll(() => {
  console.log = originalConsoleLog;
});
