import { ICategory } from "./category";
import { IProductImage } from "./product-image";
import { IStore } from "./store";

export interface IProduct {
  id: string;
  code?: string | null;
  name: string;
  price: number;
  storeId: string;
  store?: IStore;
  status: string;
  description?: string | null;
  categoryId: string;
  category?: ICategory;
  createdAt: Date;
  updatedAt: Date;
  productImage?: IProductImage[];
}