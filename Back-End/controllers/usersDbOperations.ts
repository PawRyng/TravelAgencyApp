import mysql from "mysql2";
import type { User, UserType } from "../types/user_login_types";

export class UserDb {
  private login?: string;
  private id?: number | undefined;
  private connection: mysql.Connection;
  constructor(connection: mysql.Connection, login?: string, id?: number) {
    this.login = login || "";
    this.id = id;
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

  public getUserTypeById(): Promise<UserType[]> {
    const query = "SELECT `type` FROM `users` WHERE `id` = ?";
    return new Promise((resolve, reject) => {
      this.connection.query<User[]>(query, [this.id], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }
}
