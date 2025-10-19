import { IProduct } from '../models/product'; // your mongoose document type

export interface ProductDTO {
  id: string;
  name: string;
  price: number;
  description: string;
  images: {
    public_id: string;
    url: string;
  }[];
  category: string; // just the category name
  seller: string;
  stock: number;
  ratings: number;
  numOfReviews: number;
}


export function toProductDto(product: IProduct | any): ProductDTO {
  return {
    id: product._id.toString(),
    name: product.name,
    price: product.price,
    description: product.description,
    images: product.images,
    category: product.category?.name || 'Unknown',
    seller: product.seller,
    stock: product.stock,
    ratings: product.ratings,
    numOfReviews: product.numOfReviews,
  };
}
