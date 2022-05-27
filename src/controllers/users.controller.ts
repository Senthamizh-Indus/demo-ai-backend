import { Request, Response, NextFunction } from "express";
import User from "../entities/User";
require("dotenv").config();
import * as mongodb from "mongodb";
import Joi from "joi";
import * as common from "./common.controller";
import { Status } from "../entities/CommonEntity";

// getting all Users
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allUsers = await common.default.getAllEntity(User, "role", "role_id", "_id", "role");

        if(allUsers.length == 0) {
            throw 'Users not found';
        }

        return res.status(200).json({
            message: "Querying all Users is successful",
            Users: allUsers,
        });
    } catch (error) {
        const typedError = error as Error;
        return res.status(404).json({
            message: "Querying all Users is failed",
            Error: typedError.message? typedError.message: error
        });
    }
};

// getting a single User
const getUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
        // get the User id from the req
        let id = new mongodb.ObjectId(req.params.id);

        const user = await common.default.getEntityWithAggregation(User, id, "role", "role_id", "_id", "role");

        if(!user) {
            throw 'User not found';
        }

        return res.status(200).json({
            message: "Querying the single User is successful",
            user: user,
        });
    } catch (error) {
        const typedError = error as Error;

        // 👉️ err is type Error here
        return res.status(404).json({
            message: "Querying the single Users is failed",
            Error: typedError.message? typedError.message: error
        });
    }
};

// updating a User
const updateUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
        // get the data from req.body
        const id = new mongodb.ObjectId(req.params.id);

        // Get the info from body
        const user = req.body as Partial<User>;
        delete user._id;

        // update the User
        const updateUser = await common.default.updateEntity(User, id, user);

        if(updateUser.affected == 0) {
            throw 'User not found';
        }

        return res.status(200).json({
            message: 'Successfully updated the User',
            user: updateUser
        });

    } catch (error) {
        const typedError = error as Error;
        return res.status(400).json({
            message: 'Failed to updated the User',
            error: typedError.message? typedError.message: error
        });
    }

};

// deleting a User
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    // get the User id from req.params
    let id = new mongodb.ObjectId(req.params.id);

    try {
        const deleteUser = await common.default.deleteEntity(User, id);

        if(deleteUser.affected == 0) {
            throw 'User not found';
        }

        console.log("Successfully Deleted the user");

        // return response
        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        const typedError = error as Error;
        return res.status(404).json({
            message: "User not found",
            error: typedError.message? typedError.message: error
        });
    }
};

// adding a User
const addUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
        //Validation
        const schema = Joi.object({

            first_name:Joi.string()
            .min(3)
            .max(30)
            .required(),

            last_name:Joi.string()
            .min(3)
            .max(30)
            .required(),

            address:Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
            
            city:Joi.string()
            .min(3)
            .max(30)
            .required(),
            
            state:Joi.string()
            .min(3)
            .max(30)
            .required(),

            email_id: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
            }),

            mobile_no:Joi.number()
            .integer()
            .required(),

            password: Joi.string().min(6)
            .max(10),
            
            zip: Joi.number().required(),

            role_id: Joi.string().required()
        
        });
        
        const value = await schema.validateAsync(req.body);

        //Hash the password, to securely store on DB
        let userEntity = new User();
        userEntity.first_name = value.first_name;
        userEntity.last_name = value.last_name;
        userEntity.address = value.address;
        userEntity.city = value.city;
        userEntity.state = value.state;
        userEntity.email_id = value.email_id;
        userEntity.mobile_no = value.mobile_no;
        userEntity.role_id = mongodb.ObjectId(value.role_id);
        userEntity.password = value.password;
        userEntity.zip = value.zip;
        userEntity.status = Status.Active;

        userEntity.hashPassword();

        const user = await common.default.saveEntity(User, userEntity);

        if(!user) {
            throw 'Cannot store the user';
        }

        console.log("User stored successfully");
        return res.status(200).json({
            message: "User stored successfully",
            user: user,
        });
    } catch (error) {
        const typedError = error as Error;
        return res.status(404).json({
            message: "User failed to stored",
            error: typedError.message? typedError.message: error
        });
    }
};

export default { getUsers, getUser, updateUser, deleteUser, addUser };
