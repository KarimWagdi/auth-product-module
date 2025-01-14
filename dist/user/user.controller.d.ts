import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/login.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: string;
        data?: undefined;
    } | {
        statusCode: import("@nestjs/common").HttpStatus;
        message: string;
        data: {
            access_token: string;
            newUser: {
                password: string;
                email: string;
                role: import("./entities/user.entity").UserRole;
            } & import("./entities/user.entity").User;
        };
    }>;
    logIn(loginDto: LogInDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: string;
        data?: undefined;
    } | {
        statusCode: import("@nestjs/common").HttpStatus;
        message: string;
        data: {
            access_token: string;
            user: import("./entities/user.entity").User;
        };
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
}
