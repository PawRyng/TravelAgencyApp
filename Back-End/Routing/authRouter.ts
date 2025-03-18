import { Router, Request, Response } from "express";
import Login from "../controllers/login/login";
import Register from "../controllers/register/register";
import { newRefreshToken } from "../controllers/jwt/token";

const router = Router();

router.post("/token", (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const newToken = newRefreshToken(refreshToken);

  res.sendStatus(newToken.status).send(newToken);
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const login = new Login(email, password);
  try {
    const response = await login.loginUser();
    res.status(response.status).json(response);
  } catch (error) {
    console.error("Login failed:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

// dodac midleware do sprawdzania admina
router.post("/register-admin", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const register = new Register(email, password);
  try {
    const createdUser = await register.createAdmin();
    res.status(createdUser.status).json(createdUser);
  } catch (error) {
    console.error("Login failed:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

router.post("/register-user", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const register = new Register(email, password);
  try {
    const createdUser = await register.createUser();
    res.status(createdUser.status).json(createdUser);
  } catch (error) {
    console.error("Login failed:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

export default router;
