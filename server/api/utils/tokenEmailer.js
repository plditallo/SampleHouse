module.exports = tokenEmailer

const nodemailer = require('nodemailer');
const crypto = require('crypto');
//todo crypto build in? yarn upgrade
const {
    EMAIL_HOST,
    EMAIL_USERNAME,
    EMAIL_PASSWORD,
} = process.env;
const {
    insertToken
} = require("../../../database/model/tokenModel");
const {
    CLIENT_URL
} = process.env;

function tokenEmailer(user, host, type) {
    //* Create validation Token
    const token = {
        userId: user.id,
        token: crypto.randomBytes(16).toString('hex'),
        expiresAt: Date.now() + 43200000 //12hrs
    } //todo check all ${host} to be sure it is working properly (check w/ heroku)
    const emailTemplate = {
        from: 'no-reply@Sample.House',
        to: user.email,
        subject: 'Sample.House Account Verification Token',
        text: `Hello,\n\n Please verify your account by clicking the link: \nhttp:\/\/${host}\/api\/token\/reset-password.html#${token.token}. This token will expire in 12 hours.`
    };
    if (type === "password") {
        emailTemplate.subject = "Sample.House Account Reset Password";
        emailTemplate.text = `Hello ${user.first_name},\n\n Please reset your password by clicking the following link: \n${CLIENT_URL}/html/reset-password.html#token=${token.token}. This link will expire in 6 hours.`
    }
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
    //* Send verification email
    transporter.sendMail(emailTemplate, (err, info) => {
        if (err) return res.status(500).send({
            msg: err.message,
        });
    });
    if (type === "password") return token
    //* Insert verification token
    insertToken(token).then(null)
    return {
        msg: `A confirmation E-mail has been sent to ${user.email}.`
    }

}
