import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const token = <string>req.headers["auth"];
  console.log('Token', token);
  let jwtPayload: any;

  //Try to verify the token and get data
  try {
    jwtPayload = jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).json({ message: "unauthorized user" });
    return;
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { userId, email_id } = jwtPayload;
  const newToken = jwt.sign({ userId, email_id }, config.jwtSecret, {
    expiresIn: "1h",
  });
  res.setHeader("token", newToken);

  //Call the next middleware or controller
  next();
}
