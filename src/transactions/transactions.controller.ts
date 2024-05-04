import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dtos/create-transaction.dto";

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) { }
    
    @Post()
    create(@Body() dto: CreateTransactionDto) {
        return this.transactionService.create(dto)
    }

    @Get()
    search(@Body() dto: CreateTransactionDto) {
        return this.transactionService.findMany()
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.transactionService.findOne(+id)
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() dto: CreateTransactionDto) {
        return this.transactionService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.transactionService.delete(id);
    }

}