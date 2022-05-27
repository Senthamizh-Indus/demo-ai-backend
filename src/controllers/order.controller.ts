import { Request, Response, NextFunction } from "express";
import Order, { OrderStatus } from "../entities/Order";
import { Twilio } from "twilio";
require("dotenv").config();
import * as mongodb from "mongodb";
import * as common from "./common.controller";
import { dbCreateConnection } from "../orm/dbCreateConnection";
import { Status } from "../entities/CommonEntity";

//function to send textSMS
const SendTextSMS = () => {

  const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
  const authToken = process.env.TWILIO_AUTH_TOKEN as string;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER as string;
  const myNumber = process.env.MY_NUMBER as string;

  const client = new Twilio(accountSid, authToken);

  client.messages
    .create({
      from: twilioNumber,
      to: myNumber,
      body: "You just sent an SMS from TypeScript using Twilio!",
    })
    .then((message) => console.log(message.sid));

  
};

//Creating a Order
const createOrder = async (req: Request, res: Response, next: NextFunction) => {

  try {

    let orderEntity = new Order();
    orderEntity = req.body;
    orderEntity.order_id = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    orderEntity.user_id = mongodb.ObjectId(req.body.user_id);
    orderEntity.order_status = OrderStatus.ordered;
    orderEntity.status = Status.Active;

    const results = await common.default.saveEntity(Order, orderEntity);

    if(!results) {
      throw 'Cannot store order';
    }

    // //sending text_sms
    // SendTextSMS();
    return res.status(200).send({
      message: "Order successfully created",
      order: results,
    });

  } catch (error) {
    const typedError = error as Error;
    return res.status(400).json({
      message: "Failed to create a Order",
      Error: typedError.message? typedError.message: error
    });
  }
};

//Getting all the Order
const getOrders = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const allOrders = await common.default.getAllEntity(Order, "user", "user_id", "_id", "user");

    if(allOrders.length == 0) {
      throw 'Orders not found';
    }

    return res.status(200).send({
      message: "Getting all Order successfully",
      orders: allOrders,
    });
  } catch (error) {
    const typedError = error as Error;
    return res.status(400).json({
      message: "failed to get all Order",
      Error: typedError.message? typedError.message: error
    });
  }
};

//Getting single Order
const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  // get the User id from the req
  let id = new mongodb.ObjectId(req.params.id);

  try {
    const order = await common.default.getEntity(Order, id);

    if(!order) {
      throw 'Order not found';
    }

    return res.status(200).send({
      message: "Getting a single Order successfully",
      order: order,
    });
  } catch (error) {
    const typedError = error as Error;
    return res.status(400).json({
      message: "failed to get a order",
      Error: typedError.message? typedError.message: error
    });
  }
};

//Getting single Order
const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  
  // get the User id from the req
  let order_id = req.params.id as string;

  try {
    const order = await dbCreateConnection.getMongoRepository(Order).findOneByOrFail({where: { order_id }});

    if(!order) {
      throw 'User not found';
    }

    return res.status(200).send({
      message: "Getting a single Order successfully",
      order: order,
    });
  } catch (error) {
    console.log('%corder.controller.ts line:143 error', 'color: #007acc;', error);
    const typedError = error as Error;
    return res.status(400).json({
      message: "failed to get a order",
      Error: typedError.message? typedError.message: error
    });
  }
};

//Updating a Order
const updateOrder = async (req: Request, res: Response, next: NextFunction) => {

  try {
    // get the User id from the req
    const id = new mongodb.ObjectId(req.params.id);

    //get the info to be updated
    const order = req.body as Partial<Order>;
    delete order._id;

    const updatedOrder = await common.default.updateEntity(Order, id, order);

    if(updatedOrder.affected == 0) {
      throw 'User not found';
    }

    return res.status(200).send({
      message: "Order successfully updated"
    });
  } catch (error) {
    const typedError = error as Error;
    return res.status(404).json({
      message: "failed to update a order",
      Error: typedError.message? typedError.message: error
    });
  }
};

//Deleting a Order
const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {

  try {
    // get the Order id from the req
    const id = new mongodb.ObjectId(req.params.id);

    const deletedOrder = await common.default.deleteEntity(Order, id);

    if(deletedOrder.affected == 0) {
      throw 'User not found';
    } 

    return res.status(200).send({
      message: "Order successfully Deleted"
    });

  } catch (error) {
    const typedError = error as Error;
    return res.status(404).json({
      message: "failed to delete a order",
      Error: typedError.message? typedError.message: error
    });
  }
};

//Upload file
const uploadFile = async (req: Request, res: Response, next: NextFunction) => {

  try {

    return res.status(200).send({
      message: "File uploaded Successfully"
    });
  } catch (error) {
    return res.status(404).json({
      message: "failed to upload a file",
      Error: error,
    });
  }
};

export default { createOrder, getOrders, getOrder, updateOrder, deleteOrder, uploadFile, getOrderById };
