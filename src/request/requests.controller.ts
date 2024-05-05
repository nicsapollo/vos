import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put } from "@nestjs/common";
import { RequestsService } from "./requests.service";
import { CreateRequestDto } from "./dtos/create-request.dto";

@Controller('requests')
export class RequestsController {
    constructor(private readonly requestService: RequestsService) { }
    
    @Post('/sendRequest')
    create(@Body() dto: CreateRequestDto) {
        return this.requestService.create(dto)
    }

    @Get('/all')
    search() {
        return this.requestService.findMany()
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.requestService.findOne(+id)
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() dto: CreateRequestDto) {
        return this.requestService.update(id, dto);
    }

    @Delete('delete/:id')
    delete(@Param('id') id: number) {
        // console.log('Received id:', id);
        return this.requestService.delete(id);
    }

}