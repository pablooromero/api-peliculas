import { User } from 'src/api/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Film } from '../../films/entities/film.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('favorites')
export class Favorite {
  @ApiProperty({example: 1})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: 1})
  @ManyToOne(() => User, user => user.favorites, { eager: false })
  user: User;

  @ApiProperty({example: 1})
  @ManyToOne(() => Film, film => film.favorites, { eager: false })
  film: Film;
}
