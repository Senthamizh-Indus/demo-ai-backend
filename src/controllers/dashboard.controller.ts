import { Request, Response, NextFunction } from 'express';
import Role from '../entities/Role';
import { dbCreateConnection } from '../orm/dbCreateConnection';
import { Status } from '../entities/CommonEntity';
import User from '../entities/User';
import Orders, { OrderStatus } from '../entities/Order';

// getting all Roles
const getActiveCards = async (req: Request, res: Response, next: NextFunction) => {

    try {

        let activeOrderCount = 0;
        let cancelledOrderCount = 0;
        let completedOrderCount = 0;
        let activeUsers = {};
        let orderCount = {};

        const roles = await dbCreateConnection.getMongoRepository(Role).find();
        const users = await dbCreateConnection.getMongoRepository(User).find();
        const orders = await dbCreateConnection.getMongoRepository(Orders).find();

        for(const role of roles) {
            // activeUsers[role.role_name]
            let count = 0;
            for(const user of users) {
                if((user.role_id[0].toString() === role.id.toString()) && (user.status === Status.Active)) {
                    count++;
                }
            }
            activeUsers[role.role_name] = count;
        }

        for(const order of orders) {
            if(order.order_status !== OrderStatus.delivered && order.order_status !== OrderStatus.cancelled && order.status === Status.Active) {
                activeOrderCount++;
            }

            if(order.order_status === OrderStatus.delivered && order.status === Status.InActive) {
                completedOrderCount++;
            }

            if(order.order_status === OrderStatus.cancelled && Status.InActive) {
                cancelledOrderCount++;
            }
        }
        
        orderCount['Active_Order_Count'] = activeOrderCount;
        orderCount['Completed_Order_Count'] = completedOrderCount;
        orderCount['Cancelled_Order_Count'] = cancelledOrderCount;

        return res.status(200).json({
            message: 'Querying all active users is successful',
            activeUsr: activeUsers,
            orderCount: orderCount
        });

    } catch (error) {
        const typedError = error as Error;
        return res.status(404).json({
            message: 'Querying all Roles was failed',
            error : typedError.message? typedError.message: error
        });
    }
};
 
export default { getActiveCards };