import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dtos/create-transaction.dto";

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) { }
    
    @Post('/create')
    create(@Body() dto: CreateTransactionDto) {
        // console.log(`hours: ${dto.hours}, userId: ${dto.userId}`);
        return this.transactionService.create(dto)
    }

    @Post('/checkout/:id')
    checkout(@Param('id') id: number) {
        return this.transactionService.checkout(id)
    }

    @Get('/all')
    search(@Body() dto: CreateTransactionDto) {
        return this.transactionService.findMany()
    }

    @Get('/allTransactions')
    searchTransactionsWithUser(@Body() dto: CreateTransactionDto) {
        return this.transactionService.findManyWithUserNames()
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