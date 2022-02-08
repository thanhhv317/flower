import { UserEntity } from "./user.entity";

export class UserLoginEntity extends UserEntity {
    private readonly access_token: string;
    private readonly refresh_token: string;

    constructor(payload){
        super(payload);
        this.access_token = payload.access_token || "";
        this.refresh_token = payload.refresh_token || "";
    }
}