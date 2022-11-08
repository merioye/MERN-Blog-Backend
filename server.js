require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// constants
const DB = process.env.DB_URL;
const port = process.env.PORT || 8000;
const corsOptions = {
    origin: process.env.CLIENT_APP_URL,
    credentials: true,
};

const uploadsPath = path.join(__dirname, "/public/uploads");
const app = express();

// Database connection
mongoose
    .connect(DB)
    .then(() => console.log("DB connected.."))
    .catch((e) => console.log(e));

// basic app configuration
app.use(() => {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", process.env.CLIENT_APP_URL);
    res.header(
        "Access-Control-Allow-Methods",
        "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
    );
    next();
});
app.use(express.static(uploadsPath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());

// routes
const signupRoute = require("./routes/auth/signup");
const signinRoute = require("./routes/auth/signin");
const logoutRoute = require("./routes/auth/logout");
const forgotPasswordRoute = require("./routes/auth/forgotPassword");
const resetPasswordRoute = require("./routes/auth/resetPassword");
const profileRoute = require("./routes/auth/profile");
const postsRoute = require("./routes/blogPost/posts");
const commentsRoute = require("./routes/blogPost/comments");

app.use(signupRoute);
app.use(signinRoute);
app.use(logoutRoute);
app.use(forgotPasswordRoute);
app.use(resetPasswordRoute);
app.use(profileRoute);
app.use(postsRoute);
app.use(commentsRoute);

app.listen(port, () => console.log(`Server is running at port ${port}`));
