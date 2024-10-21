import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {

    @ApiProperty({
        description: 'Name of the category',
        example: 'Test Category'
    })
    @IsNotEmpty()
    name: string
}
