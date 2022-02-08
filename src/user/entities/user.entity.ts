export class UserEntity {
    public readonly id: string;
    private readonly fullname: string;
    private readonly email: string;
    private readonly phone: string;
    private readonly image: string;
    private readonly roles: Array<string>;
    private readonly address: any;
    private readonly create_time: string;
    private readonly update_time: string;

    constructor(payload) {
        this.id = payload._id || "";
        this.fullname = payload.fullname || "";
        this.email = payload.email || "";
        this.phone = payload.phone || "";
        this.image = payload.image || "";
        this.roles = payload.roles || [];
        this.address = payload.address || {};
        this.create_time = payload.createdAt || "";
        this.update_time = payload.updatedAt || "";
    }
}