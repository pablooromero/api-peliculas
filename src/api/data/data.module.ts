import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { FilmsModule } from './films/films.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        CategoriesModule,
        FilmsModule,
        AuthModule,
        PassportModule
    ]
})
export class DataModule {}
