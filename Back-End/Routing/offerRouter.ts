import { Router, Request, Response } from "express";
import { isAdmin } from "../middleware/checkUser";
import uploadTravelsMiddleware from "../middleware/travelsUploadMiddleware";
import { travelsValidator } from "../controllers/travels/travelsValidator";
import TravelsController from "../controllers/travels/travelsController";

const router = Router();

router.post(
  "/add",
  isAdmin,
  uploadTravelsMiddleware.array("images", 10),
  travelsValidator,
  async (req: Request, res: Response) => {
    const file = req.files as Express.Multer.File[];

    try {
      const travelController = new TravelsController(req.body.title, file);
      const respone = await travelController.addTravelOffer();
      res.status(respone.status as number).json(respone.travelId);
    } catch (e) {
      res.status(500).json("Server error");
    }
  }
);

// napisać middleware sprawdzające czy dana osoba może przeglądać ofertę
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid travel ID" });
    return;
  }

  try {
    const travelController = new TravelsController(null, null, Number(id));
    const respone = await travelController.showOffer();

    res.status(200).json(respone);
  } catch (e) {
    res.status(500).json("Server error");
  }
});

export default router;
