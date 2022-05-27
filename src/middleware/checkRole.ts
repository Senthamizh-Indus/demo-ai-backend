import { Request, Response, NextFunction } from "express";
import User from "../entities/User";
import { dbCreateConnection } from "../orm/dbCreateConnection";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = res.locals.jwtPayload.userId;

    //Get user role from the database
    const userRepository = dbCreateConnection.getMongoRepository(User);
    // let user = new User();
    try {
      // user = await userRepository.aggregate(); findOneOrFail(id);
      const user = userRepository.aggregateEntity([{
        $match: {
          _id: id,
        }
      },
        {
          $group: {
          role: {
            role_name: '$role.role_name',
          }
        }
      }])
      console.log("Check User ==> ", user);
    } catch (id) {
      res.status(401).send();
    }

    //Check if array of authorized roles includes the user's role
    let count: number = 0;
    // console.log(user.role);
    
    // user.role.forEach((role) => {
    //   if (roles.indexOf(role.role_name) > -1) count++;
    // });

    // if (count > 0) {
    //   next();
    // } else {
    //   res.status(401).send({ message: "You are not authorized" });
    // }
  };
};
