import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from './transaction.entity';
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Transaction])],
    controllers: [TransactionsController],
    providers: [TransactionsService]
})
export class TransactionsModule {}