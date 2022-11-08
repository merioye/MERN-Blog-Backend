const router = require("express").Router();
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const accessToken = await jwt.sign(
            { id: user._id },
            process.env.TOKEN_SECRET
        );
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: new Date(Date.now() + 86400000),
        });

        res.status(200).json({
            message: "Logged in",
        });
    } catch (e) {
        res.status(500).json({
            message: e,
        });
    }
});

module.exports = router;
