import { RowDataPacket } from "mysql2";
export type ValidationReturn = {
  status: number;
  message?: string;
};

export interface User extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  salt: string;
  first_name: string;
  last_name: string;
  type: "admin" | "user";
  active: 1 | 0;
}
