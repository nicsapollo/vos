import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { TransactionItem } from './transaction-item.entity';
import { TransactionItemsService } from "./transaction-items.service";
import { TransactionItemsController } from "./transaction-items.controller";

@Module({
    imports: [TypeOrmModule.forFeature([TransactionItem])],
    controllers: [TransactionItemsController],
    providers: [TransactionItemsService]
})
export class TransactionItemsModule {}