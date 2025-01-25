import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto  {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'name', description: 'The name of the product'})
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'topic', description: 'The topic of the product'})
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 100, description: 'The price of the product'})
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 100, description: 'The number of products in stock'})
    stock: number;

}
