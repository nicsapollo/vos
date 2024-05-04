import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "./transaction.entity";
import { CreateTransactionDto } from "./dtos/create-transaction.dto";

@Injectable()
export class TransactionsService {
    constructor(@InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>) { }
    
    async create(dto: CreateTransactionDto) { 
        const user = this.transactionRepository.create(dto);

        return await this.transactionRepository.save(user)
    }

    findMany() {
        return this.transactionRepository.find();
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

}