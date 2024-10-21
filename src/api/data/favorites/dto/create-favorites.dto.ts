import { IsNotEmpty, Max, Min } from "class-validator";

export class CreateFavoriteDto {
    @IsNotEmpty()
    filmId: number

    @IsNotEmpty()
    userId: number
}
