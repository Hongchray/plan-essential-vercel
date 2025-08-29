import { IStore } from "./store";

export interface IUser {
  id: string;
  email: string;
  password: string;
  name?: string | null;
  phone?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  stores?: IStore[];
}