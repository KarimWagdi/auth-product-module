import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { UserRole } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'test@test.com' })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ example: '123456' })
    password: string;

    @IsEnum(UserRole)
    @ApiProperty({ example: 'user' })
    role: UserRole;
}
