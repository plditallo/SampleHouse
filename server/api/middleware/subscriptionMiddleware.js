const userDb = require("../../../database/model/userModel");

module.exports = {
    validateUser
};


function validateUser(req, res, next) {
    const user = req.body
    userDb.getUserByEmail(user.email).then(([user]) => {
        if (user) next()
        else {
            res.status(400).json({
                message: "No user found.",
            })
        }
    })


}

function validateHeaders(req, res, next) {
    console.log(req.body)
    next()
}
