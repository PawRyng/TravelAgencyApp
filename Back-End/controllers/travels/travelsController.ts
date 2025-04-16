import { Connection } from "mysql2/typings/mysql/lib/Connection";
import { ResultSetHeader } from "mysql2";
import Database from "../db_connection";
import {
  AddOferReturnInterface,
  TravelShowRespone,
  TravelInterface,
  RawTravelRow,
} from "../../types/travels";
import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";

class TravelsController {
  private title: string | null;
  private images: Express.Multer.File[] | null;
  private db: Connection;
  private travelOfferId: number | null;

  constructor(
    title?: string | null,
    images?: Express.Multer.File[] | null,
    travelOfferId?: number
  ) {
    this.title = title || null;
    this.images = images || null;
    this.db = Database.getInstance().getConnection();
    this.travelOfferId = travelOfferId || null;
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

  private async getTravel(): Promise<TravelInterface | null> {
    const query = `
    SELECT 
        t.id AS travel_id,
        t.title,
        ti.id AS image_id,
        ti.path
    FROM 
        travels t
    LEFT JOIN 
        travel_images ti ON t.id = ti.travel_offer_id
    WHERE 
        t.id = ?;
    `;

    const [rows] = await this.db
      .promise()
      .query<RawTravelRow[]>(query, [this.travelOfferId]);

    if (rows.length === 0) return null;

    const { id, title } = rows[0];

    const images = rows
      .filter((row) => row.image_id !== null)
      .map((row) => ({
        id: row.image_id as number,
        path: row.path as string,
      }));

    const result: TravelInterface = {
      id,
      title,
      images,
    };

    return result;
  }

  public async showOffer(): Promise<TravelShowRespone> {
    try {
      const travel = await this.getTravel();

      return {
        status: 200,
        travel,
      };
    } catch (e) {
      return {
        status: 500,
      };
    }
  }
}

export default TravelsController;
