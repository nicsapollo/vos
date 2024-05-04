import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Menu } from './menu.entity';
import { MenusService } from "./menus.service";
import { MenusController } from "./menus.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Menu])],
    controllers: [MenusController],
    providers: [MenusService]
})
export class MenusModule {}