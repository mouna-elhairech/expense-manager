import { Roles } from '../../entities/entities/Roles';
import { Expense } from 'src/expenses/entities/expense.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    roles: Roles[];
    depenses: Expense[];
}
