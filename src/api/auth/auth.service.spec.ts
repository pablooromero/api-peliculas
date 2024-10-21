import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthModule } from './auth.module';
import { PassportModule } from '@nestjs/passport';

describe('AuthService - register', () => {
  let service: AuthService;
  let repository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        JwtService,
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should register a user and return the user with a JWT token', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123'
    };

    jest.spyOn(repository, 'create').mockReturnValue({
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, 10),
    } as User);

    jest.spyOn(repository, 'save').mockResolvedValue({
      id: 1,
      ...createUserDto,
    } as User);

    jest.spyOn(jwtService, 'sign').mockReturnValue('test-jwt-token');

    const result = await service.register(createUserDto);

    expect(result).toEqual({
      name: 'Test User',
      email: 'test@example.com',
      token: 'test-jwt-token',
    });
  });


  it('should throw a BadRequestException if email already exists', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123',
    };

    jest.spyOn(repository, 'create').mockReturnValue({
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, 10),
    } as User);

    jest.spyOn(repository, 'save').mockRejectedValue({ code: '23505', detail: 'Email already exists' });

    await expect(service.register(createUserDto)).rejects.toThrowError(BadRequestException);
  });

  describe('AuthService - login', () => {
    it('should login a user and return the user with a JWT token', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'Password123',
        id: 1
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: bcrypt.hashSync('Password123', 10),
        roles: ['user'],
      } as User;

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-jwt-token');

      const result = await service.login(loginUserDto);

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        token: 'test-jwt-token',
        roles: ['user'],
      });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
        const loginUserDto: LoginUserDto = {
          email: 'wrong@example.com',
          password: 'wrongPassword123',
          id: 1
        };

        jest.spyOn(repository, 'findOne').mockResolvedValue(null);

        await expect(service.login(loginUserDto)).rejects.toThrowError('Invalid credentials');
      });


      it('should throw UnauthorizedException if password is incorrect', async () => {
        const loginUserDto: LoginUserDto = {
          email: 'test@example.com',
          password: 'wrongPassword123',
          id: 1
        };

        const mockUser = {
          id: 1,
          email: 'test@example.com',
          password: bcrypt.hashSync('Password123', 10),
        } as User;

        jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

        await expect(service.login(loginUserDto)).rejects.toThrowError('Invalid credentials');
      });
  });
});
