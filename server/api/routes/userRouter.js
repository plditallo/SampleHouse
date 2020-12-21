const router = require("express").Router();
const userDb = require("../../../database/model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    v1: uuidv1
} = require('uuid');

const {
    JWT_SECRET = "not a secret"
} = process.env;

const {
    validateUserBody,
    checkExistingUsers,
    validateSubscription,
    validateHeaders,
} = require("../middleware/userMiddleware");
// todo validateSubscription for login

router.post("/register", validateUserBody, checkExistingUsers, (req, res) => {
    //todo email validation
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 13);
    user.password = hash;
    user.id = uuidv1();
    // console.log(user)
    userDb
        .insertUser(user)
        .then(([newUser]) => {
            user.token = generateToken(newUser);
            res.status(201).json({
                newUser
            });
        })
        .catch((err) =>
            res.status(500).json(err)
        );
});
// todo forgot password
// todo validateHeaders middleware
router.post("/login", (req, res) => {
    const {
        email,
        password
    } = req.body;

    userDb
        .getUserByEmail(email)
        .then(([user]) => {
            if (!user) {
                res.status(403).json({
                    message: "Email is not associated with any account."
                });
            } else if (bcrypt.compareSync(password, user.password)) {
                user.token = generateToken(user);
                res.status(200).json(user);
            } else {
                res.status(403).json({
                    errorMessage: "Invalid credentials, please try again."
                });
            }
        })
        .catch((err) => res.status(500).json({
            errorMessage: "unable to retrieve user",
            error: err,
        }))
});


//todo validate w/ token
router.post("/token", restricted, (req, res) => {
    const {
        authorization
    } = req.headers;
    console.log("restricted", {
        authorization
    });
    if (authorization) {
        jwt.verify(authorization, JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.status(401).json({
                    errorMessage: "Invalid Credentials"
                });
            } else {
                req.decodedToken = decodedToken;
                next();
            }
        });
    } else {
        res.status(400).json({
            message: "No credentials provided"
        });
    }
})

router.get("/users", (req, res) => {
    userDb
        .getUsers()
        .then((users) => res.status(200).json(users))
        .catch((err) =>
            res.status(500).json(err)
        );
});

router.use("/", (req, res) => {
    res.status(200).json({
        Route: "Auth Route up"
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
