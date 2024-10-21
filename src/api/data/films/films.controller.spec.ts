import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            findAll: jest.fn(),
            listPage: jest.fn(),
            findOne: jest.fn(),
            createFilm: jest.fn(),
            updateFilm: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll and return a list of films', async () => {
    const result: Film[] = [
      { id: 1, name: 'Film 1', description: 'Desc 1', year: new Date(), director: 'Director 1', swapiId: 123, createdAt: new Date(), categories: []},
      { id: 2, name: 'Film 2', description: 'Desc 2', year: new Date(), director: 'Director 2', swapiId: 456, createdAt: new Date(), categories: []},
    ];
    jest.spyOn(service, 'findAll').mockResolvedValue(result);

    expect(await controller.findAll('')).toBe(result);
    expect(service.findAll).toHaveBeenCalledWith('');
  });

  it('should call list and return paginated films', async () => {
    const result: { data: Film[]; totalRecords: number; totalPages: number } = {
      data: [
        { id: 1, name: 'Film 1', description: 'Desc 1', year: new Date(), director: 'Director 1', swapiId: 123, createdAt: new Date(), categories: []},
        { id: 2, name: 'Film 2', description: 'Desc 2', year: new Date(), director: 'Director 2', swapiId: 456, createdAt: new Date(), categories: [] },
      ],
      totalRecords: 2,
      totalPages: 1,
    };
    jest.spyOn(service, 'listPage').mockResolvedValue(result);

    expect(await controller.list('')).toBe(result);
    expect(service.listPage).toHaveBeenCalledWith('', ['c.categories']);
  });

  it('should call findOne and return the requested film', async () => {
    const result: Film = { id: 1, name: 'Film 1', description: 'Desc 1', year: new Date(), director: 'Director 1', swapiId: 123, createdAt: new Date(), categories: [] };
    jest.spyOn(service, 'findOne').mockResolvedValue(result);

    expect(await controller.findOne(1)).toBe(result);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should create a new film and return it', async () => {
    const result: Film = { id: 1, name: 'New Film', description: 'Desc new', year: new Date(), director: 'New Director', swapiId: 789, createdAt: new Date(), categories: []  };
    const createFilmDto: CreateFilmDto = { name: 'New Film', categories: [1], description: 'Desc new', year: new Date(), director: 'New Director' };
    jest.spyOn(service, 'createFilm').mockResolvedValue(result);

    expect(await controller.create(createFilmDto)).toBe(result);
    expect(service.createFilm).toHaveBeenCalledWith(createFilmDto);
  });

  it('should update a film and return the updated film', async () => {
    const result: Film = { id: 1, name: 'Updated Film', description: 'Desc updated', year: new Date(), director: 'Updated Director', swapiId: 999, createdAt: new Date(), categories: []};
    const updateFilmDto: UpdateFilmDto = { name: 'Updated Film', categories: [1], year: new Date(), description: 'Desc updated', director: 'Updated Director' };
    jest.spyOn(service, 'updateFilm').mockResolvedValue(result);

    expect(await controller.update(1, updateFilmDto)).toBe(result);
    expect(service.updateFilm).toHaveBeenCalledWith(1, updateFilmDto);
  });

  it('should delete a film and return the result', async () => {
    const result: Film = { id: 1, name: 'Deleted Film', description: 'Desc deleted', year: new Date(), director: 'Deleted Director', swapiId: 123, createdAt: new Date(), categories: [] };
    jest.spyOn(service, 'remove').mockResolvedValue(result);

    expect(await controller.delete(1)).toBe(result);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
