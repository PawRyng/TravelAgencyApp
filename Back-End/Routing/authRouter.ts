import { Router, Request, Response } from "express";
import Login from "../controllers/login/login";
import Register from "../controllers/register/register";
import { newRefreshToken } from "../controllers/jwt/token";

const router = Router();

router.post("/token", (req: Request, res: Response) => {
  const { token, refreshToken } = req.body;

  const newToken = newRefreshToken(token, refreshToken);

  res.sendStatus(newToken.status).send(newToken);
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const login = new Login(email, password);
  const respone = await login.loginUser();
  res.sendStatus(respone.status).send(respone);
});

// dodac midleware do sprawdzania admina
router.post("/register-admin", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const register = new Register(email, password);
  const createdUser = await register.createAdmin();
  res.sendStatus(createdUser.status).send(createdUser);
});

router.post("/register-user", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const register = new Register(email, password);
  const createdUser = await register.createUser();
  res.sendStatus(createdUser.status).send(createdUser);
});

export default router;
