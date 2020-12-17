const userDb = require("../../../database/model/userModel");

module.exports = {
    validateUserBody,
    checkExistingUsers,
    validateHeaders
};

function validateUserBody(req, res, next) {
    const user = req.body;

    if (user) {
        if (!user.email || !user.password) {
            res.status(400).json({
                message: "Please provide email and password"
            })
        }
    } else {
        res.status(400).json({
            message: "No user provided"
        });
    }
    next()
}

function checkExistingUsers(req, res, next) {
    const user = req.body
    userDb.getUserByEmail(user.email).then(oldUser => {
        if (oldUser.length) {
            res.status(400).json({
                message: "This email is already associated with an account.",
            })
        } else next()
    })


}

function validateHeaders(req, res, next) {
    console.log(req.body)
    next()
}
