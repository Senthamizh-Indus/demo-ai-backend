import express from 'express';
import controller from '../controllers/roles.controller';

const router = express.Router();

// get the all the list of roles
router.get('/roles', controller.getRoles);

// Get the role by id
router.get('/role/:id', controller.getRole);

// Add the role
router.post('/role', controller.addRole);

// Update the role by id
router.put('/role', controller.updateRole);

// Delete the role by id
router.delete('/role/:id', controller.deleteRole);
 
export = router;