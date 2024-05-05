import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Menu } from "./menu.entity";
import { CreateMenuDto } from "./dtos/create-menu.dto";

@Injectable()
export class MenusService {
    constructor(@InjectRepository(Menu) private readonly menuRepository: Repository<Menu>) { }
    
    async create(dto: CreateMenuDto) { 
        const user = this.menuRepository.create(dto);

        return await this.menuRepository.save(user)
    }

    findMany() {
        return this.menuRepository.find();
    }

    findOne(id: number) {
        return this.menuRepository.findOne({ where: { id } });
    }

    async update(id: number ,dto: CreateMenuDto) {
        const user = await this.menuRepository.findOne({ where: { id } });
        
        Object.assign(user, dto);

        return await this.menuRepository.save(user);
    }

    async delete(id: number) {
        const user = await this.menuRepository.findOne({ where: { id } });

        const remove =  await this.menuRepository.remove(user);

        return {
            name: remove.name,
            message: 'success'
        }
    }

}