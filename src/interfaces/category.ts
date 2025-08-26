import { IProduct } from "./product";

export interface ICategory {
  id: string;
  code?: string | null;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  product?: IProduct[];
}