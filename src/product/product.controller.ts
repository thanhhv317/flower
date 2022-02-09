import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { FilterForGetListMethods } from 'src/common/utils/filter-get-list.common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import {Request} from 'express';
import { QueryForGetListMethods } from 'src/common/utils/query-get-list.common';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('')
export class ProductController {

    constructor(private readonly productService: ProductService){}

    @Post('products')
    @UseGuards(AuthGuard('jwt'))
    @Roles(Role.Admin)
    @ApiBearerAuth()
    createProduct(@Body() createProductDto: CreateProductDto, @Req() req) {
        const userId = req.user._id;
        return this.productService.createProduct(createProductDto, userId);
    }

    @Get('products/:id')
    getProduct(@Param('id') productId: string) {
        return this.productService.getProduct(productId);
    }

    @Get('products')
    listProduct(@Req() req: Request) {
        const filter = FilterForGetListMethods(req.query);
        const query = QueryForGetListMethods(req.query);
        return this.productService.listProducts(filter, query);
    }

    @Put('products/:id')
    @UseGuards(AuthGuard('jwt'))
    @Roles(Role.Admin)
    @ApiBearerAuth()
    updateProduct(@Param('id') productId: string, @Body() updateProductDto: UpdateProductDto,  @Req() req) {
        const userId = req.user._id;
        return this.productService.updateProduct(productId, userId, updateProductDto);
    }

    @Delete('products/:id')
    @UseGuards(AuthGuard('jwt'))
    @Roles(Role.Admin)
    @ApiBearerAuth()
    deleteCategory(@Param('id') productId: string, @Req() req) {
        const userId = req.user._id;
        return this.productService.deleteProduct(productId, userId);
    }

}
