import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
    
    @IsDefined()
    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    id: number;

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