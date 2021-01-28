const router = require("express").Router();
const nodemailer = require('nodemailer');

const {
    EMAIL_HOST,
    EMAIL_USERNAME,
    EMAIL_PASSWORD,
} = process.env;

router.post("/", (req, res) => {
    const {
        name,
        email,
        subject,
        message
    } = req.body;

    const emailTemplate = {
        from: email,
        // to: "braden@bluesmokemedia.net",
        to: "support@sample.house", //todo not receiving emails to this email
        subject: `Contact-${subject}`,
        text: `From ${name}, \n\n${message} \n\nHave a great day Craig :D`
    };

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
    res.status(200).json({
        msg: "Successfully submitted. Please expect a reply within 24-48 hours."
    }) //todo message
})

module.exports = router
