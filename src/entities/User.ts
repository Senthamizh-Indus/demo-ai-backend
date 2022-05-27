import { Entity, Column, ObjectID } from "typeorm";
import bcrypt from 'bcryptjs';
import CommonEntity from "./CommonEntity";
// import Role from './Role';
// import Orders from "./Order";

@Entity('user')
export default class User extends CommonEntity{

    @Column()
    first_name!: string;

    @Column()
    last_name!: string;

    @Column({
        unique: true,
    })
    email_id!: string;

    @Column()
    password!: string;

    @Column()
    address!: string;

    @Column()
    city!: string;

    @Column()
    state!: string;

    @Column()
    zip!: string;

    @Column({
        unique: true,
    })
    mobile_no!: string;

    // @Column()
    // role_id: ObjectID[] = [];

    @Column('text', {
        nullable: false
    })
    role_id!: ObjectID;

    // @Column()
    // role_id: Array<ObjectID> = [];

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfPasswordMatch(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
