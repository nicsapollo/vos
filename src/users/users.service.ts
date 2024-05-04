import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }
    
    async create(dto: CreateUserDto) { 
        const user = this.userRepository.create(dto);

        return await this.userRepository.save(user)
    }

    findMany() {
        return this.userRepository.find();
    }

    findOne(id: number) {
        return this.userRepository.findOne({ where: { id } });
    }

    findOneUser(username: string) {
        return this.userRepository.findOne({ where: { username } });
    }

    async update(id: number ,dto: CreateUserDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        
        Object.assign(user, dto);

        return await this.userRepository.save(user);
    }

    async delete(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });

        return await this.userRepository.remove(user);
    }

    async findByUsername(username: string) {
        // Find the user in the user array by username
        const user = await this.userRepository.findOne({ where: { username } });

        return await this.userRepository.findOne({ where: { username } });
    }

}