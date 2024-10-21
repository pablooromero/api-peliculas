import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a user and return the user with a token', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123',
      };

      const result = {
        id: 1,
        email: createUserDto.email,
        token: 'test-jwt-token',
      } as any;

      jest.spyOn(service, 'register').mockResolvedValue(result);

      expect(await controller.create(createUserDto)).toEqual(result);
      expect(service.register).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw a BadRequestException if registration fails', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123',
      };

      jest.spyOn(service, 'register').mockRejectedValue(new BadRequestException('Email already exists'));

      await expect(controller.create(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login a user and return the user with a token', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'Password123',
        id: 1,
      };

      const result = {
        id: 1,
        email: loginUserDto.email,
        token: 'test-jwt-token',
      } as any;

      jest.spyOn(service, 'login').mockResolvedValue(result);

      expect(await controller.login(loginUserDto)).toEqual(result);
      expect(service.login).toHaveBeenCalledWith(loginUserDto);
    });

    it('should throw an UnauthorizedException if login fails', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'Password123',
        id: 1,
      };

      jest.spyOn(service, 'login').mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
