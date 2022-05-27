import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'in.ent.common.123@gmail.com',
                pass: 'inent@321',
            },
        });

        await transporter.sendMail({
            from: 'in.ent.common.123@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        const typedError = error as Error;
        console.log(typedError.message, "email not sent");
    }
};

