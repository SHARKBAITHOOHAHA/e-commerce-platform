const jwt = require("jsonwebtoken");

exports.checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = {
            email: decodedToken.email,
            userId: decodedToken.userId,
        };
        next();
    } catch (err) {
        res.status(401).json({
            message: "You are not logged in. Please log in!",
            error: err,
        });
    }
};
