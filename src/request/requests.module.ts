import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Request } from './request.entity';
import { RequestsService } from "./requests.service";
import { RequestsController } from "./requests.controller";
import { Transaction } from "src/transactions/transaction.entity";
import { User } from "src/users/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Request, User, Transaction])],
    controllers: [RequestsController],
    providers: [RequestsService]
})
export class RequestsModule {}