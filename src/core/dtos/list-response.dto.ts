import { ApiProperty } from "@nestjs/swagger"

export class ListResponseDto {

    @ApiProperty({ default: 1 })
    page: number

    @ApiProperty({ default: 10 })
    limit: number

    @ApiProperty({ example: 5 })
    totalRecords: number

    @ApiProperty({ example: 1 })
    totalPages: number

    @ApiProperty({ example: [{id: 1, name: 'Ejemplo'}] })
    data: any[]
}