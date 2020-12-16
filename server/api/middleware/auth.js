module.exports = {
    validateUserBody,
    checkExistingUsers,
    validateHeaders
};

function validateUserBody(req, res, next) {
    const user = req.body;

    if (user) {
        console.log(user)
    } else {
        res.status(400).json({
            message: "No user provided"
        });
    }
    next()
}

function checkExistingUsers(req, res, next) {
    console.log(req.body)
    next()
}

function validateHeaders(req, res, next) {
    console.log(req.body)
    next()
}
