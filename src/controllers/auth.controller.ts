import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import * as jwt from "jsonwebtoken";
import * as mongodb from "mongodb";
import otpGenerator from "otp-generator";
import config from "../config/config";
import { Login } from "../entities/Login";
import Otp from "../entities/Otp";
import User from "../entities/User";
import { sendEmail } from "../middleware/sendEmail";
import { dbCreateConnection } from "../orm/dbCreateConnection";
import { subject_mail, content } from "../utils/templates/emails/forgot_pass";
import * as common from "./common.controller";

//Login User
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  //Check if email_id and password are set
  let { email, password } = req.body;

  //Validation
  const schema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),

    password: Joi.string().min(6)
    .max(10),
  });
  
  const value = await schema.validateAsync(req.body);
  
  if (!(email && password)) {
    return res.status(400).json("Please enter email id and password");
  }

  //Get user from database
  const userRepository = dbCreateConnection.getMongoRepository(User);
  let user = new User();
  const email_id = email;
  try {
    user = await userRepository.findOneOrFail({ where: { email_id } });
  } catch (error) {
    res.status(401).json({ message: "Invalid email" });
  }

  //Check if encrypted password match
  if (!user.checkIfPasswordMatch(password)) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // Checks user is active or not
  if(!user.status) {
    return res.status(401).json({ message: "Invalid User" });
  }

  //Create JWT, valid for 1 hour
  const token = jwt.sign(
    { userId: user.id, email_id: user.email_id },
    config.jwtSecret,
    { expiresIn: "1h" }
  );

  let login = new Login();
  login.email_id = user.email_id;
  login.user_id = user.id;
  login.role_id = user.role_id[0];

  const loginDetail = await common.default.saveEntity(Login, login);

  //json the jwt in the response
  return res.status(200).json({ token, user });
};

// To add minutes to the current time
function AddMinutesToDate(date: { getTime: () => number }, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

const GenerateOtp = async (email_id: string, id: mongodb.ObjectId) => {
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const now = new Date();
  const expiration_time = AddMinutesToDate(now, 10);

  sendEmail(email_id, subject_mail, content(otp));

  //Create OTP instance in DB
  const otp_instance = dbCreateConnection.getMongoRepository(Otp).create({
    otp: otp,
    expiration_time: expiration_time,
    user_id: id,
  });

  const result = await dbCreateConnection
    .getMongoRepository(Otp)
    .save(otp_instance);

  console.log(result.otp);
  return result.otp;
};

//FORGOT_PASSWORD
const forgotPassword = async (req: Request, res:Response, next:NextFunction) => {
  
  try {  
    const email_id = req.body.email;
    if (!(email_id)) {
      res.status(400).json("Please Enter email address");
    }

    const userEmail = await dbCreateConnection.getMongoRepository(User).findOneByOrFail({where: { email_id }});
    if(userEmail){
      GenerateOtp(email_id, userEmail.id)
        .then((otp) => {
          console.log('Otp saved successfully', otp);
        })
        .catch((error) => {
          const typedError = error as Error;
          res.status(400).json({message: "Otp is not sent promise catch", error: typedError.message? typedError.message: error});
        });
    }

    res.status(200).json("OTP sent on your email address");
  } catch (error) {
    const typedError = error as Error;
    res.status(400).json({message: "Otp is not sent", error: typedError.message? typedError.message: error});
  }
}

const matchOtp = async (req: Request, res:Response, next:NextFunction) => {
  
  try {
    const otp = req.body.otp;
    if (!otp) {
      res.status(400).json("Please Enter otp");
    }

    //Match otp with database_otp
    const otpRepository = dbCreateConnection.getMongoRepository(Otp);
    let otp_test = new Otp();

    otp_test = await otpRepository.findOneOrFail({ where: { otp } });
    
    console.log(otp_test);
    return res.status(200).json(`OTP matched`);
  } catch (error) {
    const typedError = error as Error;
    return res.status(400).json({
      message: "Failed to match the otp",
      error: typedError.message? typedError.message : error
    });
  }
}

//CHANGE_PASSWORD
const changePassword = async (req: Request, res: Response) => {
  
  try {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).json("Please Enter Old and New Password");
    }

    //Get user from database
    const userRepository = dbCreateConnection.getMongoRepository(User);
    let user = new User();

    user = await userRepository.findOneOrFail(id);

    //Check if old password match
    if (!user.checkIfPasswordMatch(oldPassword)) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    //Hash the new password and save
    user.password = newPassword;
    user.hashPassword();
    userRepository.save(user);

    res.status(200).json({ message: "Your password is successfully changed" });
  } catch (error) {
    const typedError = error as Error;
    return res.status(400).json({
      message: "Something went wrong",
      error: typedError.message? typedError.message : error
    });
  }
};

//CHANGE_PASSWORD
const resetPasswordWithOtp = async (req: Request, res: Response) => {

  try {
    //Get ID from JWT
    console.log('Req body => ', req.body);
    const newPassword = req.body.newPassword;
    const email_id = req.body.email;

    //Get user from database
    const userRepository = dbCreateConnection.getMongoRepository(User);
    let user = new User();

    user = await userRepository.findOneByOrFail({where: { email_id }});

    // Hash the new password and save
    user.password = newPassword;
    user.hashPassword();
    userRepository.save(user);

    return res.status(200).json({ message: "Your password is successfully changed" });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" });
  }
};

export default { loginUser, GenerateOtp, forgotPassword, matchOtp, changePassword, resetPasswordWithOtp };
