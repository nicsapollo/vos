import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { MenusService } from "./menus.service";
import { CreateMenuDto } from "./dtos/create-menu.dto";
import { UpdateMenuDto } from "./dtos/update-menu.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; // Import Express
import { storage } from './storage.config';
import { Response } from 'express';
import * as path from 'path';
import { join, normalize } from 'path';
import * as fs from 'fs';

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

    // @Get('/all')
    // async search(@Res() res: Response) {
    //     // Fetch all menu items from the service
    //     const menuItems = await this.menuService.findMany();

    //     // Append image URL to each menu item
    //     const menuItemsWithImageUrl = menuItems.map(item => ({
    //     ...item,
    //     imageUrl: `./uploads/menu_file/${item.image}` // Construct the URL
    //     }));

    //     // Return menu items with image URL
    //     return res.json(menuItemsWithImageUrl);
    // }

    // @Get('/images/:fileName')
    // async getImage(@Param('fileName') fileName: string, @Res() res: Response) {
    //     // Set the content type based on the file extension
    //     res.setHeader('Content-Type', 'image/jpeg'); // Adjust content type as per your file type

    //     // Send the image file
    //     // const absolutePath = join(__dirname, '..', '..', '..', 'uploads', 'menu_files', fileName);
    //     res.sendFile(fileName, { root: path.join(__dirname, '..', '..', '..','uploads', 'menu_files') });
    //     // Adjust the path to match your project structure
    // }

    @Get('imageItem/:id/')
    async getAvatar(@Param('id') id: string, @Res() res: Response): Promise<void> {
        const imagePath = `../vos/uploads/menu_files/${id}`;
        const stream = fs.createReadStream(imagePath);
        stream.pipe(res);
    }

    @Get('/images/:fileName')
    async getImage(@Param('fileName') fileName: string, @Res() res: Response) {
        try {
            // Set the content type based on the file extension
            res.setHeader('Content-Type', 'image/jpeg'); // Adjust content type as per your file type

            // Construct the absolute path to the file
            const absolutePath = join(__dirname, '..', '..',  'uploads', 'menu_files', fileName);
            const normalizedPath = normalize(absolutePath);

            // Send the image file
            res.sendFile(normalizedPath);
        } catch (error) {
            console.error('Error while sending file:', error);
            res.status(404).send({ message: 'File not found' });
        }
    }

    // @Put('edit/:id')
    // update(@Param('id') id: number, @Body() dto: UpdateMenuDto) {
    //     console.log('Received id:', id);
    //     console.log('Received dto:', dto);
    //     return this.menuService.update(id, dto);
    // }

    // @Put('edit/:id')
    //     update(@Param('id') id: number, @Body() body: any) {
    //     console.log('Received id:', id);
    //     console.log('Received body:', body);
    //     return this.menuService.update(id, body);
    // }

    @Put('edit/:id')
    @UseInterceptors(FileInterceptor('file', { storage })) // This will parse 'file' field from form-data
    update(@Param('id') id: number, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
        console.log('Received id:', id);
        console.log('Received body:', body);
        console.log('Received file:', file); // This will contain the uploaded file object
        return this.menuService.update(id, body, file); // Pass the file to your service method
    }

    @Delete('delete/:id')
    delete(@Param('id') id: number) {
        // console.log('Received id:', id);
        return this.menuService.delete(id);
    }

    

}