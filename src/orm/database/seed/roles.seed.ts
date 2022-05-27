import { dbCreateConnection } from '../../dbCreateConnection';

// // @ts-ignore
// import { name, internet, random, date, lorem, hacker } from 'faker';
import Role from '../../../entities/Role';
import { createSuperAdmin } from './users.seed';
import { Status } from '../../../entities/CommonEntity';

const createRoles = async() => {
    const roles = [ 'Super Admin', 'Admin', 'Seller', 'Transporter'];
    for (const role of roles) {

        try {
            const roleEntity = new Role();
            roleEntity.role_name = role;
            roleEntity.status = Status.Active;
            
            const roleCreate = dbCreateConnection.getMongoRepository(Role).create(roleEntity);
            const role_Result = await dbCreateConnection.getMongoRepository(Role).save(roleCreate); 

            try {
                if (role === 'Super Admin') {
                    await createSuperAdmin(role_Result.id);
                }
            } catch (error: any) {
                if (error.code == 11000) {
                    console.log('Data already exists, So seeding not needed');
                } else {
                    console.log('Error while seeding the SuperAdmin data to mongoDB', error);
                }
            }
        } catch (error: any) {
            if (error.code == 11000) {
                console.log('Data already exists, So seeding not needed');
            } else {
                console.log('Error while seeding the Role data to mongoDB', error);
            }
        }
    }
}

export { createRoles };