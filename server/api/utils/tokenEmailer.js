module.exports = tokenEmailer

const nodemailer = require('nodemailer');
const crypto = require('crypto');
const {
    EMAIL_HOST,
    EMAIL_USERNAME,
    EMAIL_PASSWORD,
} = process.env;
const {
    insertToken
} = require("../../../database/model/tokenModel");


function tokenEmailer(user, host, type) {
    //* Create validation Token
    const token = {
        userId: user.id,
        token: crypto.randomBytes(16).toString('hex'),
        expiresAt: Date.now() + 43200000 //12hrs
    }
    if (type !== "password") insertToken(token).then(() => {
        //* email transporter and mail options
        const transporter = nodemailer.createTransport({
            host: EMAIL_HOST,
            pool: true,
            port: 465,
            secure: true, // use TLS
            auth: {
                type: "login",
                user: EMAIL_USERNAME,
                pass: EMAIL_PASSWORD
            }
        });

        const emailTemplate = {
            // todo change FROM to a no-reply@company.com
            from: 'no-reply@COMPANY.net',
            to: user.email,
            // todo change subject line to business name
            subject: 'Sound.House Account Verification Token',
            text: `Hello,\n\n Please verify your account by clicking the link: \nhttp:\/\/${host}\/api\/token\/confirmation\/${token.token}. This token will expire in 12 hours.`
        };
        if (type === "password") {
            emailTemplate.subject = "Sound.House Account Reset Password";
            // todo SEND EMAIL W/ LINK TO FORM TO REST PASSWORD THEN POST REQUEST
            emailTemplate.text = `Hello,\n\n Please reset your password by clicking the link: \nhttp:\/\/${host}\/api\/user\/resetPassword\/${token.token}. This will expire in 6 hours.`
        }

        //* Send verification email
        transporter.sendMail(emailTemplate, (err, info) => {
            if (err) return res.status(500).send({
                msg: err.message,
            });
        });
    })
    if (type === "password") return token
    return {
        msg: `A confirmation email has been sent to ${user.email}.`
    }
}
