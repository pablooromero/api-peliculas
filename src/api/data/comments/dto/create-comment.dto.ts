import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Max, Min } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({
        description: 'Content of the comment',
        example: 'Test comentario'
    })
    @IsNotEmpty()
    content: string

    @ApiProperty({
        description: 'Rating of the comment',
        example: 3
    })
    @IsNotEmpty()
    @Min(1, { message: 'La calificación mínima es 1' })
    @Max(5, { message: 'La calificación máxima es 5' })
    rating: number

    @ApiProperty({
        description: 'Id of the film',
        example: 1
    })
    @IsNotEmpty()
    filmId: number

    @ApiProperty({
        description: 'Id of the user',
        example: 1
    })
    @IsNotEmpty()
    userId: number
}
