import { Field, ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";
import { Base } from "./Base";

@Entity()
@ObjectType()
export class User extends Base{
    @Column({unique: true})
    @Field()
    username!: string

    @Column()
    password!: string
}