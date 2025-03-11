import mysql from "mysql2";
import Database from "../controllers/db_connection"; // Adjust path as needed

jest.mock("mysql2", () => ({
  createConnection: jest.fn(() => ({
    connect: jest.fn((callback: Function) => callback(null)), // Simulate successful connection
    end: jest.fn(),
  })),
}));

describe("Database", () => {
  it("should establish a connection to the MySQL database", () => {
    const db = Database.getInstance();
    const connection = db.getConnection();

    // Verify that createConnection was called with correct arguments
    expect(mysql.createConnection).toHaveBeenCalledWith({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "test_db",
    });

    // Verify that the connection's connect method was called
    expect(connection.connect).toHaveBeenCalled();
  });

  it("should log an error if connection fails", () => {
    // Mock the connection to simulate an error
    const errorMessage = "Connection failed";
    (mysql.createConnection as jest.Mock).mockImplementationOnce(() => ({
      connect: jest.fn((callback: Function) =>
        callback(new Error(errorMessage))
      ),
      end: jest.fn(),
    }));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const db = Database.getInstance();
    const connection = db.getConnection();

    // Simulate connection failure
    connection.connect((error: any) => {
      expect(error.message).toBe(errorMessage);
    });

    // Check that console.error was called
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error connecting to the database:",
      errorMessage
    );

    // Restore console spy
    consoleSpy.mockRestore();
  });
});
