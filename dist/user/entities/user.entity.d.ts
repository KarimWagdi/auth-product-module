export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    id: number;
    email: string;
    password: string;
    role: UserRole;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}
