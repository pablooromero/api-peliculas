import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Auth } from 'src/api/auth/decorators/auth.decorator';
import { RoleEnum } from 'src/core';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { ListResponseDto } from 'src/core/dtos/list-response.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private engineService: CategoriesService) {}

  @Get("/")
  @Auth(RoleEnum.Admin, RoleEnum.User)
  @ApiResponse({status: 201,description: 'Ok.', type: Category, isArray: true})
  @ApiResponse({status: 400,description: 'Bad request.'})
  async findAll(@Query("q") q: string) {
    return this.engineService.findAll(q);
  }

  @Get("/list")
  @Auth(RoleEnum.Admin)
  @ApiResponse({status: 201,description: 'Ok.', type: ListResponseDto})
  @ApiResponse({status: 400,description: 'Bad request.'})
  async list(@Query("q") q: string = '') {
    const relations = []
    const resultList = await this.engineService.listPage(q, relations);
    return resultList;
  }

  @Get(":id")
  @ApiResponse({status: 201,description: 'Ok.', type: Category})
  @ApiResponse({status: 400,description: 'Bad request.'})
  async findOne(@Param("id") id: number) {
    return this.engineService.findOne(id);
  }

  @Post("/")
  @Auth(RoleEnum.Admin)
  @ApiResponse({status: 201,description: 'Ok.', type: Category})
  @ApiResponse({status: 401,description: 'Unauthorized.'})
  async create(@Body(ValidationPipe) request: CreateCategoryDto): Promise<Category> {
    return await this.engineService.create(request)
  }

  @Put("/:id")
  @Auth(RoleEnum.Admin)
  @ApiResponse({status: 201,description: 'Ok.', type: Category})
  @ApiResponse({status: 401,description: 'Unauthorized.'})
  async update(@Param("id") id: number, @Body(ValidationPipe) request: UpdateCategoryDto): Promise<Category|Category[]> {
    return await this.engineService.update(id, request)
  }

  @Delete("/:id")
  @Auth(RoleEnum.Admin)
  @ApiResponse({status: 201,description: 'Ok.', type: Category})
  @ApiResponse({status: 401,description: 'Unauthorized.'})
  async delete(@Param("id") id: number): Promise<Category> {
    return await this.engineService.remove(id)
  }
}
