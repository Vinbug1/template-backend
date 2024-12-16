import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Expense {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @Column()
    category: string;

    @Column()
    date: Date;

    @ManyToOne(() => User, (user) => user.id)
    user: User;
}
