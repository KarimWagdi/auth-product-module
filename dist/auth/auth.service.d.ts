import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    private readonly userServices;
    constructor(jwtService: JwtService, userServices: UserService);
    generateAccessToken(payload: any): Promise<{
        access_token: string;
    }>;
}
