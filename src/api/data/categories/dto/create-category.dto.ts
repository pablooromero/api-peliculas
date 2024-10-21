import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {

    @ApiProperty({
        description: 'Name of the category',
        example: 'Test Category'
    })
    @IsNotEmpty()
    name: string
}
