import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'test@test.com', description: 'user email must be unique', format: 'email'})
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '123456', description: 'the login password' })
    password: string;

    @IsEnum(UserRole)
    @ApiProperty({ example: 'user', description: 'the user permission in the app and default user' })
    role: UserRole;
}
