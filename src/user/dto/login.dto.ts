import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LogInDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'test@test.com', description: 'user email must be unique ', format: 'email' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '123456', description: 'the login password' })
    password: string;

}