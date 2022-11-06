const router = require("express").Router();
const User = require("../../models/user");
const PasswordReset = require("../../models/passwordReset");
const sendEmail = require("../../utils/sendEmail");
const { v4 } = require("uuid");

router.post("/forgotpassword", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(403).json({
                message: "Email is required to get reset password link",
            });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                message: "User does not exist with the provided email",
            });
        }

        const token = v4().toString().replace(/-/g, "");

        PasswordReset.updateOne(
            { user: user._id },
            { user: user._id, token: token },
            { upsert: true }
        )
            .then((updateResponse) => {
                const resetLink = `${process.env.CLIENT_APP_URL}/resetpassword/${token}`;
                sendEmail(user.username, email, resetLink);
                return res.status(200).json({
                    message:
                        "Check your email address for the password reset link!",
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Failed to generate reset link, please try again!",
                });
            });
    } catch (e) {
        res.status(500).json({
            message: "Server error",
        });
    }
});

module.exports = router;
