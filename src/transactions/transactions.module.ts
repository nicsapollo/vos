import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from './transaction.entity';
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { User } from "src/users/user.entity";
import { TransactionItem } from "src/transaction-items/transaction-item.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Transaction, User, TransactionItem])],
    controllers: [TransactionsController],
    providers: [TransactionsService]
})
export class TransactionsModule {}