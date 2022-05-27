import { Entity, Column, ObjectID, PrimaryColumn, Index } from "typeorm";
import "reflect-metadata";
import CommonEntity from "./CommonEntity";

export enum OrderStatus {
   ordered = 'Ordered',
   approved = 'Approved',
   shipped = 'Shipped',
   delivered = 'Delivered',
   cancelled = 'Cancelled'
}

@Entity('orders')
export default class Orders extends CommonEntity {
   
   @Index()
   @PrimaryColumn({
      unique: true,
   })
   order_id!: string;

   @Column()
   client_name!: string;

   @Column()
   client_email!: string;

   @Column()
   client_contact!: string;

   @Column({ type: 'enum', enum: OrderStatus })
   order_status!: OrderStatus;

   @Column()
   from_address!: string;

   @Column()
   to_address!: string;

   @Column()
   purchased_price!: string;

   @Column()
   product_details!: string;

   @Column()
   comments!: string;

   // @ManyToOne(() => User, user => user.orders)
   // user!: User;

   @Column('text', {
      nullable: false
   })
   user_id!: ObjectID;

   @Column()
   order_date!: Date;
}