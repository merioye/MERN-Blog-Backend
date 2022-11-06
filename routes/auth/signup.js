const router = require("express").Router();
const User = require("../../models/user");
const upload = require("../../middlewares/upload");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const sendEmail = require("../../utils/sendEmail");

router.post("/signup", upload.single("file"), async (req, res) => {
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
            confirmPassword: Joi.string()
                .valid(Joi.ref("password"))
                .required()
                .strict(),
        });

        // validating request
        const result = schema.validate(req.body);
        const { err } = result;
        const valid = err === null;

        if (!valid) {
            return res.status(422).json({
                message: "Invalid request",
                data: req.body,
            });
        }

        const user = await User.findOne({
            $or: [{ username: username }, { email: email }],
        });
        if (user) {
            return res.status(422).json({
                message: "User already exist",
                data: req.body,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            email: email,
            image: req.file.filename,
            password: hashedPassword,
        });

        const isSaved = await newUser.save();
        if (!isSaved) {
            return res.status(500).json({
                message: "User registration failed!",
                data: req.body,
            });
        }

        sendEmail(username, email);

        res.status(201).json({
            message: "User registered successfully!",
        });
    } catch (e) {
        res.status(500).json({
            message: e,
        });
    }
});

module.exports = router;
