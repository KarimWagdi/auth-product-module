import { HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { LogInDto } from './dto/login.dto';
export declare class UserService {
    usersRepository: Repository<User>;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: AuthService);
    create(createUserDto: CreateUserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data?: undefined;
    } | {
        statusCode: HttpStatus;
        message: string;
        data: {
            access_token: string;
            newUser: {
                password: string;
                email: string;
                role: import("./entities/user.entity").UserRole;
            } & User;
        };
    }>;
    logIn(loginDto: LogInDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data?: undefined;
    } | {
        statusCode: HttpStatus;
        message: string;
        data: {
            access_token: string;
            user: User;
        };
    }>;
    findOne(id: number): Promise<User>;
    updateToken(userId: number, refreshToken: string): Promise<void>;
}
