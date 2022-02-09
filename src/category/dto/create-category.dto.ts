import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, isNotEmpty, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    readonly description: string;

    @ApiProperty()
    readonly image: string;
}