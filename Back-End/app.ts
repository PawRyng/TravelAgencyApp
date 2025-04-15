import express, { Request, Response } from "express";
import authRouter from "./Routing/authRouter";
import offerRouter from "./Routing/offerRouter";
import dotenv from "dotenv";

dotenv.config();

// Tworzymy instancję aplikacji Express
const app = express();
app.use(express.json());
app.use(express.static("public"));

// Ustawienie portu
const PORT = process.env.PORT || 3000;

app.use("/auth", authRouter);
app.use("/travels", offerRouter);
// Obsługa błędów 404
app.use((req: Request, res: Response) => {
  res.status(404).send("Nie znaleziono strony!");
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
