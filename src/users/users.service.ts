import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./dtos/create-user.dto";
import { Transaction } from "src/transactions/transaction.entity";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction) // Inject TypeORM repository for Transaction entity
    private readonly transactionRepository: Repository<Transaction>, // Use Repository<Transaction> directly
   ) { }
    
    async create(dto: CreateUserDto) { 
        const user = this.userRepository.create(dto);

        return await this.userRepository.save(user)
    }

    findMany() {
        return this.userRepository.find();
    }

    async findCustomers(): Promise<User[]> {
        return this.userRepository.find({ where: { userType: 'Customer' } });
    }

    async searchCustomers(): Promise<User[]> {
        // Find all users with userType = 'Customers'
        const customers = await this.userRepository.find({ where: { userType: 'Customer' } });

        // Fetch transactions within the time range for each customer
        const customersWithTransactions = await Promise.all(customers.map(async (user) => {
            // Log user details for debugging

            // Fetch transactions for the user within the specified time range
            const transactions = await this.transactionRepository.find({
                where: {
                    userId: user.id,
                    dateCreated: LessThanOrEqual(new Date()), // Current time
                    dateEndTime: MoreThanOrEqual(new Date()), // Current time
                },
            });
            user.transactions = transactions;
            return user;
        }));
        return customersWithTransactions;
    }

    findOne(id: number) {
        return this.userRepository.findOne({ where: { id } });
    }

    findOneUser(username: string) {
        return this.userRepository.findOne({ where: { username } });
    }

    async update(id: number ,dto: CreateUserDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        
        Object.assign(user, dto);

        return await this.userRepository.save(user);
    }

    async delete(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });

        return await this.userRepository.remove(user);
    }

    async findByUsername(username: string) {
        // Find the user in the user array by username
        const user = await this.userRepository.findOne({ where: { username } });

        return await this.userRepository.findOne({ where: { username } });
    }

    async getLatestTransactionByUsername(username: string): Promise<Transaction | null> {
        const user = await this.userRepository.findOne({ where: { username }, relations: ['transactions'] });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        console.log("User: ", user); // Log user object for debugging

        if (user.transactions.length === 0) {
            return null; // No transactions found for this user
        }

        // Sorting transactions by dateCreated in descending order and returning the first one (latest)
        const latestTransaction = user.transactions.sort((a, b) => b.dateCreated.getTime() - a.dateCreated.getTime())[0];
        
        return latestTransaction;
    }




}