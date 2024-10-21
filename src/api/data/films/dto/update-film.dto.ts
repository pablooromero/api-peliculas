import { PartialType } from '@nestjs/mapped-types';
import { CreateFilmDto } from './create-film.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFilmDto {
    @ApiProperty({
        description: 'Name of the film',
        example: 'Test Film'
    })
    @IsOptional()
    name: string;

    @ApiProperty({
        description: 'Description of the film',
        example: 'Test Description'
    })
    @IsOptional()
    description: string;

    @ApiProperty({
        description: 'Year of the film',
        example: new Date()
    })
    @IsOptional()
    year: Date;

    @ApiProperty({
        description: 'Director of the film',
        example: 'Test Director'
    })
    @IsOptional()
    director: string;

    @ApiProperty({
        description: 'Categories of the film',
        example: [1, 2]
    })
    @IsOptional()
    categories: number[]
}
