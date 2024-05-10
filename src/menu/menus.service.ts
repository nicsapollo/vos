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

    async update(id: number, updateMenuDto: UpdateMenuDto, file: Express.Multer.File): Promise<Menu> {
        const menu = await this.menuRepository.findOne({ where: { id } });

        if (!menu) {
        throw new Error('Menu not found');
        }

        // // Update menu properties from the DTO
        menu.name = updateMenuDto.name;
        menu.rating = updateMenuDto.rating;
        menu.price = updateMenuDto.price;

        // // Handle file upload if provided
        if (file) {
        // Assuming you have a property like 'imagePath' in your Menu entity
        menu.image = file.filename; // Store the file path or any other relevant data
        }

        // Save the updated menu
        await this.menuRepository.save(menu);
        
        return menu;
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