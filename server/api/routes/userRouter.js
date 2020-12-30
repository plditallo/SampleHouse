const router = require("express").Router();
const {
    insertUser,
    getUserByEmail,
    updateUser,
    getUserById,
    removeUser
} = require("../../../database/model/userModel");
const {
    hashSync,
    compareSync
} = require("bcryptjs");
const jwt = require("jsonwebtoken")
const tokenEmailer = require("../utils/tokenEmailer");
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
        const user = {
            id: uuidv1(),
            email,
            password: hashSync(password, 13),
        }

        insertUser(user)
            .then(() => res.send(tokenEmailer(user, req.headers.host)))
            .catch((err) =>
                res.status(500).json(err)
            );
    });
//todo Make sure that you can't have 2 subscriptions for a client at the same time.
// https://stackoverflow.com/questions/23507200/good-practices-for-designing-monthly-subscription-system-in-database

//todo logging in from VST? (Header? HOST??) -> validateSubscription
//todo use user.active for vst auth
// todo check if active subscription or not (user.active)
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
                if (!compareSync(password, user.password)) return res.status(403).json({
                    msg: "Invalid credentials"
                });
                //* Check user has verified email
                if (!user.isVerified) return res.status(401).send({
                    type: 'not-verified',
                    msg: 'Your account has not been verified.'
                });
                user.last_login = Date.now()
                updateUser(user).then(null)
                //* Login successful, write token, and send back user
                user.token = generateToken(user);
                res.status(200).json(user);
            })
            .catch((err) => res.status(500).json({
                msg: "unable to retrieve user",
                error: err.message,
            }))
    });

// todo I think tokens are stacking when double clicking here...
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
            //* sends token email & saves variable
            const token = tokenEmailer(user, req.headers.host, "password");

            user.password_reset_token = token.token
            user.password_reset_expires = Date.now() + 21600000 //6hrs

            updateUser(user).then(() => res.status(200).send('A email as been sent with a link to reset your password.'))
        })
})

//todo post here from form w/ body containing email, newPass, and token
router.post("/resetPassword", [body('email').isEmail().normalizeEmail()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors.array());
    const {
        email,
        password,
        token
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
            //* Token expired
            if (Date.now() - user.password_reset_expires >= 0) {
                user.password_reset_token = null
                user.password_reset_expires = null
                return updateUser(user).then(() => res.status(400).send({
                    type: 'token-expired',
                    msg: 'We were unable to find a valid token. Your token may have expired.'
                }))
            }
            if (user.password_reset_token === token) {
                user.password_reset_token = null
                user.password_reset_expires = null
                user.password = hashSync(password, 13)
                return updateUser(user).then(() => res.status(200).send({
                    type: 'password-reset',
                    msg: 'Password has been successfully been changed. Click this link to login: http:\/\/' + req.headers.host + '\/api\/user\/login\/.'
                }))
            }
            return res.status(400).send({
                type: 'wrong-token',
                msg: 'We were unable to find a valid token. Your token may have expired.'
            })
        })
})

router.delete("/:id", (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors.array());
    const {
        id
    } = req.params;
    const {
        password
    } = req.body;

    getUserById(id).then(([user]) => {
        if (!user) return res.status(403).json({
            msg: 'The user id:' + id + ' is not associated with any account.'
        });
        //* Check password
        if (!compareSync(password, user.password)) return res.status(403).json({
            msg: "Invalid password"
        });
        if (user.balance > 0) return res.status(403).json({
            msg: 'This account still has a balance of ' + user.balance + ' credits. Please spend remaining credits before deleting account.'
        });
        removeUser(id).then(() => res.status(200).send({
            msg: "Successfully removed user"
        }))
    })
})

router.use("/", (req, res) => {
    res.status(200).json({
        Route: "User Route"
    });
});

module.exports = router;


function generateToken(user) {
    const {
        JWT_SECRET
    } = process.env
    const payload = {
        subject: user.id,
    };
    const options = {
        expiresIn: "48h",
    };
    return jwt.sign(payload, JWT_SECRET, options);
}
