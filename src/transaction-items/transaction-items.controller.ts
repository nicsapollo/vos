import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { TransactionItemsService } from "./transaction-items.service";
import { CreateTransactionItemDto } from "./dtos/create-transaction-item.dto";

@Controller('transactionItems')
export class TransactionItemsController {
    constructor(private readonly transactionItemService: TransactionItemsService) { }
    
    @Post()
    create(@Body() dto: CreateTransactionItemDto) {
        return this.transactionItemService.create(dto)
    }

    @Get()
    search(@Body() dto: CreateTransactionItemDto) {
        return this.transactionItemService.findMany()
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.transactionItemService.findOne(+id)
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() dto: CreateTransactionItemDto) {
        return this.transactionItemService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.transactionItemService.delete(id);
    }

}