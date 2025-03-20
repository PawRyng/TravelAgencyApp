import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../controllers/jwt/token";
import { UserDb } from "../controllers/usersDbOperations";
import Database from "../controllers/db_connection";

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(403).json({ message: "Token not exist" });
  } else {
    try {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.id && decodedToken.email) {
        const databaseConnection = Database.getInstance().getConnection();

        const user = new UserDb(
          databaseConnection,
          decodedToken.email,
          decodedToken.id
        );

        const respone = await user.getUserTypeById();

        if (respone.length === 1) {
          if (respone[0].type === "admin") {
            next();
          } else {
            res.status(403).json({ message: "Forbidden" });
          }
        } else {
          res.status(500).json({ message: "Server error" });
        }
      } else {
        res.status(403).json({ message: "Bad token" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

export async function isUser(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(403).json({ message: "Token not exist" });
  } else {
    const decodedToken = decodeToken(token);
    if (decodedToken && decodedToken.id && decodedToken.email) {
      try {
        const databaseConnection = Database.getInstance().getConnection();

        const user = new UserDb(
          databaseConnection,
          decodedToken.email,
          decodedToken.id
        );

        const respone = await user.getUserTypeById();

        if (respone.length === 1) {
          if (respone[0].type === "user") {
            next();
          } else {
            res.status(403).json({ message: "Forbidden" });
          }
        } else {
          res.status(500).json({ message: "Server error" });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
      }
    } else {
      res.status(403).json({ message: "Bad token" });
    }
  }
}
