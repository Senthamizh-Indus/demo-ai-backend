import {Entity, Column, ObjectID} from "typeorm";
import CommonEntity from "./CommonEntity";

@Entity('login')
export class Login extends CommonEntity {

    @Column()
    email_id!: string;

    @Column('text', {
        nullable: false
    })
    user_id!: ObjectID;

    @Column('text', {
        nullable: false
     })
    role_id!: ObjectID;
}