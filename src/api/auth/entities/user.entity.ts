import { BaseModel } from "src/core/lib/class/base-model.class";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'users'
})
export class User extends BaseModel{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        select: false
    })
    password: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: true })
    isActive: boolean;

    @Column('text', { array: true, default: ['user'] })
    roles: string[];

    @BeforeInsert()
    checkEmail() {
        this.email = this.email.toLowerCase().trim();
    }
    @BeforeUpdate()
    checkEmailUpdate() {
        this.checkEmail()
    }

}
