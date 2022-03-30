import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';
import { CategoryService } from './category.service';
import { Category } from './interfaces/category.interface';
import { createMock } from '@golevelup/ts-jest';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

const mockCate = new CategoryEntity({
    "_id": "620f0a79f7d634fcc79b6227",
    "name": "cay luong thuc",
    "description": "Moi nam hoa dao no lai thay ong do xua",
    "image": "https://via.placeholder.com/300",
    "createdAt": "2022-02-18T02:54:49.586Z",
    "updatedAt": "2022-02-18T02:54:49.586Z",
    "status": "ACTIVE"
});

describe('CategoryService', () => {

    let service: CategoryService;
    let model: Model<Category>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                {
                    provide: getModelToken('Category'),
                    useValue: {
                        getCategory: jest.fn(),
                        findOne: jest.fn(),
                        new: jest.fn().mockReturnValue(mockCate),
                        createCategory: jest.fn(),
                        create: jest.fn(),
                        constructor: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<CategoryService>(CategoryService);
        model = module.get<Model<Category>>(getModelToken('Category'));
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Get category', () => {
        it('should return Category not found', async () => {
            let foundCate
            let e
            try {
                foundCate = await service.getCategory('123');
            } catch (error) {
                // console.log(error)
                e = error
            }
            const mockError = new Error('category not found')
            expect(mockError.message).toEqual(e.message);
        });

        it('should return not found', async () => {
            let foundCate;
            let e;
            try {
                foundCate = await service.getCategory("620383edd0706a9005ed143f");

                // console.log(foundCate);
            } catch (error) {
                e = error;
            }
            const mockError = new Error('category not found');
            expect(mockError.message).toEqual(e.message);
        })
    })

    describe('Create category', () => {

        it('should throw name should not be empty', async () => {

            // const createCategoryDto: CreateCategoryDto = {
            //     "name": "",
            //     "description": "Moi nam hoa dao no lai thay ong do xua",
            //     "image": "https://via.placeholder.com/300"
            // }
            // const userId = "6202793e75de87f7b8620104";
            // let foundCate;
            // let e;
            // try {
            //     foundCate =  await service.createCategory(createCategoryDto, userId); 
            // } catch (error) {
            //     console.log(error);
            //     e = error;
            // }

            // const mockError = new Error('name should not be empty');
            // expect(mockError.message).toEqual(e.message[0]);
        })


        it('should insert a new category', async () => {

            jest.spyOn(model, 'create').mockImplementationOnce(() => {
                return Promise.resolve({
                    "_id": "620f0a79f7d634fcc79b6227",
                    "name": "cay luong thuc",
                    "description": "Moi nam hoa dao no lai thay ong do xua",
                    "image": "https://via.placeholder.com/300",
                    "createdAt": "2022-02-18T02:54:49.586Z",
                    "updatedAt": "2022-02-18T02:54:49.586Z",
                    "status": "ACTIVE"
                })
            });

            const createCategoryDto: CreateCategoryDto = {
                "name": "cay luong thuc",
                "description": "Moi nam hoa dao no lai thay ong do xua",
                "image": "https://via.placeholder.com/300"
            }
            const userId = "6202793e75de87f7b8620104";

            const newCate = await service.createCategory(createCategoryDto, userId);
            expect(newCate).toEqual(mockCate);
        })

    })

});
