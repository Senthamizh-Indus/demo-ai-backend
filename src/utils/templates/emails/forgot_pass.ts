const subject_mail = "OTP: For Reset Password"

const content = (otp: any) =>{
    return `Dear User, \n\n` 
    + 'OTP for Reset Password is : \n\n'
    + `${otp}\n\n`
    + 'This OTP is valid for only 10 minutes.\n\n'
    + 'This is a auto-generated email. Please do not reply to this email.\n\n'
    + 'Regards\n'
    + 'Indus Net Technologies Pvt. Ltd.\n\n'
}

export {subject_mail, content};