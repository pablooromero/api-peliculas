// src/favorites/favorites.controller.ts
import { Controller, Post, Param, Get, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { RoleEnum } from 'src/core';
import { Auth } from 'src/api/auth/decorators/auth.decorator';
import { User } from 'src/api/auth/entities/user.entity';
import { GetUser } from 'src/api/auth/decorators/get-user.decorator';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Auth(RoleEnum.User, RoleEnum.Admin)
  @Post(':filmId')
  async markAsFavorite(@GetUser() user: User, @Param('filmId') filmId: number)
  {
    return this.favoritesService.markAsFavorite(user.id, filmId);
  }

  @Auth()
  @Get()
  async getFavorites(@GetUser() user: User) {
    return this.favoritesService.getFavorites(user.id);
  }
}
