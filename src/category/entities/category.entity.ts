export class CategoryEntity {
    private readonly name: string;
    private readonly description: string;
    private readonly image: string;
    private readonly create_time: string;
    private readonly update_time: string;
    private readonly status: string;

    constructor(payload) {
        this.name = payload.name || "";
        this.description = payload.description || "";
        this.image = payload.image || "";
        this.create_time = payload.createdAt || "";
        this.update_time = payload.updatedAt || "";
        this.status = payload.status || "ACTIVE";
    }
}