// src/comments/comments.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { HttpService } from '@nestjs/axios';
import { BaseService } from 'src/core';
import { User } from 'src/api/auth/entities/user.entity';
import { Film } from '../films/entities/film.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService extends BaseService<Comment> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,

    protected readonly dataSource: DataSource,
    protected readonly httpService: HttpService,
  ) {
    super(commentsRepository, dataSource, httpService);
    this.modelClass = Comment;
  }

  async createComment(attrs: CreateCommentDto, connect: QueryRunner = null): Promise<Comment> {
    const queryRunner = connect != null ? connect : this.dataSource.createQueryRunner();

    try {
      if (connect == null) {
        await queryRunner.connect();
        await queryRunner.startTransaction();
      }
      const user = await this.usersRepository.findOneBy({ id: attrs.userId });
      const film = await this.filmsRepository.findOneBy({ id: attrs.filmId });

      if(!user || !film){
        throw new Error('User or film not found');
      }

      const payload = this.commentsRepository.create({
        ...attrs,
        user,
        film,
      })

      const result = await this.commentsRepository.save(payload);

      if (connect == null) {
        await queryRunner.commitTransaction();
      }

      return result
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  async getCommentsByFilm(filmId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { film: { id: filmId } },
      relations: ['user'],
    });
  }
  async getFilmRating(filmId: number): Promise<number> {
    const comments: Comment[] = await this.commentsRepository.find({
      where: { film: { id: filmId } },
    });

    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    return comments.length > 0 ? totalRating / comments.length : 0;
  }
}
