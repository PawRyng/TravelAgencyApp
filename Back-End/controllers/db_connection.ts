import mysql, { Connection } from "mysql2";
import dotenv from "dotenv";

dotenv.config();

class Database {
  private static instance: Database;
  private connection: Connection;

  private constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "test_db",
    });

    this.connection.connect((error) => {
      if (error) {
        console.error(
          "Error connecting to the database:",
          (error as Error).message
        );
        return;
      }
      console.log("Connected to the MySQL database.");
    });
  }

  // Metoda zwracająca instancję klasy (singleton)
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Metoda zwracająca obiekt połączenia z bazą danych
  public getConnection(): Connection {
    return this.connection;
  }
}

export default Database;
