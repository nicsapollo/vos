import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Menu } from "./menu.entity";
import { CreateMenuDto } from "./dtos/create-menu.dto";
import { UpdateMenuDto } from "./dtos/update-menu.dto";

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

    // async update(id: number ,dto: UpdateMenuDto) {
    //     const user = await this.menuRepository.findOne({ where: { id } });
        
    //     Object.assign(user, dto);

    //     return await this.menuRepository.save(user);
    // }

    async update(id: number, body: any) {
        const menu = await this.menuRepository.findOne({ where: { id } });
        
        if (!menu) {
        throw new Error(`Menu with id ${id} not found`);
        }
        
        // Update menu properties from body
        if (body.name) {
        menu.name = body.name;
        }
        if (body.rating !== undefined) {
        menu.rating = body.rating;
        }
        if (body.price) {
        menu.price = body.price;
        }
        if (body.image) {
        // Assuming body.image contains the binary data
        menu.image = body.image;
        }
        
        return await this.menuRepository.save(menu);
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