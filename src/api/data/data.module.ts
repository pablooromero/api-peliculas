import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { FilmsModule } from './films/films.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { FavoritesModule } from './favorites/favorites.module';
import { CommentsModule } from './comments/comments.module';

@Module({
    imports: [
        CategoriesModule,
        FilmsModule,
        FavoritesModule,
        AuthModule,
        PassportModule,
        CommentsModule
    ]
})
export class DataModule {}
