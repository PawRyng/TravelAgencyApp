import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { travelImages, travelSchema } from "../../types/travels";

export const travelsValidator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const files = req.files as Express.Multer.File[];

  for (const image of files) {
    const isValid = travelImages.safeParse(image);

    if (!isValid.success) {
      res.status(400).json({
        message: "file validation",
        details: isValid.error.flatten(),
      });
      return;
    }
  }

  const bodyIsValid = travelSchema.safeParse(req.body);

  if (!bodyIsValid.success) {
    res.status(400).json({
      message: "validation error",
      details: bodyIsValid.error.flatten(),
    });
    return;
  }

  next();
};
