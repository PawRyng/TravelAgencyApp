import { sign, verify, decode } from "jsonwebtoken";
export function generateToken(useid: number, email: string) {
  const secret = process.env.JWT_SECRET || "JWT_SECRET";
  const token = sign({ id: useid, email: email }, secret, {
    expiresIn: "15m",
  });
  return token;
}

export function generateRefreshToken(useid: number, email: string) {
  const secret = process.env.REFRESH_TOKEN_SECRET || "JWT_SECRET";
  const refreshToken = sign({ useid, email }, secret, { expiresIn: "2d" });
  return refreshToken;
}

// z bazą danych zrobić zapisanie tokenów dla zwiększenia bezpieczeństwa
export function newRefreshToken(refreshToken: string) {
  const secret = process.env.REFRESH_TOKEN_SECRET || "JWT_SECRET";
  try {
    const user = verify(refreshToken, secret);

    if (user && typeof user !== "string") {
      const accessToken = generateToken(user.id, user.email);

      return { status: 200, token: accessToken };
    }

    return { status: 403, message: "Invalid token payload" };
  } catch (error) {
    console.error("Error verifying token:", error);
    return { status: 500, message: "Internal server error or bad token" };
  }
}
