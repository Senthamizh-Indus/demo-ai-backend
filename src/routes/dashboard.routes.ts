import express from 'express';
import controller from '../controllers/dashboard.controller';

const router = express.Router();

// get the list of acitve users and orders
router.get('/activeCards', controller.getActiveCards);
 
export = router;