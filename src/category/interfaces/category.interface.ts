import { Document } from "mongoose";

export interface Category extends Document {
    name: string;
    description: string;
    image: string;
    create_user: any;
    update_user: any;
    status: string;
}