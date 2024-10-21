// src/favorites/favorites.controller.ts
import { Controller, Post, Param, Get, UseGuards, Body, ValidationPipe } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Auth } from 'src/api/auth/decorators/auth.decorator';
import { RoleEnum } from 'src/core';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/api/auth/decorators/get-user.decorator';
import { User } from 'src/api/auth/entities/user.entity';
import { Favorite } from './entity/favorites.entity';
import { CreateFavoriteDto } from './dto/create-favorites.dto';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':filmId')
  @Auth(RoleEnum.Admin, RoleEnum.User)
  @ApiResponse({status: 201,description: 'Ok.', type: Favorite})
  @ApiResponse({status: 400,description: 'Bad request.'})
  async markAsFavorite(
    @Body(ValidationPipe) request: CreateFavoriteDto,
    @GetUser() user: User,
  ) {
    return this.favoritesService.markAsFavorite(request);
  }

  @Get()
  @Auth(RoleEnum.Admin, RoleEnum.User)
  @ApiResponse({status: 201,description: 'Ok.', type: Favorite, isArray: true})
  @ApiResponse({status: 400,description: 'Bad request.'})
  async getFavorites(@GetUser() user: User,) {
    return this.favoritesService.getFavorites(user.id);
  }
}
