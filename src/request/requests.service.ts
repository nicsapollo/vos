import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "./request.entity";
import { CreateRequestDto } from "./dtos/create-request.dto";

@Injectable()
export class RequestsService {
    constructor(@InjectRepository(Request) private readonly requestRepository: Repository<Request>) { }
    
    async create(dto: CreateRequestDto) { 
        const request = this.requestRepository.create(dto);

        return await this.requestRepository.save(request)
    }

    findMany() {
        return this.requestRepository.find();
    }

    findOne(id: number) {
        return this.requestRepository.findOne({ where: { id } });
    }

    async update(id: number ,dto: CreateRequestDto) {
        const request = await this.requestRepository.findOne({ where: { id } });
        
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