import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductEntity {
    private readonly id: string;
    private readonly name: string;
    private readonly sku: string;
    private readonly images: Array<string>;
    private readonly description: string;
    private readonly price: number;
    private readonly special_price: number;
    private readonly quantity: number;
    private readonly status: string;
    private readonly category_ids: Array<string>;
    private readonly create_time: string;
    private readonly update_time: string;

    constructor(payload) {
        this.id = payload._id || "";
        this.name = payload.name || "";
        this.sku = payload.sku || "";
        this.images = payload.images || [];
        this.description = payload.description || "";
        this.price = payload.price || 0;
        this.special_price = payload.special_price || 0;
        this.quantity = payload.quantity || 0;
        this.status = payload.status || "ACTIVE";
        this.category_ids = payload.category_ids || [];
        this.create_time = payload.createdAt || "";
        this.update_time = payload.updatedAt || "";
    }

    static handleProductNotFound() {
        throw new HttpException(
            'product not found',
            HttpStatus.NOT_FOUND,
        );
    }

    static handleProductAlreadyExist() {
        throw new HttpException(
            'product already exist',
            HttpStatus.CONFLICT,
        );
    }
}