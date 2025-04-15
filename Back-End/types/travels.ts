import { object, z } from "zod";
import { config } from "../config/config";

export const travelSchema = object({
  title: z.string().min(3, "Tytuł jest za krótki"),
});

export const travelImages = object({
  mimetype: z
    .string()
    .refine(
      (val) => config.acceptedFilesType.includes(val),
      "this file type is not handle"
    ),
  size: z.number().max(5 * 1024 * 1024, "Image size is to big (max 5MB)"),
});

// interfaces

export interface AddOferReturnInterface {
  status: Number;
  travelId?: number | null;
}
