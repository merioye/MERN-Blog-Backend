const router = require("express").Router();
const User = require("../../models/user");
const auth = require("../../middlewares/auth");
const Joi = require("joi");
const upload = require("../../middlewares/upload");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

router.get("/profile", auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id });
        res.status(200).json({
            username: user.username,
            email: user.email,
            file: user.image,
        });
    } catch (e) {
        res.status(500).json({
            message: "Some problem occurred",
        });
    }
});

router.put("/profile", auth, upload.single("file"), async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Validation schema
        const schema = Joi.object().keys({
            username: Joi.string()
                .regex(/^[A-Za-z0-9]{3,16}$/)
                .required(),
            email: Joi.string().email().required(),
            password: Joi.string()
                .regex(
                    /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/
                )
                .required(),
        });

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

        const user = await User.findByIdAndUpdate(
            { _id: req.id },
            {
                username: username,
                email: email,
                image: req.file.filename,
                password: hashedPassword,
            }
        );

        // deleting the user's previous profile image which was sotred in uploads directory
        fs.unlink(
            path.join(__dirname, "../../public/uploads/", user.image),
            (err) => {
                if (err) {
                    throw new Error(err);
                }
            }
        );

        res.status(200).json({
            message: "Profile updated successfully!",
        });
    } catch (e) {
        res.status(500).json({
            message: "Some problem occured",
        });
    }
});

router.delete("/profile", auth, (req, res) => {
    try {
        User.findByIdAndDelete({ _id: req.id }, (err, deletedUser) => {
            if (err) {
                return res.status(500).json({
                    message: "Some problem occurred",
                });
            }
            fs.unlink(
                path.join(
                    __dirname,
                    "../../public/uploads/",
                    deletedUser.image
                ),
                (err) => {
                    if (err) {
                        throw new Error(err);
                    }
                }
            );
        });

        res.cookie("accessToken", null, {
            httpOnly: true,
            expires: new Date(Date.now()),
        });

        res.status(200).json({
            message: "Your account deleted successfully",
        });
    } catch (e) {
        res.status(500).json({
            message: "Some problem occured",
        });
    }
});

module.exports = router;
