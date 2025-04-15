import { Connection } from "mysql2/typings/mysql/lib/Connection";
import { ResultSetHeader } from "mysql2";
import Database from "../db_connection";
import { AddOferReturnInterface } from "../../types/travels";

class TravelsController {
  private title: string;
  private images: Express.Multer.File[];
  private db: Connection;
  private travelOfferId: number | null;

  constructor(title: string, images: Express.Multer.File[]) {
    this.title = title;
    this.images = images;
    this.db = Database.getInstance().getConnection();
    this.travelOfferId = null;
  }

  private prepareImages() {
    if (this.travelOfferId && this.images && this.images.length > 0) {
      return this.images.map((image) => [image.path || "", this.travelOfferId]);
    }
    return [];
  }

  private async addImages() {
    const query = "INSERT INTO travel_images (path, travel_offer_id) VALUES ?";

    const preparedImages = this.prepareImages();

    if (preparedImages.length === 0) {
      return;
    }

    try {
      await this.db.promise().query<ResultSetHeader>(query, [preparedImages]);
    } catch (error) {
      console.error("Wystąpił błąd przy dodawaniu obrazów:", error);
    }
  }

  private async insertTravel() {
    const query = "INSERT INTO travels (title) VALUES (?)";

    const [ResultSetHeader] = await this.db
      .promise()
      .query<ResultSetHeader>(query, [this.title]);

    this.travelOfferId = (ResultSetHeader as { insertId: number }).insertId;

    return true;
  }

  public async addTravelOffer(): Promise<AddOferReturnInterface> {
    const connection = this.db;

    try {
      await connection.promise().beginTransaction();
      await this.insertTravel();

      await this.addImages();
      await connection.promise().commit();

      return {
        status: 201,
        travelId: this.travelOfferId,
      };
    } catch (e) {
      const errorMessage = await connection.promise().rollback();
      console.log(errorMessage);
      console.log(e);
      return {
        status: 500,
      };
    }
  }
}

export default TravelsController;
