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

    
        // Check if the user exists
        const user = await this.userRepository.findOne({ where: { id: dto.userId } });
        if (!user) {
            // Handle the case where the user doesn't exist
            throw new Error('User not found');
        }

        // Create a new transaction entity
        const transaction = new Transaction();
        transaction.user = user;
        transaction.dateEndTime = endTime; // Set the end time

        // Save the transaction to the database
        const savedTransaction = await this.transactionRepository.save(transaction);

        // Update the user's status
        await this.userRepository.update(dto.userId, { status: true }); 

        return savedTransaction;
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

    async findAllWithUserNames(): Promise<Transaction[]> {
        return this.transactionRepository.find({ relations: ['user'] });
    }

    async checkout(id: number): Promise<any> {
        // Find the transaction by its ID along with the associated user
        const transaction = await this.transactionRepository.findOne({ 
            where: { id },
            relations: ['user'] // Load the user relationship
        });

        if (!transaction) {
            throw new Error(`Transaction with ID ${id} not found.`);
        }

        // Access the associated user
        const user = transaction.user;

        // Check if the user exists
        if (!user) {
            throw new Error('User not found');
        }

        console.log(`User details:`, user);

        // Convert transaction object to JSON format for logging
        const transactionJSON = JSON.stringify(transaction, null, 2);
        console.log('Transaction details:', transactionJSON);

        // Get the current time
        const currentTime = new Date();

        // Update the transaction's dateEndTime to the current time
        await this.transactionRepository.update({ id: id }, { dateEndTime: currentTime, status: "PAID" });

        // Set the user's status to false
        await this.userRepository.update(user.id, { status: false });

        return { message: 'Succesfully checked out' };
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
                user: user, // Fix this line
            },
            order: {
                dateCreated: 'DESC', // Fetch the latest transaction based on the dateCreated column
            },
        });

        return latestTransaction;
    }


}