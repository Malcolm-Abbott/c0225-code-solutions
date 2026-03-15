import { products } from './data';

export type Product = {
  productId: number;
  name: string;
  imageUrl: string;
  price: number;
  shortDescription: string;
  longDescription: string;
};

export async function readCatalog(): Promise<Product[]> {
  return products;
}

export async function readProduct(
  productId: number
): Promise<Product | undefined> {
  return products.find((p) => p.productId === productId);
}
