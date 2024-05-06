import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, Res } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { Response, Request, response } from "express";

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private jwtService: JwtService
    ) { }
    
    @Post()
    async create(@Body() dto: CreateUserDto) {
        // const hashedPassword = await bcrypt.hash(dto.password, 12)
        return this.userService.create(dto)
    }

    @Get('/all')
    search(@Body() dto: CreateUserDto) {
        return this.userService.findMany()
    }

    @Get('/searchCustomers')
    searchCustomers(@Body() dto: CreateUserDto) {
        return this.userService.searchCustomers()
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.userService.findOne(+id)
    }

    @Get('latestTransaction/:username')
    getLatestTransaction(@Param('username') username: string) {
        return this.userService.getLatestTransactionByUsername(username);
    }

    @Get('getUsername/:username')
    findByUsername(@Param('username') username: string) {
        return this.userService.findByUsername(username)
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() dto: CreateUserDto) {
        return this.userService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.userService.delete(id);
    }

    @Post('login')
    async login(
        @Body('username') username: string,
        @Body('password') password: string,
        @Res({passthrough: true}) response: Response
    ) {
        const user = await this.userService.findOneUser(username);

        if (!user) {
            throw new BadRequestException('Invalid Credentials')
        }

        if (password != user.password) {
            throw new BadRequestException('Invalid Credentials')
        }

        const jwt = await this.jwtService.signAsync({ id: user.id })
        
        response.cookie('jwt', jwt, {httpOnly: true})
        let responseUser = {
            user : user.username,
            type: user.userType,
            name: user.name

        }
        // return user

        return {
            user: responseUser,
            message: 'success',
            token: jwt
        }
    }

    @Get('user')
    async user(@Req() request: Request) {
        const cookie = request.cookies['jwt'];

        return cookie;
    }

}