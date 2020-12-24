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


function tokenEmailer(user, host) {
    //* Create validation Token
    const token = {
        userId: user.id,
        token: crypto.randomBytes(16).toString('hex')
    }

    insertToken(token).then(() => {
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
            subject: 'Craig VST Account Verification Token',
            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + host + '\/api\/token\/confirmation\/' + token.token + '. This token will expire in 12 hours.'
        };

        //* Send verification email
        transporter.sendMail(emailTemplate, (err, info) => {
            if (err) return res.status(500).send({
                msg: err.message,
            });
        });
    })
    return {
        msg: 'A verification email has been sent to ' + user.email + '.'
    }
}
