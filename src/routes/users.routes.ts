import express from 'express';
import controller from '../controllers/users.controller';
import { RoleEnum } from '../entities/RoleEnum';
import { checkRole } from '../middleware/checkRole';
import { checkJwt } from '../middleware/checkToken';


const router = express.Router();

// get the all the list of users
router.get('/users', controller.getUsers);


// Get the user by id
// router.get('/user/:id',[checkJwt, checkRole([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN])] ,controller.getUser);
router.get('/user/:id', controller.getUser);

// Add the User
// router.post('/user',[checkJwt, checkRole([RoleEnum.SUPER_ADMIN])] ,controller.addUser);
// router.post('/user',[checkJwt] ,controller.addUser);
router.post('/user', controller.addUser);
 
// Update the user by id
// router.put('/user',[checkJwt, checkRole(["ADMIN"])], controller.updateUser);
router.put('/user/:id', controller.updateUser);

// Delete the user by id
// router.delete('/user/:id',[checkJwt, checkRole(["ADMIN"])], controller.deleteUser);
router.delete('/user/:id', controller.deleteUser);

export = router;