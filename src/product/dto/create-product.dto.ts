import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto  {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'name' })
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'topic' })
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 100 })
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 100 })
    stock: number;

}
