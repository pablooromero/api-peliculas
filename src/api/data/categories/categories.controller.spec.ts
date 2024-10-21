import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoryService = {
    findAll: jest.fn(),
    listPage: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result: Category[] = [{ id: 1, name: 'Category 1', films: [], createdAt: new Date() }, { id: 2, name: 'Category 2', films: [], createdAt: new Date() }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll('')).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith('');
    });
  });

  describe('list', () => {
    it('should return paginated categories', async () => {
      const result = { data: [], totalRecords: 0, totalPages: 0 };
      jest.spyOn(service, 'listPage').mockResolvedValue(result);

      expect(await controller.list('')).toBe(result);
      expect(service.listPage).toHaveBeenCalledWith('', []);
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      const result: Category = { id: 1, name: 'Category 1', films: [], createdAt: new Date() };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Category 1' };
      const result: Category = { id: 1, name: 'Category 1', films: [], createdAt: new Date() };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createCategoryDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
      const result: Category = { id: 1, name: 'Updated Category', films: [], createdAt: new Date() };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, updateCategoryDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(1, updateCategoryDto);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const result = { id: 1, name: 'Category 1' };
      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.delete(1)).toBe(result);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
