import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "./request.entity";
import { CreateRequestDto } from "./dtos/create-request.dto";

@Injectable()
export class RequestsService {
    constructor(@InjectRepository(Request) private readonly requestRepository: Repository<Request>) { }
    
    async create(dto: CreateRequestDto) { 
        const user = this.requestRepository.create(dto);

        return await this.requestRepository.save(user)
    }

    findMany() {
        return this.requestRepository.find();
    }

    findOne(id: number) {
        return this.requestRepository.findOne({ where: { id } });
    }

    async update(id: number ,dto: CreateRequestDto) {
        const user = await this.requestRepository.findOne({ where: { id } });
        
        Object.assign(user, dto);

        return await this.requestRepository.save(user);
    }

    async delete(id: number) {
        const user = await this.requestRepository.findOne({ where: { id } });

        const remove =  await this.requestRepository.remove(user);

        return {
            message: 'success'
        }
    }

}