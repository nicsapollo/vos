import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { Request } from "./request.entity";
import { CreateRequestDto } from "./dtos/create-request.dto";
import { User } from "src/users/user.entity";
import { Transaction } from "src/transactions/transaction.entity";
import { TransactionItem } from "src/transaction-items/transaction-item.entity";
import { Menu } from "src/menu/menu.entity";

@Injectable()
export class RequestsService {
    constructor(@InjectRepository(Request) private readonly requestRepository: Repository<Request>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionItem) private readonly transactionItemRepository: Repository<TransactionItem>,
    @InjectRepository(Menu)private readonly menuRepository: Repository<Menu>
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

    async createOrder(dto: CreateRequestDto, menuItemList: any) {
        console.log("Mao neh");
        console.log(JSON.stringify(dto));
        console.log(JSON.stringify(menuItemList));

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

        const request = this.requestRepository.create(dto);

        request.user = user;
        request.transactions = transaction;
        request.transactionItems = [];

        
        

        if (dto.requestType == 'ORDER') {
            for (const menuItem of menuItemList.menuItemList) {
                
                const menu = await this.menuRepository.findOne({ where: { id: menuItem.id } });
                if (!menu) {
                    throw new Error(`Menu with ID ${menuItem.id} not found.`);
                }
                // Create a new transaction-item entity
                const transactionItem = new TransactionItem();
                // const menu = await this.menuRepository.findOne({ where: { id: menuItem.id } });                

                transactionItem.menuId = menuItem.id;
                // transactionItem.transaction = transaction;
                // transactionItem.request = request;
                transactionItem.quantity = menuItem.quantity;
                transactionItem.itemType = "FOOD";
                transactionItem.status = "PENDING";
                transactionItem.amount = menuItem.quantity * menuItem.price;


                await this.transactionItemRepository.save(transactionItem);

                request.transactionItems.push(transactionItem);
                transaction.transactionItems.push(transactionItem);
            }
        }

        await this.transactionRepository.save(transaction)

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

        if (request.requestType == 'ORDER') { 
            
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
            for (const transactionItem of transactionItems) {
                if (transactionItem.status == 'PENDING' && dto.status == 'APPROVED' && transactionItem.itemType == 'FOOD') {
                    transactionItem.status = 'UNPAID'
                    const tA = parseFloat(transaction.totalAmount + "");
                    const a = parseFloat(transactionItem.amount + "");
                    const total = tA + a;
                    transaction.totalAmount = total;
                } else {
                    transactionItem.status = 'CANCELLED'
                    
                }
                await this.transactionItemRepository.save(transactionItem);
                transaction.transactionItems.push(transactionItem);
            };

            console.log('Transaction:', transaction); // Log the value of transaction
            if (!transaction) {
                throw new Error('Transaction not found');
            }

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