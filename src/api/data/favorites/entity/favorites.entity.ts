import { User } from 'src/api/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Film } from '../../films/entities/film.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('favorites')
@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.favorites)
  user: User;

  @ManyToOne(() => Film, film => film.favorites)
  film: Film;
}
