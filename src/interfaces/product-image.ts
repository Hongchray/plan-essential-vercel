import { IProduct } from "./product";

export interface IProductImage {
  id: string;
  url: string;
  productId: string;
  product?: IProduct;
  createdAt: Date;
  updatedAt: Date;
}
