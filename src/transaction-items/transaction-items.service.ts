import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionItem } from "./transaction-item.entity";
import { CreateTransactionItemDto } from "./dtos/create-transaction-item.dto";
import { Request } from "src/request/request.entity";
import { Menu } from "src/menu/menu.entity";

@Injectable()
export class TransactionItemsService {
    constructor(@InjectRepository(TransactionItem) private readonly transactionItemRepository: Repository<TransactionItem>,
        @InjectRepository(Request) private readonly requestRepository: Repository<Request>,
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>) { }
    
    async create(dto: CreateTransactionItemDto) { 
        const user = this.transactionItemRepository.create(dto);

        return await this.transactionItemRepository.save(user)
    }

    findMany() {
        return this.transactionItemRepository.find();
    }

    async findManyitems(id: number) {

        const transactionItems = await this.transactionItemRepository.find({
            where: {
                request: { id: id } // Assuming 'request' is the column name for the relationship
            } // Load the associated Request entity
        });

        const itemsWithMenu = [];
        
        // Fetch menu for each transaction item
        for (const transactionItem of transactionItems) {
            const menuId = transactionItem.menuId; // Assuming 'menuId' is the column name for menu ID

            // Fetch menu for the current transactionItem
            const menu = await this.menuRepository.findOne({ where: { id: menuId } }); // Adjust the repository name and method as per your setup

            if (menu) {
                itemsWithMenu.push({ transactionItem, menu });
            }
        }
        
        return itemsWithMenu;
    }


    findOne(id: number) {
        return this.transactionItemRepository.findOne({ where: { id } });
    }

    async update(id: number, dto: CreateTransactionItemDto) {
        const user = await this.transactionItemRepository.findOne({ where: { id } });
        
        Object.assign(user, dto);

        return await this.transactionItemRepository.save(user);
    }

    async delete(id: number) {
        const user = await this.transactionItemRepository.findOne({ where: { id } });

        return await this.transactionItemRepository.remove(user);
    }

}