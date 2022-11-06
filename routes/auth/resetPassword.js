const router = require("express").Router();
const User = require("../../models/user");
const PasswordReset = require("../../models/passwordReset");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

router.post("/resetpassword/:token", async (req, res) => {
    try {
        const { password } = req.body;
        const token = req.params.token;
        // Validation schema
        const schema = Joi.object().keys({
            password: Joi.string()
                .regex(
                    /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/
                )
                .required(),
            confirmPassword: Joi.string()
                .valid(Joi.ref("password"))
                .required()
                .strict(),
        });

        const isValid = await PasswordReset.findOne({ token: token });
        if (!isValid) {
            return res.status(403).json({
                message: "OOps, looks like this link is expired",
            });
        }

        // validating request
        const result = schema.validate(req.body);
        const { err } = result;
        const valid = err == null;

        if (!valid) {
            return res.status(422).json({
                message: "Invalid request",
                data: req.body,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        User.findByIdAndUpdate(
            { _id: isValid.user },
            { password: hashedPassword }
        )
            .then(async (updatedDoc) => {
                await PasswordReset.deleteOne({ _id: isValid._id });

                return res.status(200).json({
                    message: "Password updated successfully",
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Password could not be update",
                });
            });
    } catch (e) {
        res.status(500).json({
            message: e,
        });
    }
});

module.exports = router;
