const router = require("express").Router();
const userDb = require("../../../database/model/userModel");
const subDb = require('../../../database/model/subscriptionModel');

const {
    validateUser,
    validateSubscription
} = require("../middleware/subscriptionMiddleware");

router.post("/subscribe", validateUser, validateSubscription, (req, res) => {
    const {
        email,
        subscription
    } = req.body;

    userDb.getUserByEmail(email).then(([user]) => subDb.getSubByTier(subscription).then(([sub]) => {
        console.log(user.subDate)
        // todo check for current sub and add 30 days
        const data = {
            "subDate": Date.now(),
            "balance": user.balance + sub.credits,
            "tier": sub.tier
        }
        userDb.updateUser(user.id, data).then(resp => res.status(201).json(resp)).catch(err => res.status(403).json(err))
    }))
    // const user = async () => await userDb.getUserByEmail(email).then(([user]) => user).catch(err => res.status(403).json(err))

    // const sub = subDb.getSubByTier(subscription).then(([sub]) => sub).catch(err => res.status(403).json(err));

    // const data = {
    //     "subDate": Date.now(),
    //     "balance": user.balance + sub.credits,
    //     "tier": subscription
    // }

    // console.log(user, sub, data)

    // userDb.updateUser(user.id, data).then(resp => res.status(201).json(resp)).catch(err => res.status(403).json(err))
});

// !remove below
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
                    msg: "Email is not associated with any account."
                });
            } else if (bcrypt.compareSync(password, user.password)) {
                // user.token = generateToken(user);
                res.status(200).json(user);
            } else {
                res.status(403).json({
                    errormsg: "Invalid credentials, please try again."
                });
            }
        })
        .catch((err) => res.status(500).json({
            errormsg: "unable to retrieve user",
            error: err,
        }))
});

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
        expiresIn: "2w",
    };
    return jwt.sign(payload, JWT_SECRET, options);
}
