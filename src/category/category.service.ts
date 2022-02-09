import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPagination } from 'src/common/interfaces/pagination.interface';
import { orderObj } from 'src/common/utils/order-by-object.common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel('Category') private readonly categoryModel: Model<Category>,
    ) { }

    async createCategory(createCategoryDto: CreateCategoryDto, userId): Promise<CategoryEntity> {
        try {
            const category = new this.categoryModel({ ...createCategoryDto, create_user: userId, update_user: userId });
            await category.save();
            return new CategoryEntity(category);
        } catch (error) {
            console.log(error);
        }
    }

    async listCategories(filter: any, query: any): Promise<{ categories: CategoryEntity[], pagination: IPagination }> {
        try {
            const { pageNumber, pageSize, orderBy } = filter;
            const sort = orderObj(filter.orderBy);
            const skip =
                (parseInt(filter.pageNumber, 10) - 1) * parseInt(filter.pageSize, 10);
            const limit = parseInt(filter.pageSize, 10);

            // search by category name

            const match = {
                $and: [
                    { status: "ACTIVE" },
                    {
                        name: {
                            $regex: new RegExp(query.name, "gi")
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
            const [categories, countCategories] = await Promise.all([
                this.searchListCategories(pineline),
                this.countListCategories(match)
            ])
            return {
                categories,
                pagination: {
                    page_number: pageNumber,
                    page_size: pageSize,
                    total_size: countCategories
                }
            };
        } catch (error) {
            console.log(error);
        }
    }

    async getCategory(categoryId: string): Promise<CategoryEntity> {
        if (categoryId.toString().length !== 24) {
            CategoryEntity.handleCategoryNotFound();
        }
        let category;
        const condition = {
            $and: [
                { _id: categoryId },
                { status: "ACTIVE" }
            ]
        }
        try {
            category = await this.categoryModel.findOne(condition);
        } catch (error) {
            console.log(error);
        }
        if (!category) {
            CategoryEntity.handleCategoryNotFound();
        }
        return new CategoryEntity(category);
    }

    async updateCategory(categoryId: string, userId: string, updateCategoryDto: UpdateCategoryDto): Promise<any> {
        let category;
        try {
            category = await this.getCategory(categoryId);
        } catch (error) {
            Logger.error(error);
        }
        if (!category) {
            CategoryEntity.handleCategoryNotFound();
        }
        try {
            category = await this.categoryModel.findByIdAndUpdate(
                categoryId,
                {
                    ...updateCategoryDto,
                    update_user: userId
                },
                { new: true }
            )
        } catch (error) {
            Logger.error(error);
        }
        return new CategoryEntity(category);
    }

    async deleteCategory(categoryId: string, userId: string) {
        let category;
        try {
            category = await this.getCategory(categoryId);
        } catch (error) {
            Logger.error(error);
        }
        if (!category) {
            CategoryEntity.handleCategoryNotFound();
        }
        try {
            category = await this.categoryModel.findByIdAndUpdate(categoryId, {
                status: "DELETE",
                update_user: userId
            })
        } catch (error) {
            Logger.error(error);
        }
        return;
    }

    private async countListCategories(condition: any): Promise<number> {
        const countListCategories = await this.categoryModel.countDocuments(condition);
        return countListCategories;
    }

    private async searchListCategories(pipeline: any): Promise<CategoryEntity[]> {
        let categories = await this.categoryModel.aggregate(pipeline);
        return categories.map(category => new CategoryEntity(category));
    }
}
