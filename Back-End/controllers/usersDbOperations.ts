import mysql from "mysql2";
import type { User } from "../types/user_login_types";

export class UserDb {
  private login: string;
  private connection: mysql.Connection;
  constructor(login: string, connection: mysql.Connection) {
    this.login = login;
    this.connection = connection;
  }

  public getUserByEmail(): Promise<User[]> {
    const query = "SELECT * FROM `users` WHERE `email` = ?";
    return new Promise((resolve, reject) => {
      this.connection.query<User[]>(query, [this.login], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }
}
