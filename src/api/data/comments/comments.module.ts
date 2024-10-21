import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { AuthModule } from 'src/api/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/api/auth/entities/user.entity';
import { Film } from '../films/entities/film.entity';
import { Comment } from './entities/comment.entity';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    TypeOrmModule.forFeature([Comment, User, Film]),
    HttpModule,
    PassportModule,
    AuthModule
  ]
})
export class CommentsModule {}
