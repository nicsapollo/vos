import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "./transaction.entity";
import { CreateTransactionDto } from "./dtos/create-transaction.dto";
import { User } from "src/users/user.entity";

@Injectable()
export class TransactionsService {
    constructor(@InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)private readonly userRepository: Repository<User>
    ) { }
    
    async create(dto: CreateTransactionDto): Promise<Transaction> {
        // Calculate the end time based on the current time and hours from the DTO
        const currentTime = new Date();
        const endTime = new Date(currentTime.getTime() + dto.hours * 60 * 60 * 1000); // Convert hours to milliseconds

        // Create a new transaction entity
        const transaction = new Transaction();
        transaction.userId = dto.userId;
        transaction.dateEndTime = endTime; // Set the end time

        await this.userRepository.update(dto.userId, { status: true }); 

        // Save the transaction to the database
        return await this.transactionRepository.save(transaction);
    }


    findMany() {
        return this.transactionRepository.find();
    }

    async findManyWithUserNames(): Promise<Transaction[]> {
    return this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user') // Assuming the relationship is named "user" in your Transaction entity
      .getMany();
    }

    async checkout(id: number): Promise<any> {
        // Find the transaction by its ID to get the associated user ID
        const transaction = await this.transactionRepository.findOne({ where: { id } });

        if (!transaction) {
            throw new Error(`Transaction with ID ${id} not found.`);
        }

        const userId = transaction.userId;

        // Get the current time
        const currentTime = new Date();

        // Update the transaction's dateEndTime to the current time
        await this.transactionRepository.update({ id: id }, { dateEndTime: currentTime, status: "PAID" });

        // Set the user's status to false
        await this.userRepository.update(userId, { status: false });

        return { message: 'Succesfully checkedout' }
    }

    findOne(id: number) {
        return this.transactionRepository.findOne({ where: { id } });
    }

    async update(id: number, dto: CreateTransactionDto) {
        const user = await this.transactionRepository.findOne({ where: { id } });
        
        Object.assign(user, dto);

        return await this.transactionRepository.save(user);
    }

    async delete(id: number) {
        const user = await this.transactionRepository.findOne({ where: { id } });

        return await this.transactionRepository.remove(user);
    }

    async getLatestTransactionByUsername(username: string): Promise<Transaction | null> {
        // Find the user by username
        const user = await this.userRepository.findOne({ where: { username } });

        if (!user) {
            // If user doesn't exist, return null
            return null;
        }

        // Fetch the latest transaction for the user
        const latestTransaction = await this.transactionRepository.findOne({
            where: {
                userId: user.id,
            },
            order: {
                dateCreated: 'DESC', // Fetch the latest transaction based on the dateCreated column
            },
        });

        return latestTransaction;
    }


}