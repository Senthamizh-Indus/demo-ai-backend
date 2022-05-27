import { Column, CreateDateColumn, UpdateDateColumn, ObjectIdColumn, ObjectID, Index } from "typeorm";

export enum Status {
   InActive,
   Active,
}
export default class CommonEntity {

   @ObjectIdColumn()
   id!: ObjectID;

   _id!: ObjectID;

   @Column({ type: 'enum', enum: Status })
   @Index()
   status!: Status;

   @Column()
   @CreateDateColumn()
   created_at!: Date;

   @Column()
   @UpdateDateColumn()
   updated_at!: Date;

}