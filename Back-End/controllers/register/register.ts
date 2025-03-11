import UserValidation from "../login/user_validation";
import { Connection } from "mysql2";
import type { ValidationReturn } from "../../types/user_login_types";
import { UserDb } from "../usersDbOperations";
import Database from "../db_connection";
import bcrypt from "bcrypt";
import PasswordHandling from "../passwordHandling";

class Register {
  private login: string;
  private password: string;
  constructor(login: string, password: string) {
    this.login = login;
    this.password = password;
  }
  private checkUserData(): ValidationReturn {
    const validator = new UserValidation();

    if (!validator.checkEmail(this.login)) {
      return { status: 400, message: "Bad email" };
    } else if (!validator.checkPassword(this.password)) {
      return { status: 400, message: "Bad Password" };
    }

    return { status: 200 };
  }

  private async addUserToDb(
    db: Connection,
    hashedPassword: string,
    isUser: boolean = false
  ) {
    const query: string = `INSERT INTO users (email, password, salt, first_name, last_name, type, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      this.login,
      hashedPassword,
      "salt",
      "Test",
      "test",
      isUser ? "User" : "Admin",
      isUser ? 0 : 1,
    ];

    try {
      const response = await db.promise().query(query, values);

      return {
        success: true,
        message: "User added to db",
        data: response,
      };
    } catch (error) {
      console.error("Error in added user to db", error);

      return {
        success: false,
        message: "Error in added user to db",
        error: error instanceof Error ? error.message : "Jakiś error",
      };
    }
  }

  public async createAdmin() {
    const checkData = this.checkUserData();
    if (checkData.status === 200) {
      try {
        const databaseConnection = Database.getInstance().getConnection();

        const userQueries = new UserDb(this.login, databaseConnection);

        const getUserByEmail = await userQueries.getUserByEmail();

        if (getUserByEmail.length === 0) {
          const passwordHandler = new PasswordHandling(this.password);
          const hashedPassword = await passwordHandler.hashPassword();

          await this.addUserToDb(databaseConnection, hashedPassword, true);

          return {
            status: 201,
            message: "User successfully added to the database",
          };
        } else {
          return {
            status: 400,
            message: "User with this email already exists in the database",
          };
        }
      } catch (error) {
        console.error(
          "Error occurred during the user registration process:",
          error
        );

        return {
          status: 500,
          message: "An error occurred while processing your request",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    } else {
      return checkData;
    }
  }
  public async createUser() {
    const checkData = this.checkUserData();
    if (checkData.status === 200) {
      try {
        const databaseConnection = Database.getInstance().getConnection();

        const userQueries = new UserDb(this.login, databaseConnection);

        const getUserByEmail = await userQueries.getUserByEmail();

        if (getUserByEmail.length === 0) {
          const passwordHandler = new PasswordHandling(this.password);
          const hashedPassword = await passwordHandler.hashPassword();

          await this.addUserToDb(databaseConnection, hashedPassword, false);

          return {
            status: 201,
            message: "User successfully added to the database",
          };
        } else {
          return {
            status: 400,
            message: "User with this email already exists in the database",
          };
        }
      } catch (error) {
        console.error(
          "Error occurred during the user registration process:",
          error
        );

        return {
          status: 500,
          message: "An error occurred while processing your request",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    } else {
      return checkData;
    }
  }
}
export default Register;
