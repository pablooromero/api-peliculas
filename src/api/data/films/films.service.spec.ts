import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { Film } from './entities/film.entity';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { HttpService } from '@nestjs/axios';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: Repository<Film>;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
      }),
    };


    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: getRepositoryToken(Film),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    repository = module.get<Repository<Film>>(getRepositoryToken(Film));
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  //Test Create Film
  it('should create a film when valid categories are provided', async () => {
    const mockCategories: Category[] = [{ id: 1, name: 'Action', films: [], createdAt: new Date() }, { id: 2, name: 'Drama', films: [], createdAt: new Date() }];
    const mockFilm: Film = { id: 1, name: 'Test Film', description: 'Test Description', year: new Date(), director: 'Test Director', categories: mockCategories,  createdAt: new Date(), swapiId: null };
    const createFilmDto: CreateFilmDto = { name: 'Test Film', description: 'Test Description', year: new Date(), director: 'Test Director', categories: [1, 2] };

    jest.spyOn(categoryRepository, 'find').mockResolvedValue(mockCategories);
    jest.spyOn(repository, 'create').mockReturnValue(mockFilm);
    jest.spyOn(repository, 'save').mockResolvedValue(mockFilm);

    const result = await service.createFilm(createFilmDto);
    expect(result).toEqual(mockFilm);
    expect(repository.create).toHaveBeenCalledWith({ ...createFilmDto, categories: mockCategories });
    expect(repository.save).toHaveBeenCalledWith(mockFilm);
  });

  it('should throw an error if some categories are not found', async () => {
    const createFilmDto: CreateFilmDto = { name: 'Test Film', description: 'Test Description', year: new Date(), director: 'Test Director', categories: [1, 2] };
    jest.spyOn(categoryRepository, 'find').mockResolvedValue([{ id: 1, name: 'Action', films: [], createdAt: new Date() }]);
    await expect(service.createFilm(createFilmDto)).rejects.toThrowError('Some categories not found');
  });


  //Test UpdateFilm
  it('should update a film when a valid ID is provided', async () => {
    const mockFilm: Film = { id: 1, name: 'Title', description: 'Test Description', year: new Date(), director: 'Test Director', categories: [],  createdAt: new Date(), swapiId: null };
    const updateFilmDto: UpdateFilmDto = { name: 'Updated Title', categories: [1], year: new Date(), description: 'Test Description', director: 'Test Director' };

    jest.spyOn(repository, 'findOne').mockResolvedValue(mockFilm);
    jest.spyOn(categoryRepository, 'find').mockResolvedValue([{ id: 1, name: 'Action', films: [], createdAt: new Date() }]);
    jest.spyOn(repository, 'save').mockResolvedValue(
      {
        ...mockFilm,
        name: updateFilmDto.name
      });

    const result = await service.updateFilm(1, updateFilmDto);
    expect(result.name).toEqual('Updated Title');
  });

});
