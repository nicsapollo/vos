import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put } from "@nestjs/common";
import { MenusService } from "./menus.service";
import { CreateMenuDto } from "./dtos/create-menu.dto";

@Controller('menus')
export class MenusController {
    constructor(private readonly menuService: MenusService) { }
    
    @Post('/create')
    create(@Body() dto: CreateMenuDto) {
        return this.menuService.create(dto)
    }

    @Get('/all')
    search() {
        return this.menuService.findMany()
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.menuService.findOne(+id)
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() dto: CreateMenuDto) {
        return this.menuService.update(id, dto);
    }

    @Delete('delete/:id')
    delete(@Param('id') id: number) {
        // console.log('Received id:', id);
        return this.menuService.delete(id);
    }

}