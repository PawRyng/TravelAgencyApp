import express, { Request, Response } from "express";
import authRouter from "./Routing/authRouter";

// Tworzymy instancję aplikacji Express
const app = express();
app.use(express.json());

// Ustawienie portu
const PORT = process.env.PORT || 3000;

app.use("/auth", authRouter);

// Obsługa błędów 404
app.use((req: Request, res: Response) => {
  res.status(404).send("Nie znaleziono strony!");
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
