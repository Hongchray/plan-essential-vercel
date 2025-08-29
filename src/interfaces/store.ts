import { IProduct } from "./product";
import { IUser } from "./user";

export interface IStore {
  id: string;
  name: string;
  logo?: string | null;
  banner?: string | null;
  userId: string;
  user?: IUser;
  phone?: string | null;
  address?: string | null;
  telegram?: string | null;
  chatId?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  status?: string | null;
  createdAt: Date;
  updatedAt: Date;
  product?: IProduct[];
}