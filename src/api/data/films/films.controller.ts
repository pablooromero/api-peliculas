import { Controller, Get, Post, Body, Param, Delete, Query, ValidationPipe, Res, HttpStatus, Put } from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Auth } from 'src/api/auth/decorators/auth.decorator';
import { RoleEnum } from 'src/core';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Film } from './entities/film.entity';
import { ListResponseDto } from 'src/core/dtos/list-response.dto';

@ApiTags('Films')
@Controller('films')
export class FilmsController {
  constructor(private engineService: FilmsService) {}

  @Get("/")
  @Auth(RoleEnum.User, RoleEnum.Admin)
  @ApiResponse({status: 201,description: 'Ok.', type: Film, isArray: true})
  @ApiResponse({status: 400,description: 'Bad request.'})
  async findAll(@Query("q") q: string) {
    return this.engineService.findAll(q);
  }

  @Get("/list")
  @Auth(RoleEnum.User, RoleEnum.Admin)
  @ApiResponse({status: 201,description: 'Ok.', type: ListResponseDto})
  @ApiResponse({status: 400,description: 'Bad request.'})
  async list(@Query("q") q: string = '') {
    const relations = ['c.categories']
    const resultList = await this.engineService.listPage(q, relations);
    return resultList;
  }

  @Get("/:id")
  @Auth(RoleEnum.User)
  @ApiResponse({status: 201,description: 'Ok.', type: Film})
  @ApiResponse({status: 400,description: 'Bad request.'})
  async findOne(@Param("id") id: number) {
    return this.engineService.findOne(id);
  }

  @Post("/")
  @Auth(RoleEnum.Admin)
  @ApiResponse({status: 201,description: 'Ok.', type: Film})
  @ApiResponse({status: 401,description: 'Unauthorized.'})
  async create(@Body(ValidationPipe) request: CreateFilmDto): Promise<Film> {
    return await this.engineService.createFilm(request)
  }

  @Put("/:id")
  @Auth(RoleEnum.Admin)
  @ApiResponse({status: 201,description: 'Ok.', type: Film})
  @ApiResponse({status: 401,description: 'Unauthorized.'})
  async update(@Param("id") id: number, @Body(ValidationPipe) request: UpdateFilmDto): Promise<Film> {
    return await this.engineService.updateFilm(id, request)
  }

  @Delete("/:id")
  @Auth(RoleEnum.Admin)
  @ApiResponse({status: 201,description: 'Ok.', type: Film})
  @ApiResponse({status: 401,description: 'Unauthorized.'})
  async delete(@Param("id") id: number): Promise<Film> {
    return await this.engineService.remove(id)
  }
}
