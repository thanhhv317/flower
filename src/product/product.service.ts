import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPagination } from 'src/common/interfaces/pagination.interface';
import { orderObj } from 'src/common/utils/order-by-object.common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductService {

    constructor(
        @InjectModel('Product') private readonly productModel: Model<Product>
    ) { }

    async createProduct(createProductDto: CreateProductDto, userId: string, metadata = null): Promise<ProductEntity> {

        const checkProductNameExist = await this.checkProductNameExist(createProductDto.name, metadata);
        if (!!checkProductNameExist) {
            ProductEntity.handleProductAlreadyExist();
        }
        let product;
        try {
            product = new this.productModel({ ...createProductDto, update_user: userId, create_user: userId });
            await product.save();
            return new ProductEntity(product);
        } catch (error) {
            Logger.error(error);
        }
    }

    async getProduct(productId: string, metadata = null): Promise<ProductEntity> {
        if (productId.toString().length !== 24) {
            ProductEntity.handleProductNotFound();
        }
        let product;
        const condition = {
            $and: [
                { status: { $ne: "DELETE" } },
                { _id: productId }
            ]
        }
        try {
            product = await this.productModel.findOne(condition);
        } catch (error) {
            Logger.error(error)
        }
        if (!product) {
            ProductEntity.handleProductNotFound();
        }
        return new ProductEntity(product);
    }

    async listProducts(filter: any, query: any, metadata = null): Promise<{ products: ProductEntity[], pagination: IPagination }> {
        // search product by name, sku
        const { pageNumber, pageSize, orderBy } = filter;
        const sort = orderObj(orderBy);
        const skip =
            (parseInt(pageNumber, 10) - 1) * parseInt(pageSize, 10);
        const limit = parseInt(pageSize, 10);

        // search by category name

        const match = {
            $and: [
                { status: { $ne: "DELETE" } },
                {
                    name: {
                        $regex: new RegExp(query.name, "gi")
                    }
                },
                {
                    sku: {
                        $regex: new RegExp(query.sku, "gi")
                    }
                }
            ]
        }
        const pineline = [
            {
                $match: match,
            },
            {
                $sort: sort,
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ]

        try {
            const [products, countProducts] = await Promise.all([
                this.searchListProduct(pineline, metadata),
                this.countListProducts(match, metadata)
            ])
            return {
                products,
                pagination: {
                    page_number: pageNumber,
                    page_size: pageSize,
                    total_size: countProducts
                }
            };
        } catch (error) {
            Logger.error(error);
        }
    }

    async updateProduct(productId, userId, updateProductDto: UpdateProductDto, metadata = null): Promise<ProductEntity> {
        let product;
        try {
            product = await this.getProduct(productId, metadata);
        } catch (error) {
            Logger.error(error);
        }
        if (!product) {
            ProductEntity.handleProductNotFound();
        }
        try {
            product = await this.productModel.findByIdAndUpdate(
                productId,
                {
                    ...updateProductDto,
                    update_user: userId
                },
                { new: true }
            )
        } catch (error) {
            Logger.error(error);
        }
        return new ProductEntity(product);
    }

    async deleteProduct(productId:string, userId: string, metadata = null) {
        let product;
        try {
            product = await this.getProduct(productId, metadata);
        } catch (error) {
            Logger.error(error);
        }
        if (!product) {
            ProductEntity.handleProductNotFound();
        }
        try {
            product = await this.productModel.findByIdAndUpdate(productId, {
                status: "DELETE",
                update_user: userId
            })
        } catch (error) {
            Logger.error(error);
        }
        return;
    }

    private async checkProductNameExist(productName, metadata ?: any): Promise<Boolean> {
        const condition = {
            $and: [
                { status: { $ne: "DELETE" } },
                { name: productName }
            ]
        }
        const product = await this.productModel.findOne(condition);
        if (!!product) return true;
        return false;
    }

    private async countListProducts(condition: any, metadata?: any): Promise<number> {
        const countListProducts = await this.productModel.countDocuments(condition);
        return countListProducts;
    }

    private async searchListProduct(pipeline: any, metadata?: any): Promise<ProductEntity[]> {
        let products = await this.productModel.aggregate(pipeline);
        return products.map(product => new ProductEntity(product));
    }
}
