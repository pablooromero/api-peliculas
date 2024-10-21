import { BaseModel } from "src/core/lib/class/base-model.class";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "../../categories/entities/category.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Favorite } from "../../favorites/entity/favorites.entity";
import { Comment } from "../../comments/entities/comment.entity";

@Entity({
    name: 'films'
})
export class Film extends BaseModel {

    @ApiProperty({example: 1})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'Relatos Salvajes'})
    @Column()
    name: string;

    @ApiProperty({example: 'Pelicula Argentina de drama'})
    @Column()
    description: string;

    @ApiProperty({example: new Date()})
    @Column()
    year: Date;

    @ApiProperty({example: 'Damian Szifron'})
    @Column()
    director: string;

    @ApiProperty({example: 1})
    @Column({nullable: true, unique: true })
    swapiId: number;

    @ApiProperty({type: Date})
    @CreateDateColumn({ type: "timestamp", name: "created_at" })
    createdAt: Date;

    @ApiProperty({type: Date})
    @UpdateDateColumn({ type: "timestamp", default: null, name: "updated_at" })
    updatedAt?: Date;

    @ApiProperty({type: Date})
    @DeleteDateColumn({ type: "timestamp", default: null, name: "deleted_at" })
    deletedAt?: Date;

    //Relations
    @JoinTable()
    @ManyToMany(() => Category, (category) => category.films)
    categories: Category[];

    @OneToMany(() => Favorite, favorite => favorite.film)
    favorites: Favorite[];

    @OneToMany(() => Comment, (comment) => comment.film, { lazy: true })
    comments: Comment[];
}
