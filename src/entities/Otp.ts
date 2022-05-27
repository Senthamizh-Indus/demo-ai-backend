import { Entity, Column, ObjectID } from "typeorm";
import CommonEntity from "./CommonEntity";

@Entity('otp')
export default class Otp extends CommonEntity {

   @Column({
      unique: true,
   })
   otp!: string;

   @Column('text', {
      nullable: false
   })
   user_id!: ObjectID;

   @Column()  
   expiration_time!: Date

}