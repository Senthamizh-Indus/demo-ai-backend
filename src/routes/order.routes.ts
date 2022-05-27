import express from "express";
import controller from "../controllers/order.controller";
import { upload } from "../middleware/fileUploadMiddleware";
// import createOrder, getOrders, getOrder, updateOrder, deleteOrder from "../controllers/order.controllers";

const router = express.Router();

// create a orders
router.post('/order', [upload.array('proof', 3)], controller.createOrder);

// Upload Documents
router.post('/upload', [upload.single('addressProof'), upload.single('productInvoice'), upload.single('purchasedProof')], controller.uploadFile);
router.post('/uploads', [upload.array('proof', 3)], controller.createOrder);

// get the all the orders
router.get('/orders', controller.getOrders);

// Get the single order by id
router.get('/order/:id', controller.getOrder);

// Get the single order by id
router.get('/orderById/:id', controller.getOrderById);

// Update the order by id
router.put('/order/:id', controller.updateOrder);

// Delete the Order by id
router.delete('/order/:id', controller.deleteOrder);

router.post('/approvalFileUpload', [upload.single('file'), upload.single('file'), upload.single('file')], controller.uploadFile);

// router.post('/approvalFileUploadSample', [uploadSample.single('file')], controller.uploadFile)

export = router;