import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Request } from 'express';
import { FilterForGetListMethods } from 'src/common/utils/filter-get-list.common';
import { QueryForGetListMethods } from 'src/common/utils/query-get-list.common';

@Controller('categories')
export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @Roles(Role.Admin)
    @ApiBearerAuth()
    createCategory(@Body() createCategoryDto: CreateCategoryDto, @Req() req) {
        const userId = req.user._id;
        return this.categoryService.createCategory(createCategoryDto, userId);
    }

    @Get()
    listCategories(@Req() req: Request) {
        const filter = FilterForGetListMethods(req.query);
        const query = QueryForGetListMethods(req.query);
        return this.categoryService.listCategories(filter, query);
    }
}
