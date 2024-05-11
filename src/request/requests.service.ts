import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { Request } from "./request.entity";
import { CreateRequestDto } from "./dtos/create-request.dto";
import { User } from "src/users/user.entity";
import { Transaction } from "src/transactions/transaction.entity";
import { TransactionItem } from "src/transaction-items/transaction-item.entity";

@Injectable()
export class RequestsService {
    constructor(@InjectRepository(Request) private readonly requestRepository: Repository<Request>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionItem)private readonly transactionItemRepository: Repository<TransactionItem>
    ) { }

    async create(dto: CreateRequestDto) {
        console.log("Mao neh");
        console.log(JSON.stringify(dto));
        const user = await this.userRepository.findOne({ where: { id: dto.userId } });
        if (!user) {
            // Handle the case where the user doesn't exist
            throw new Error('User not found');
        }

        const transaction = await this.transactionRepository.findOne({ where: { id: dto.transactionId } } );
        if (!transaction) {
            // Handle the case where the user doesn't exist
            throw new Error('Transaction not found');
        }

        const request = this.requestRepository.create(dto);

        request.user = user;
        request.transactions = transaction;


        return await this.requestRepository.save(request)
    }

    findMany() {
        return this.requestRepository.find();
    }

    findOne(id: number) {
        return this.requestRepository.findOne({ where: { id } });
    }

    async update(id: number ,dto: CreateRequestDto) {
        const request = await this.requestRepository.findOne({ where: { id }, relations: ["transactions"] });
        if (!request) {
            throw new Error('Request not found');
        }
        
        if (request.requestType == 'EXTEND TIME' && dto.status == 'APPROVED') { 
            
            const transaction = request.transactions;

            // Fetch transactionItems related to the transaction
            const transactionItems = await this.transactionItemRepository.find({
                where: { transaction: { id: transaction.id } },
                relations: ["transaction"] // Assuming the name of the relation in TransactionItem entity is "transaction"
            });
            if (!transaction.transactionItems) {
                transaction.transactionItems = []; // Initialize the array if it doesn't exist
            }

            // Push each transactionItem from transactionItems to transaction.transactionItems
            transactionItems.forEach(transactionItem => {
                transaction.transactionItems.push(transactionItem);
            });

            console.log('Transaction:', transaction); // Log the value of transaction
            if (!transaction) {
                throw new Error('Transaction not found');
            }
            // Parse the existing dateEndTime string into a Date object
            const dateEndTime = new Date(transaction.dateEndTime);

            // Add 2 hours
            dateEndTime.setHours(dateEndTime.getHours() + request.hours);

            // Create a new transaction-item entity
            const transactionItem = new TransactionItem();
            transactionItem.quantity = request.hours;
            transactionItem.amount = request.hours * 159;
            
            const tA = parseFloat(transaction.totalAmount + "");
            const a = transactionItem.amount as number;
            const total = tA + a;
            transaction.totalAmount = total;
            console.log(`Mao lagi neh ${tA} + ${a} = ${total} = ${transaction.totalAmount}`)
            console.log(typeof tA, tA); // Check the type and value of tA
            console.log(typeof a, a);   // Check the type and value of a
            console.log(typeof total, total); // Check the type and value of total



            // Save the transactionItem to the database
            await this.transactionItemRepository.save(transactionItem);

            console.log('Transaction:', transaction); // Log the value of transaction
            transaction.transactionItems.push(transactionItem);

            // Update the transaction with the new dateEndTime
            transaction.dateEndTime = new Date(dateEndTime);
            transaction.dateLastUpdated = new Date();

            // Save the updated transaction
            await this.transactionRepository.save(transaction);

        }

        Object.assign(request, dto);

        return await this.requestRepository.save(request);
    }

    async delete(id: number) {
        const request = await this.requestRepository.findOne({ where: { id } });

        const remove =  await this.requestRepository.remove(request);

        return {
            message: 'success'
        }
    }

}