import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column({nullable: false})
    password: string;

    @Column({ type:'enum' , enum: UserRole, default: UserRole.USER})
    role: UserRole;

    @Column({default: null})
    token: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
