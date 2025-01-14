import { UserService } from '../../user/user.service';
import { Request } from 'express';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userService;
    constructor(userService: UserService);
    validate(request: Request, validationPayload: {
        id: number;
    }): Promise<any>;
    private extractJwtToken;
}
export {};
