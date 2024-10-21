import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateFilmDto {

    @ApiProperty({
        description: 'Name of the film',
        example: 'Test Film'
    })
    @IsNotEmpty()
    name: string

    @ApiProperty({
        description: 'Description of the film',
        example: 'Test Description'
    })
    @IsNotEmpty()
    description: string

    @ApiProperty({
        description: 'Year of the film',
        example: new Date()
    })
    @IsNotEmpty()
    year: Date

    @ApiProperty({
        description: 'Director of the film',
        example: 'Test Director'
    })
    @IsNotEmpty()
    director: string

    @ApiProperty({
        description: 'Categories of the film',
        example: [1, 2]
    })
    @IsNotEmpty()
    categories: number[]
}
