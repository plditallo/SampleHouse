const router = require("express").Router();
const {
    insertUser,
    getUserByEmail,
    updateUser,
    getUserById,
    removeUser
} = require("../../../database/model/userModel");
const {
    getSubscriberById,
    removeSubscription
} = require("../../../database/model/subscriptionModel");
const {
    getDownloadsByUserId
} = require("../../../database/model/soundDownloadModel");
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
const restricted = require("../middleware/restricted");

//todo split this into a auth router and a user router

router.post("/register",
    //* validate email and password
    [body('email').isEmail().normalizeEmail(),
        body('password').isLength({
            min: 6
        })
    ],
    checkExistingUsers, (req, res) => {
        // todo set role to "beta" for 1st week of deployment (use Date.now and the date 1 week after live deployment)
        // console.log("body", req.body)
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send(errors.array());
        const {
            email,
            password,
            first_name,
            last_name
        } = req.body;
        const user = {
            id: uuidv1(),
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: hashSync(password, 13),
            created: Date.now()
        }
        // todo check req.headers.host once live
        insertUser(user)
            .then(() => res.status(200).json(tokenEmailer(user, req.headers.host)))
            .catch((err) =>
                res.status(500).json(err)
            );
    });
// https://stackoverflow.com/questions/23507200/good-practices-for-designing-monthly-subscription-system-in-database

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
                    msg: `The email address ${req.body.email} is not associated with any account. Please double-check your email address and try again.`
                });
                //* Check password
                if (!compareSync(password, user.password)) return res.status(403).json({
                    msg: "Incorrect Password."
                });
                //* Check user has verified email
                if (!user.isVerified) return res.status(401).send({
                    type: 'not-verified',
                    msg: 'Your account has not been verified.'
                });
                //* check active subscription
                getSubscriberById(user.id).then(([subscriber]) => {
                    if (subscriber && subscriber.subscribe_end - Date.now() > 0)
                        user.active_subscription = true
                    else {
                        user.active_subscription = false
                        user.vst_access = false
                        removeSubscription(user.id).then(null)
                    }
                    user.last_login = Date.now()
                    if (user.role === "testing") { //!testing
                        user.vst_access = true
                    }
                    updateUser(user).then(null)
                    //* Login successful, write token, and send back user
                    res.status(200).json({
                        token: generateToken(user)
                    });
                })
            })
            .catch((err) => res.status(500).json({
                msg: "unable to retrieve user",
                error: err.message,
            }))
    });

router.post("/forgotPassword", [body('email').isEmail().normalizeEmail()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors.array());

    const {
        email,
    } = req.body;

    getUserByEmail(email)
        .then(([user]) => {
            if (!user) return res.status(403).json({
                msg: `The email address ${req.body.email} is not associated with any account. Please double-check your email address and try again.`
            });
            // if (!user.isVerified) return res.status(401).send({
            //     type: 'not-verified',
            //     msg: 'Your account has not been verified.'
            // });
            //* send token email & save variable
            const token = tokenEmailer(user, req.headers.host, "password");

            user.password_reset_token = token.token
            user.password_reset_expires = Date.now() + 21600000 //6hrs
            updateUser(user).then(() => res.status(200).send({
                msg: `A E-mail as been sent to ${req.body.email} with a link to reset your password. This link will expire in 6 hours.`
            }))
        })
})

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
                msg: `The email address ${req.body.email} is not associated with any account. Please double-check your email address and try again.`
            });
            //* Token expired
            // console.log(user.password_reset_token, token);
            if (Date.now() - user.password_reset_expires >= 0) {
                user.password_reset_token = null
                user.password_reset_expires = null
                return updateUser(user).then(() => res.status(400).json({
                    type: 'token-expired',
                    msg: 'We were unable to find a valid token. Your link has expired.'
                }))
            }
            if (user.password_reset_token === token) {
                user.password_reset_token = null
                user.password_reset_expires = null
                user.password = hashSync(password, 13)

                return updateUser(user).then(() => res.status(200).json({
                    type: 'password-reset',
                    msg: `Password has been successfully been changed.`
                }))
            }
            return res.status(400).json({
                type: 'wrong-token',
                msg: 'We were unable to find a valid token. Please try the reset-password link again in your email.'
            })
        })
})

// router.delete("/:id", (req, res) => {
//     //todo check token to see if user is trying to delete (not someone else)
//? use token w/ restricted route
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).send(errors.array());
//     const {
//         id
//     } = req.params;
//     const {
//         password
//     } = req.body;

//     getUserById(id).then(([user]) => {
//         if (!user) return res.status(403).json({
//             msg: `The user id: ${id} is not associated with any account.`
//         });
//         //* Check password
//         if (!compareSync(password, user.password)) return res.status(403).json({
//             msg: "Invalid password"
//         });
//         if (user.balance > 0) return res.status(403).json({
//             msg: `This account still has a balance of ${user.balance} credits. Please spend remaining credits before deleting account.`
//         });
//         removeUser(id).then(() => res.status(200).send({
//             msg: "Successfully removed user"
//         }))
//     })
// })

router.get("/:id", (req, res) => {
    const id = req.params.id;
    getUserById(id).then(([user]) => {
        if (user) {
            let userData = {};
            userData.id = user.id;
            userData.first_name = user.first_name
            userData.last_name = user.last_name
            userData.active_subscription = user.active_subscription;
            userData.balance = user.balance;
            userData.payPal_subscription_id = user.payPal_subscription_id;
            userData.role = user.role;
            if (user.active_subscription)
                getSubscriberById(user.id).then(([sub]) => {
                    userData.currentPlanId = sub.plan_id;
                    res.status(200).json(userData)
                })
            else res.status(200).json(userData)
        }
    })
})

router.get("/:id/downloads", restricted, async (req, res) => {
    const id = req.params.id;
    const downloads = await getDownloadsByUserId(id);
    console.log({
        downloads
    })
    if (downloads) res.status(200).json(downloads)
    else res.status(500)
})

router.use("/", (req, res) => {
    res.status(200).json({
        Route: "User Route"
    });
});

module.exports = router;

//todo send userType (admin/moderator/user)
function generateToken(user) {
    // console.log(user)
    const {
        id,
        vst_access,
        active_subscription
    } = user;
    const {
        JWT_SECRET
    } = process.env
    const payload = {
        subject: id,
        vst_access,
    };
    const options = {
        expiresIn: "72hr",
    };
    return jwt.sign(payload, JWT_SECRET, options);
}
