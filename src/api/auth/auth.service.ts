import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const {password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);

      delete user.password;
      delete user.roles;
      delete user.isActive;

      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      }

    } catch (error) {
      this.handleError(error);
    }
  }

  async registerAdmin(createUserDto: CreateUserDto) {
    try {
      const {password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      user.roles = ['admin'];

      await this.userRepository.save(user);

      delete user.password;
      delete user.isActive;

      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      }

    } catch (error) {
      this.handleError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const {password, email} = loginUserDto;

      const user = await this.userRepository.findOne({
        where: {
          email
        },
        select: {
          email: true,
          password: true,
          id: true
        }
      });

      if(!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if(!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Invalid credentials');
      }

      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      }

    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error) {
    if(error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw error;
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
