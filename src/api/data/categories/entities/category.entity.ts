import { BaseModel } from "src/core/lib/class/base-model.class";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Film } from "../../films/entities/film.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
    name: 'categories'
})
export class Category extends BaseModel {
    @ApiProperty({example: 1})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'Drama'})
    @Column()
    name: string;

    @ApiProperty({example: new Date()})
    @CreateDateColumn({ type: "timestamp", name: "created_at" })
    createdAt: Date

    @ApiProperty({example: new Date()})
    @UpdateDateColumn({ type: "timestamp", default: null, name: "updated_at" })
    updatedAt?: Date

    @ApiProperty({example: new Date()})
    @DeleteDateColumn({ type: "timestamp", default: null, name: "deleted_at" })
    deletedAt?: Date

    //Relations
    @ManyToMany(() => Film, (film) => film.categories)
    films: Film[]
}
