import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';
import { Request } from 'express';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { Role } from 'src/common/enums/role.enum';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post('/register')
    register(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({})
    @ApiOkResponse({})
    async login(@Req() req: Request, @Body() loginUserDto: LoginDto) {
        return await this.userService.login(req, loginUserDto);
    }

    @Post('/refresh-access-token')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({})
    async refreshAccessToken(@Body() refreshAccessTokenDto: RefreshAccessTokenDto) {
        return await this.userService.refreshAccessToken(refreshAccessTokenDto);
    }

    @Get('data')
    @UseGuards(AuthGuard('jwt'))
    @Roles(Role.Admin)
    @ApiBearerAuth()
    @ApiOperation({})
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    findAll() {
        return "Passed!"
    }
}
