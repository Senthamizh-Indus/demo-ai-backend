import { Request, Response, NextFunction } from 'express';
import Role from '../entities/Role';
import { dbCreateConnection } from '../orm/dbCreateConnection';
import * as mongodb from "mongodb";
import * as common from "./common.controller";
import { Status } from '../entities/CommonEntity';

// getting all Roles
const getRoles = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const allRoles = await dbCreateConnection.getMongoRepository(Role).find();

        if(allRoles.length == 0) {
            throw 'Roles not found';
        }

        return res.status(200).json({
            message: 'Querying all Roles is successful',
            Roles : allRoles
        });

    } catch (error) {
        const typedError = error as Error;
        return res.status(404).json({
            message: 'Querying all Roles was failed',
            error : typedError.message? typedError.message: error
        });
    }
};

// getting a single Role
const getRole = async (req: Request, res: Response, next: NextFunction) => {

    try {
        // get the Role id from the req
        let id = new mongodb.ObjectId(req.params.id);

        const role = await dbCreateConnection.getMongoRepository(Role).findBy(id);
        return res.status(200).json({
            message: 'Querying the single Role is successful',
            role : role
        });

    } catch (error) {
        const typedError = error as Error;
        return res.status(404).json({
            message: 'Querying the single Roles is failed',
            Error: typedError.message? typedError.message: error
        });
    }
};

// updating a Role
const updateRole = async (req: Request, res: Response, next: NextFunction) => {

    try {     
        // get the data from req.params
        const id = new mongodb.ObjectId(req.params.id);

        //get the info to be updated
        const role = req.body as Partial<Role>;
        delete role._id;

        // update the Role
        const updateRole = await common.default.updateEntity(Role, id, role);

        if(updateRole.affected == 0) {
            throw 'Role not found';
          }

        return res.status(200).json({
            message: 'Successfully updated the Role'
        });

    } catch (error) {
        const typedError = error as Error;
        return res.status(200).json({
            message: 'Failed to updated the Role',
            error: typedError.message? typedError.message: error
        });
    }

};

// deleting a Role
const deleteRole = async (req: Request, res: Response, next: NextFunction) => {

    try {
        // get the Role id from req.params
        const id = new mongodb.ObjectId(req.params.id);

        const deletedRole = await common.default.deleteEntity(Role, id);
        if(deletedRole.affected == 0) {
            throw 'Role not found';
        }

        console.log("Successfully Deleted");
        // return response
        return res.status(200).json({
            message: 'Role deleted successfully'
        });
    } catch (error) {
        const typedError = error as Error;
        return res.status(404).json({
            message: 'Role not found',
            error: typedError.message? typedError.message: error
        });
    }   
};

// adding a Role
const addRole = async (req: Request, res: Response, next: NextFunction) => {

    try {
        let RoleEntity = new Role();
        RoleEntity.role_name = req.body.role_name;
        RoleEntity.status = Status.Active;

        const results = await common.default.saveEntity(Role, RoleEntity);
        if(!results) {
            throw 'Cannot store role';
        }

        console.log('Role stored successfully');
        return res.status(200).json({
            message: 'Role stored successfully',
            role: results
        });

    } catch(error) {
        const typedError = error as Error;
        return res.status(404).json({
            message: 'Role failed to stored',
            error: typedError.message? typedError.message: error
        });
    }
};

// getting a single Role
const getRoleByName = async (name: string) => {
    
    // get the Role by name
    try {
        const role = await dbCreateConnection.getMongoRepository(Role).findBy({ where: { role_name: {$eq: name} } });
        return role;
    } catch (error) {
        return error;
    }
};
 
export default { getRoles, getRole, updateRole, deleteRole, addRole, getRoleByName };