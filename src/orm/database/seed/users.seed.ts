import { dbCreateConnection } from '../../dbCreateConnection';

// @ts-ignore
import { name, internet, random, date, lorem, hacker, address, phone } from 'faker';
import User from '../../../entities/User';
import * as mongodb from "mongodb";
import { Status } from '../../../entities/CommonEntity';

const createSuperAdmin = async(role: mongodb.ObjectId) => {

    const superAdmin = new User();
    superAdmin.first_name = "Super_Admin"
    superAdmin.last_name = "Super_Admin"
    superAdmin.email_id = "superadmin@gmail.com"
    superAdmin.password = "superadmin";
    superAdmin.address = address.streetAddress();
    superAdmin.city = address.city();
    superAdmin.state = address.state();
    superAdmin.mobile_no = phone.phoneNumber();
    superAdmin.zip = address.zipCode();
    superAdmin.role_id = role;
    superAdmin.status = Status.Active;

    //Hash the password, to securely store on DB
    superAdmin.hashPassword();

    const superAdminUser = dbCreateConnection.getMongoRepository(User).create(superAdmin);
    await dbCreateConnection.getMongoRepository(User).save(superAdminUser);
}

export { createSuperAdmin };