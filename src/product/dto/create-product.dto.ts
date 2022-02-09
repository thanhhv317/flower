import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    readonly description: string;

    @ApiProperty()
    readonly images: Array<string>;

    @ApiProperty()
    readonly price: number;
    
    @ApiProperty()
    readonly special_price: number;
    
    @ApiProperty()
    readonly quantity: number;
    
    @ApiProperty()
    readonly category_ids: Array<string>;

    @ApiProperty()
    readonly status: string;
}