import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsEnum } from "class-validator";

export class LogInDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'test@test.com' })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ example: '123456' })
    password: string;

}