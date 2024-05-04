import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionItem } from "./transaction-item.entity";
import { CreateTransactionItemDto } from "./dtos/create-transaction-item.dto";

@Injectable()
export class TransactionItemsService {
    constructor(@InjectRepository(TransactionItem) private readonly transactionItemRepository: Repository<TransactionItem>) { }
    
    async create(dto: CreateTransactionItemDto) { 
        const user = this.transactionItemRepository.create(dto);

        return await this.transactionItemRepository.save(user)
    }

    findMany() {
        return this.transactionItemRepository.find();
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