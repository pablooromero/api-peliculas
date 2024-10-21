// src/comments/comments.controller.ts
import { Controller, Post, Body, Param, Get, ValidationPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { GetUser } from 'src/api/auth/decorators/get-user.decorator';
import { User } from 'src/api/auth/entities/user.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Auth } from 'src/api/auth/decorators/auth.decorator';
import { RoleEnum } from 'src/core';
import { Comment } from './entities/comment.entity';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // Endpoint para crear un comentario
  @Post('film/:filmId')
  @Auth(RoleEnum.Admin, RoleEnum.User)
  @ApiResponse({status: 201,description: 'Ok.', type: Comment})
  @ApiResponse({status: 400,description: 'Bad request.'})
  async createComment(
    @Body(ValidationPipe) request: CreateCommentDto,
    @GetUser() user: User
  ) {
    return this.commentsService.createComment(request);
  }

  @Get('film/:filmId')
  @Auth(RoleEnum.Admin, RoleEnum.User)
  @ApiResponse({status: 201,description: 'Ok.', type: Comment, isArray: true})
  @ApiResponse({status: 400,description: 'Bad request.'})
  async getComments(@Param('filmId') filmId: number) {
    return this.commentsService.getCommentsByFilm(filmId);
  }

  @Get('film/:filmId/rating')
  @Auth(RoleEnum.Admin, RoleEnum.User)
  @ApiResponse({status: 201,description: 'Ok.', type: Number})
  @ApiResponse({status: 400,description: 'Bad request.'})
  async getFilmRating(@Param('filmId') filmId: number) {
    return this.commentsService.getFilmRating(filmId);
  }
}
