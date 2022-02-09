import { Document } from "mongoose";

export interface Product extends Document {
    name: string;
    description: string;
    images: Array<string>;
    sku: string;
    price: number;
    special_price: number;
    quantity: number;
    category_ids: Array<string>;    
    create_user: any;
    update_user: any;
    status: string;
}