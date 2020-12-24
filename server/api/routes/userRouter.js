const router = require("express").Router();
const userDb = require("../../../database/model/userModel");
const tokenDb = require("../../../database/model/tokenModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const {
    v1: uuidv1
} = require('uuid');
const {
    body,
    validationResult
} = require('express-validator');


const {
    EMAIL_HOST,
    EMAIL_USERNAME,
    EMAIL_PASSWORD,
    JWT_SECRET = "not a secret",
} = process.env;

const {
    checkExistingUsers
} = require("../middleware/userMiddleware");

// todo validateSubscription for login

router.post("/register",
    //* validate email and password
    [body('email').isEmail().normalizeEmail(),
        body('password').isLength({
            min: 6
        })
    ],
    checkExistingUsers, (req, res) => {
        //todo email validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send(errors.array());
        const {
            email,
            password
        } = req.body;
        const hash = bcrypt.hashSync(password, 13);
        const user = {
            id: uuidv1(),
            email: email,
            password: hash,
        }
        //* Create validation token
        const token = {
            userId: user.id,
            token: crypto.randomBytes(16).toString('hex')
        }
        // todo set privacy on folder for music, create user for login via api

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
            subject: 'Craig VST Account Verification Token',
            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/token\/confirmation\/' + token.token + '. This token will expire in 12 hours.'
        };

        userDb
            .insert(user)
            .then(([newUser]) => {
                tokenDb.insertToken(token).catch(err => res.status(500).send(err))
                //? transporter.verify() doesn't return undefined if undefined
                //* Send verification email
                transporter.sendMail(emailTemplate, (err, info) => {
                    if (err) return res.status(500).send({
                        msg: err.message,
                    });
                    return res.status(200).send({
                        msg: 'A verification email has been sent to ' + user.email + '.',
                        info: info
                    });
                });
            })
            .catch((err) =>
                res.status(500).json(err)
            );
    });
// todo forgot password
// todo validateHeaders middleware
//todo logging in from VST? (Header?)
//todo Make sure that you can't have 2 subscriptions for a client at the same time.
// https://stackoverflow.com/questions/23507200/good-practices-for-designing-monthly-subscription-system-in-database

//TODO .env file still not being ignored by git
router.post("/login",
    [body('email').isEmail().normalizeEmail()], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send(errors.array());

        const {
            email,
            password
        } = req.body;

        userDb
            .getUserByEmail(email)
            .then(([user]) => {
                if (!user) return res.status(403).json({
                    msg: 'The email address ' + req.body.email + ' is not associated with any account. Please double-check your email address and try again.'
                });
                //* Check password
                if (!bcrypt.compareSync(password, user.password)) {
                    res.status(403).json({
                        msg: "Invalid credentials"
                    });
                }
                //* Check user has verified email
                if (!user.isVerified) return res.status(401).send({
                    type: 'not-verified',
                    msg: 'Your account has not been verified.'
                });
                //* Login successful, write token, and send back user
                user.token = generateToken(user);
                res.status(200).json(user);
            })
            .catch((err) => res.status(500).json({
                msg: "unable to retrieve user",
                error: err,
            }))
    });


//todo validate w/ token in login?

router.use("/", (req, res) => {
    res.status(200).json({
        Route: "User Route"
    });
});

module.exports = router;

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
    };
    // const secret = JWT_SECRET || "not a secret";
    const options = {
        expiresIn: "72h",
    };
    return jwt.sign(payload, JWT_SECRET, options);
}
