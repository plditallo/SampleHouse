const router = require("express").Router();
const {
    hashSync
} = require("bcryptjs");
const {
    body,
    validationResult
} = require('express-validator');

const tokenEmailer = require("../utils/tokenEmailer.js")
const {
    getToken,
    removeToken,
} = require("../../../database/model/tokenModel");
const {
    getUserById,
    updateUser,
    getUserByEmail
} = require("../../../database/model/userModel");


router.use("/confirmation", (req, res) => {
    const token = req.url.slice(1);
    getToken(token).then(([token]) => {
        //* token has expired or not found
        if (!token || (Date.now() - token.expiresAt >= 0)) {
            //* remove expired token
            if (token) removeToken(token.userId).then(null)
            return res.status(400).send({
                type: 'not-verified',
                msg: 'We were unable to find a valid token. Your token may have expired.'
            })
        }
        //* verify user
        getUserById(token.userId).then(([user]) => {
            if (!user) return res.status(400).send({
                msg: 'We were unable to find a user for this token.'
            });
            if (user.isVerified) return res.status(400).send({
                type: 'already-verified',
                msg: 'This user has already been verified.'
            });

            user.isVerified = true

            updateUser(user.id, user).then(() => res.status(200).send("The account has been verified. Please log in.")).catch(err => res.status(500).send({
                msg: err.message
            }))
            //? why is the .then required to remove the token?
            removeToken(user.id).then(null)
        })
    })
})

router.get("/resend", [body('email').isEmail().normalizeEmail()], (req, res) => {
    //* check for active tokens first and remove
    const {
        email
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors.array());

    getUserByEmail(email).then(([user]) => {
        if (!user) return res.status(400).send({
            msg: "We were unable to find a account associated with this email."
        })
        if (user.isVerified) return res.status(400).send({
            msg: 'This account has already been verified. Please log in.'
        });
        //* remove any existing tokens
        removeToken(user.id).then(null)

        return res.send(tokenEmailer(user, req.headers.host))
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
            if (Date.now() - user.passwordResetExpires >= 0) {
                user.passwordResetToken = null
                user.passwordResetExpires = null
                return updateUser(user.id, user).then(() => res.status(400).send({
                    type: 'token-expired',
                    msg: 'We were unable to find a valid token. Your token may have expired.'
                }))
            }
            if (user.passwordResetToken === token) {
                user.passwordResetToken = null
                user.passwordResetExpires = null
                user.password = hashSync(password, 13)
                return updateUser(user.id, user).then(() => res.status(200).send({
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

router.use("/", (req, res) => {
    res.status(200).json({
        Route: "Token Route"
    });
});


module.exports = router
