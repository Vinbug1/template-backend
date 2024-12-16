import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class SavingsGoal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    targetAmount: number;

    @Column()
    currentAmount: number;

    @Column()
    targetDate: Date;

    @ManyToOne(() => User, (user) => user.id)
    user: User;
}
