import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { MenusService } from "./menus.service";
import { CreateMenuDto } from "./dtos/create-menu.dto";
import { UpdateMenuDto } from "./dtos/update-menu.dto";
import { FileInterceptor } from '@nestjs/platform-express';

import { Express } from 'express'; // Import Express

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

    // @Put('edit/:id')
    // update(@Param('id') id: number, @Body() dto: UpdateMenuDto) {
    //     console.log('Received id:', id);
    //     console.log('Received dto:', dto);
    //     return this.menuService.update(id, dto);
    // }

    @Put('edit/:id')
        update(@Param('id') id: number, @Body() body: any) {
        console.log('Received id:', id);
        console.log('Received body:', body);
        return this.menuService.update(id, body);
    }

    // @Put('edit/:id')
    // @UseInterceptors(FileInterceptor('file')) // This will parse 'file' field from form-data
    // update(@Param('id') id: number, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
    //     console.log('Received id:', id);
    //     console.log('Received body:', body);
    //     console.log('Received file:', file); // This will contain the uploaded file object
    //     return this.menuService.update(id, body, file); // Pass the file to your service method
    // }

    @Delete('delete/:id')
    delete(@Param('id') id: number) {
        // console.log('Received id:', id);
        return this.menuService.delete(id);
    }

}