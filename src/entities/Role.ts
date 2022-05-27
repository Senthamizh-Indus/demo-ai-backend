import { Entity, Column } from "typeorm";
import CommonEntity from "./CommonEntity";
// import User from "./User";

@Entity('role')
export default class Role extends CommonEntity {

   @Column({
      unique: true,
   })
   role_name!: string;

}