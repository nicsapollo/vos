import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "./transaction.entity";
import { CreateTransactionDto } from "./dtos/create-transaction.dto";
import { User } from "src/users/user.entity";
import { TransactionItem } from "src/transaction-items/transaction-item.entity";
import { Menu } from "src/menu/menu.entity";

@Injectable()
export class TransactionsService {
    constructor(@InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(TransactionItem) private readonly transactionItemRepository: Repository<TransactionItem>,
    @InjectRepository(Menu)private readonly menuRepository: Repository<Menu>
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


        // Create a new transaction-item entity
        const transactionItem = new TransactionItem();
        transactionItem.quantity = dto.hours;
        transactionItem.amount = dto.hours * 159;
        console.log('Created new transaction item:', transactionItem);

        // Object.assign(transactionItem, dto);

        if (!transaction.transactionItems) {
            transaction.transactionItems = []; // Initialize the array if it doesn't exist
        }

        transaction.totalAmount = transactionItem.amount;
        console.log('Updated total amount:', transaction.totalAmount);

        transaction.transactionItems.push(transactionItem);
        console.log('Added transaction item to transaction:', transactionItem);

        // Optionally, log the entire transaction object for further inspection
        console.log('Updated transaction object:', transaction);

        // Save the transactionItem to the database
        await this.transactionItemRepository.save(transactionItem);

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

    // transactionWithItems(id: number) {
    //     return this.transactionRepository.findOne({ where: { id }, relations: ["transactionItems"] });
    // }

    async transactionWithItems(id: number) {

        const transaction = await this.transactionRepository.findOne({ where: { id: id } })
        const transactionItems = await this.transactionItemRepository.find({ where: { transaction: transaction } })

        // const transaction =  this.transactionRepository
        // .createQueryBuilder('transaction')
        // .leftJoinAndSelect('transaction.transactionItems', 'transactionItem')
        // .where('transaction.id = :id', { id })
        // .andWhere('transactionItem.status != :status', { status: 'PENDING' })
        //     .getOne();
        
        // transactionWithItemsAndMenu.push({ transaction});

        const ItemsAndMenu = [];
        
        // Fetch menu for each transaction item
        for (const transactionItem of transactionItems) {
            if (transactionItem.status != 'PENDING') {
                if (transactionItem.menuId) {
                    const menuId = transactionItem.menuId; // Assuming 'menuId' is the column name for menu ID

                    // Fetch menu for the current transactionItem
                    const menu = await this.menuRepository.findOne({ where: { id: menuId } }); // Adjust the repository name and method as per your setup
                    
                    if (menu) {
                        ItemsAndMenu.push({ transactionItem, menu });
                    }
                }
                if (!transactionItem.menuId) {
                    ItemsAndMenu.push({ transactionItem });
                }
            }
            
            
                
        }
        
        transaction.transactionItemsAndMenu = ItemsAndMenu;

        return transaction;
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