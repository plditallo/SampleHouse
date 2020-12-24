const router = require("express").Router();
const {
    insertUser,
    getUserByEmail,
    updateUser
} = require("../../../database/model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const tokenEmailer = require("../utils/tokenEmailer");
// todo remove user from database
const {
    v1: uuidv1
} = require('uuid');
const {
    body,
    validationResult
} = require('express-validator');

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

        insertUser(user)
            .then(() => res.send(tokenEmailer(user, req.headers.host)))
            .catch((err) =>
                res.status(500).json(err)
            );
    });
// todo forgot password
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
        getUserByEmail(email)
            .then(([user]) => {
                if (!user) return res.status(403).json({
                    msg: 'The email address ' + req.body.email + ' is not associated with any account. Please double-check your email address and try again.'
                });
                //* Check password
                if (!bcrypt.compareSync(password, user.password)) return res.status(403).json({
                    msg: "Invalid credentials"
                });
                console.log(user)
                //* Check user has verified email
                if (!user.isVerified) return res.status(401).send({
                    type: 'not-verified',
                    msg: 'Your account has not been verified.'
                });
                //* Login successful, write token, and send back user
                // user.token = generateToken(user);
                res.status(200).json(user);
            })
            .catch((err) => res.status(500).json({
                msg: "unable to retrieve user",
                error: err.message,
            }))
    });

router.get("/forgotPassword", [body('email').isEmail().normalizeEmail()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors.array());

    const {
        email,
    } = req.body;

    getUserByEmail(email)
        .then(([user]) => {
            if (!user) return res.status(403).json({
                msg: 'The email address ' + req.body.email + ' is not associated with any account. Please double-check your email address and try again.'
            });
            if (!user.isVerified) return res.status(401).send({
                type: 'not-verified',
                msg: 'Your account has not been verified.'
            });
            // sends token email & saves variable
            const token = tokenEmailer(user, req.headers.host, "password");

            user.passwordResetToken = token.token
            user.passwordResetExpires = Date.now() + 21600000 //6hrs

            updateUser(user.id, user).then(() => res.status(200).send('A email as been sent with a link to reset your password.'))
        })
})

//todo validate w/ token in login?

router.use("/", (req, res) => {
    res.status(200).json({
        Route: "User Route"
    });
});

module.exports = router;
