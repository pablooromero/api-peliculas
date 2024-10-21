import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UserResponseDto {
    @ApiProperty({ example: 'pabloromero@gmail.com' })
    email: string;

    @ApiProperty({ example: 'Pablo Romero' })
    name: string;

    @ApiProperty({ example: 'aksdklnasjkdjklsakskdaksdmlasmdkSKDJNAsndkasdQEQskskqk' })
    token: string;

    @ApiProperty({ example: 1 })
    id: number;
}
