import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: 'User email',
        example: 'pabloromero@gmail'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User name',
        example: 'Pablo Romero'
    })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({
        description: 'User password',
        example: 'Password123'
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
}
