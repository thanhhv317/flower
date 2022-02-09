import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCategoryDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    readonly description: string;

    @ApiProperty()
    readonly image: string;
}