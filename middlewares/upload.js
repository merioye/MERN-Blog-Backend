const multer = require("multer");
const path = require("path");

// storage engine for multer
const storageEngine = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, callback) => {
        const index = file.originalname.lastIndexOf(".");
        callback(
            null,
            file.originalname.slice(0, index) +
                "-" +
                Date.now() +
                path.extname(file.originalname)
        );
    },
});

const fileFilter = (req, file, callback) => {
    let allowedFileTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/svg+xml",
        "image/svg",
    ];
    if (allowedFileTypes.includes(file.mimetype)) {
        // will store the file
        callback(null, true);
    } else {
        // rejects storing a file
        callback(null, false);
    }
};

// initialize multer
let upload = multer({
    storage: storageEngine,
    fileFilter: fileFilter,
});

module.exports = upload;
