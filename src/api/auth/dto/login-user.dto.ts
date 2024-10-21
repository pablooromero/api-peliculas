import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
    @ApiProperty({
        description: 'User email',
        example: 'pabloromero@gmail'
    })
    @IsEmail()
    email: string;

    id: number;

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
