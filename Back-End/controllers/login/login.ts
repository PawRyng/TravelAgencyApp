import UserValidation from "./user_validation";
import Database from "../db_connection";
import PasswordHandling from "../passwordHandling";
import { UserDb } from "../usersDbOperations";
import type { ValidationReturn } from "../../types/user_login_types";
import { generateRefreshToken, generateToken } from "../jwt/token";

class Login {
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
      return { status: 400, message: "Bad email" };
    }

    return { status: 200 };
  }

  public async loginUser() {
    const checkData = this.checkUserData();
    if (checkData.status === 200) {
      try {
        const databaseConection = Database.getInstance().getConnection();
        const userOperations = new UserDb(databaseConection, this.login);
        const user = await userOperations.getUserByEmail();

        if (user.length > 0) {
          const passwordHandler = new PasswordHandling(this.password);

          const match = await passwordHandler.comparePassword(user[0].password);

          if (match) {
            const token = generateToken(
              user[0].id,
              user[0].email,
              user[0].type === "admin"
            );
            const refreshToken = generateRefreshToken(
              user[0].id,
              user[0].email,
              user[0].type === "admin"
            );
            return {
              status: 200,
              message: "Wellcome",
              token,
              refreshToken,
            };
          } else {
            return {
              status: 401,
              message: "Incorrect Password",
            };
          }
        } else {
          return {
            status: 404,
            message: "User not found",
          };
        }
      } catch (error) {
        return {
          status: 500,
          message: "Serwer Error",
          error: error,
        };
      }
    } else {
      return checkData;
    }
  }
}
export default Login;
