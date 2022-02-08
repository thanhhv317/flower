import { Document } from "mongoose";

export interface User extends Document {
    fullname: string;
    email: string;
    password: string;
    phone: string;
    address: any;
    roles: Array<string>;
    image: string;
}