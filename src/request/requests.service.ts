import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { Request } from "./request.entity";
import { CreateRequestDto } from "./dtos/create-request.dto";
import { User } from "src/users/user.entity";
import { Transaction } from "src/transactions/transaction.entity";

@Injectable()
export class RequestsService {
    constructor(@InjectRepository(Request) private readonly requestRepository: Repository<Request>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)private readonly transactionRepository: Repository<Transaction>
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
        request.transaction = transaction;


        return await this.requestRepository.save(request)
    }

    findMany() {
        return this.requestRepository.find();
    }

    findOne(id: number) {
        return this.requestRepository.findOne({ where: { id } });
    }

    async update(id: number ,dto: CreateRequestDto) {
        const request = await this.requestRepository.findOne({ where: { id }, relations: ["transaction"] });
        if (!request) {
            throw new Error('Request not found');
        }
        
        console.log(`E trigger pa ${request.requestType} sa ${dto.status}`)
        if (request.requestType == 'EXTEND TIME' && dto.status == 'APPROVED') { 
            console.log("Na trigger")
            
            const transaction = request.transaction;
            if (!transaction) {
                throw new Error('Transaction not found');
            }
            // Parse the existing dateEndTime string into a Date object
            const dateEndTime = new Date(transaction.dateEndTime);
            
            // Add 2 hours
            dateEndTime.setHours(dateEndTime.getHours() + request.hours);

            // Convert the updated Date object back to a string in the desired format
            // const updatedDateEndTime = dateEndTime.toISOString().slice(0, 19).replace('T', ' ');

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